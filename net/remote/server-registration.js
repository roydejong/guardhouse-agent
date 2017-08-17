const logging = require('winston-color');
const config = require('config');
const axios = require('axios');
const sysinfo = require('systeminformation');

const apiUrl = require('./api-url');

class ServerRegistration {
    static perform() {
        // Begin preparing the payload
        this.payload = {
            "push_server_enabled": (!!config.get('server.enabled')),
            "os_info": null
        };

        // Enrich the payload: Gather system information
        sysinfo.osInfo()
            .then(data => {
                this.payload.os_info = data;
                this._sendReg();
            })
            .catch(error => {
                logging.error('Registration: Unable to fetch system information:' + e.message);
                this._sendReg();
            });
    }

    static _sendReg() {
        logging.info('Remote: Performing registration with Guardhouse server');

        logging.debug('Remote: Sending registration payload', this.payload);

        axios.get(apiUrl.make('/api/sync/register'), this.payload)
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