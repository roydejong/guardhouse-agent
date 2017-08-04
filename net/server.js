const logging = require('winston-color');

let Server = {
    start: function () {
        logging.info('blah');
    }
};

module.exports = Server;