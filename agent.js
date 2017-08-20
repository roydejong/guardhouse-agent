#!/usr/bin/env node

'use strict';

/**
 * Bootstrap file for the Guardhouse Agent
 */
const winston = require('winston');
const logging = require('winston-color');
const config = require('config');
const packageJSON = require('./package.json');
const OS = require("os");

// Initiate startup, read config and set up logging
const serverUrl = config.get('guardhouse.server');
const clientToken = config.get('guardhouse.token_client');
const loggingConfig = config.get('logging');

let logValue = 'Not set up';

if (loggingConfig.path) {
    try {
        logging.add(winston.transports.File, {
            filename: loggingConfig.path,
            level: 'info',
            json: false
        });

        logValue = loggingConfig.path;
    } catch (e) {
        logging.error('Unable to prepare log file:', e);
    }
}

logging.info('Guardhouse Agent is starting...');

let clientTokenMasked = 'Not set';

if (clientToken) {
    clientTokenMasked = '';
    
    for (let i = 0; i < clientToken.length; i++) {
        if (i >= (clientToken.length - 6)) {
            clientTokenMasked += clientToken[i];
        } else {
            clientTokenMasked += '*';    
        }
    }
}

let currentUser = OS.userInfo().username;
let osPlatform = OS.platform();
let osRelease = OS.release();

logging.info(' - Node environment: ' + (process.env.NODE_ENV ? process.env.NODE_ENV : 'default (Not provided)'));
logging.info(' - Target server:', serverUrl);
logging.info(' - Client token:', clientTokenMasked);
logging.info(' - Log target:', logValue);
logging.info(' - Current user:', currentUser);
logging.info(' - Platform:', `${osPlatform} / ${osRelease}`);

let abortStart = false;

if (osPlatform !== 'win32' && currentUser === 'root') {
    logging.warn('WARNING: For security reasons, it is not recommended to run the guardhouse-agent as superuser (root).');
    logging.warn(' - We highly recommend creating a separate user with specific permissions for the guardhouse-agent.');

    if (config.get('security.allow_root') !== true) {
        logging.error('Configuration problem: Your configuration does not allow the guardhouse-agent to run as superuser.');
        logging.error(' - To override this security policy, set "security.allow_root" to true.')

        abortStart = true;
    }
}

if (!serverUrl || !clientToken || clientToken.length < 8) {
    logging.error('Configuration problem: Core configuration is missing.');
    logging.error(' - Please ensure that a valid target server and access token (min length: 8) are set.');
    
    abortStart = true;
}

if (!config.get('guardhouse.allow_unsafe') && !serverUrl.indexOf('https://') !== 0) {
    logging.error('Configuration problem: Invalid target server: must start with "https://".');
    logging.error(' - HTTPS is highly recommended. To skip this check (for example, in a testing environment), set config variable "guardhouse.allow_unsafe" to true.');
    
    abortStart = true;
}

if (abortStart) {
    logging.error('Aborting startup due to bad configuration.');
    process.exit(1);
    return;
}

// ---------------------------------------------------------------------------------------------------------------------
// Config OK - starting for real, yo
// ---------------------------------------------------------------------------------------------------------------------

const net = require('./net');
const axios = require('axios');

// Set defaults for axios (net lib)
axios.defaults.headers.common['Authorization'] = clientToken;
axios.defaults.headers.common['X-Agent-Package'] = packageJSON.name;
axios.defaults.headers.common['X-Agent-Version'] = packageJSON.version;

// Start pull netcode (agent api server for push from server)
net.server.start();

// Perform self registration with the API (initial offer / sync config)
const selfReg = require('./net/remote/server-registration');
selfReg.perform();

// Schedule periodic polling for config changes
net.poller.start();

