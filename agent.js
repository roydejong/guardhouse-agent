/**
 * Bootstrap file for the Guardhouse Agent
 */
const winston = require('winston');
const logging = require('winston-color');
const config = require('config');

// Initiate startup, read config and set up logging
const serverUrl = config.get('guardhouse.server');
const accessToken = config.get('guardhouse.token');
const loggingConfig = config.get('logging');

let logValue = 'Not set up';

if (loggingConfig.path) {
    try {
        logging.configure({
            transports: [
                new (winston.transports.File)({
                    filename: loggingConfig.path,
                    level: 'info',
                    json: false
                }),
                new (winston.transports.Console)()
            ]
        });

        logValue = loggingConfig.path;
    } catch (e) {
        logging.error('Unable to open log file:', e);
    }
}

logging.info('Guardhouse Agent is starting...');

let accessTokenMasked = 'Not set';

if (accessToken) {
    accessTokenMasked = '';
    
    for (let i = 0; i < accessToken.length; i++) {
        if (i >= (accessToken.length - 6)) {
            accessTokenMasked += accessToken[i];
        } else {
            accessTokenMasked += '*';    
        }
    }
}

logging.info(' - Node environment: ' + (process.env.NODE_ENV ? process.env.NODE_ENV : 'default (Not provided)'));
logging.info(' - Target server:', serverUrl);
logging.info(' - Access token:', accessTokenMasked);
logging.info(' - Log target:', logValue);

let abortStart = false;

if (!serverUrl || !accessToken || accessToken.length < 8) {
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

// Start network (push [server to receive events] & pull [scheduled fetch from server])
net.startListener();