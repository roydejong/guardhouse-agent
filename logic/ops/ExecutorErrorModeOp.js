const shell = require('shelljs');
const logging = require('winston-color');

const Op = require('../Op');

class ExecutorErrorModeOp extends Op {
    static get id() {
        return "errorMode";
    }

    static execute(call) {
        let args = call.args.slice();

        if (args.length !== 1) {
            logging.warn('[ExecutorErrorModeOp]', 'Cannot set error mode, missing argument.');
            return false;
        }

        let newErrorMode = args.shift();

        if (call.executor.setErrorMode(newErrorMode)) {
            logging.debug('[ExecutorErrorModeOp]', `Set executor error mode: ${newErrorMode}`);
            return true;
        }

        return false;
    }
}

module.exports = ExecutorErrorModeOp;
