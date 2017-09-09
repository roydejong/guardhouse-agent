const Interpreter = require('../interpreter');
const shell = require('shelljs');
const logging = require('winston-color');

class BashInterpreter extends Interpreter {
    static get id() {
        return 'bash';
    }

    static get isSupported() {
        return true;
    }

    static run (scriptText) {
        let process = shell.exec(scriptText, {
            silent: true,
            async: true
        });

        process.stdout.on('data', (data) => {
            logging.info('stdout ->', data);
        });

        process.stderr.on('data', (data) => {
            logging.error('stderr ->', data);
        });
    }
}

module.exports = BashInterpreter;