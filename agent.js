/**
 * Bootstrap file for the Guardhouse Agent
 */
const winston = require('winston');
const logging = require('winston-color');
const config = require('config');

// Initiate startup, read config and set up logging
var serverUrl = config.get('guardhouse.server');
var accessToken = config.get('guardhouse.token');
var loggingConfig = config.get('logging');

var logValue = 'Not set up';

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

var accessTokenMasked = 'Not set';

if (accessToken) {
    accessTokenMasked = '';
    
    for (var i = 0; i < accessToken.length; i++) {
        if (i >= (accessToken.length - 6)) {
            accessTokenMasked += accessToken[i];
        } else {
            accessTokenMasked += '*';    
        }
    }
}

logging.info('- Target server:', serverUrl);
logging.info('- Access token:', accessTokenMasked);
logging.info('- Log target:', logValue);

if (!serverUrl || !accessToken || accessToken.length < 32) {
    logging.error('Unable to start agent: Core configuration is missing.');
    logging.error('Please ensure that a valid target server and access token are set.');
    return;
}

if (!serverUrl.indexOf('https://') !== 0) {
    logging.error('Unable to start agent: Invalid target server: must start with "https://".');
    return;
}