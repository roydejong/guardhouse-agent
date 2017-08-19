const logging = require('winston-color');
const config = require('config');
const express = require('express');
const endpoints = require('./endpoints');

class Server {
    /**
     * Starts the server, using the global configuration settings.
     */
    static start() {
        this.isEnabled = config.get('server.enabled');
        this.portNumber = parseInt(config.get('server.port'));
        this.serverToken = config.get('guardhouse.token_server');

        if (!this.isEnabled) {
            // Explicitly disabled, as default config sets enabled to true
            logging.warn('Server: The server is explicitly disabled in configuration ("server.enabled").');
            logging.warn(' - Disabling server and push functionality.');
            return;
        }
        
        if (!this.serverToken) {
            // Missing token, implicitly disabled (forgot to set up or not interested in push)
            logging.warn('Server: There is currently no "server_token" set in the configuration, will try to acquire during registration');
        }

        this.express = express();

        this.initMiddleware();
        this.initEndpoints();
        this.initListener();
    }

    static setServerToken(serverToken) {
        let hadNoToken = (!this.serverToken);

        this.serverToken = serverToken;

        if (hadNoToken && this.serverToken) {
            logging.info('Server: A server_token was aquired, now ready to accept authenticated requests (push enabled)');
        }
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
     * Initializes middleware (auth etc).
     */
    static initMiddleware() {
        this.express.use(function (req, res, next) {
            if (!this.serverToken) {
                // We have no server token to authorize incoming requests against, so deny everything with a 403 error
                // This is usually a temporary state, as registration should result in a token being set
                res.status(403);
                res.send('Forbidden: Requests are not permitted to this resource at this time.');

                logging.warn('Server: Denying all requests due to missing "server_token" in config');
                return;
            }

            let validAuth = false;
            let authToken = req.headers['authorization'];

            if (authToken && authToken.length && authToken === this.serverToken) {
                validAuth = true;
            } else {
                logging.warn(`Server: Auth failure (token) from ${req.connection.remoteAddress}: ${req.originalUrl}`);
            }
            
            if (validAuth) {
                logging.debug(`Server: Accepted request from ${req.connection.remoteAddress}: ${req.originalUrl}`);
                next();
            } else {
                res.status(401);
                res.send('Not authenticated: Invalid or missing access token');
            }
        }.bind(this));
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