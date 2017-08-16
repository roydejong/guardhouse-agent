const logging = require('winston-color');
const config = require('config');
const apiUrl = require('./api-url');
const axios = require('axios');

class ServerRegistration {
    static perform() {
        logging.info('Remote: Performing registration with Guardhouse server');

        let payload = {
            "push_server_enabled": (!!config.get('server.enabled'))
        };

        axios.get(apiUrl.make('/api/sync/register'), payload)
            .then(function (response) {
                logging.info('Remote: Registration success.');
            })
            .catch(function (error) {
                logging.error('Remote: Failed to register with Guardhouse server:', error.message);
                logging.error(' - Will attempt registration again on scheduled network pulls.');
                logging.error(' - IMPORTANT: Communication looks broken right now. Verify configuration and server status.');
            });
    }
}

ServerRegistration.didSucceed = false;

module.exports = ServerRegistration;