const logging = require('winston-color');
const config = require('config');
const express = require('express');
const endpoints = require('./endpoints');

class Server {
    static start() {
        this.isEnabled = config.get('server.enabled');
        this.portNumber = parseInt(config.get('server.port'));

        if (!this.isEnabled) {
            logging.warn('Server: The server is disabled in configuration, push functionality is disabled');
            return;
        }

        this.express = express();
        
        this.initEndpoints();
        this.initListener();
    }

    /**
     * Binds all endpoint handlers for various operations (see "endpoints" subdir) to the Express instance.
     */
    static initEndpoints() {
         for (let key in endpoints) {
             if (endpoints.hasOwnProperty(key)) {
                 let handler = endpoints[key];
                 
                 if (typeof handler.register === "function") {
                     handler.register(this.express);
                     logging.debug('Server: Registered endpoint:', key);
                 } else {
                     logging.debug('Server.initEndpoints: One of the exports in the ./endpoints index does not have the required "register()" function. Broken endpoint:', key);
                 }
             }
         }
    }

    /**
     * Starts the server listener, binding it to a port and getting ready to receive requests.
     */
    static initListener() {
        this.express.listen(this.portNumber, function () {
            logging.info('Server: Now listening on port', this.portNumber)
        }.bind(this));
    }
}

module.exports = Server;