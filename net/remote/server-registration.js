const logging = require('winston-color');
const config = require('config');
const axios = require('axios');
const sysinfo = require('systeminformation');
const apiUrl = require('./api-url');
const server = require('../server');
const poller = require('../poller');

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
        logging.debug('Remote: Sending registration payload:', JSON.stringify(this.payload));

        axios.post(apiUrl.make('/sync/register'), this.payload)
            .then(function (response) {
                logging.info('Remote: Registration success.', response.data);

                ServerRegistration.didSucceed = true;

                if (response.data.server_token) {
                    let newServerToken = response.data.server_token;
                    let prevServerToken = config.get('guardhouse.token_server');

                    if (newServerToken
                        && newServerToken.length >= 16
                        && newServerToken !== prevServerToken) {
                        // We have an updated token, let's log it & try to write it to the config file
                        logging.info('Remote: Received new server token during registration:', newServerToken);
                        server.setServerToken(newServerToken);
                    }
                }

                xPoller.poll(); // TODO wtf is going on?
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