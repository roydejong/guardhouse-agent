const shell = require('shelljs');
const logging = require('winston-color');

const Op = require('../Op');

/**
 * Op for resetting the executor state as if a new script is about to be interpreted.
 */
class ExecutorResetOp extends Op {
    static get id() {
        return "resetState";
    }

    static execute(call) {
        call.executor.reset();
        logging.debug('[ExecutorResetOp]', 'Executor state has been reset');
        return true;
    }
}

module.exports = ExecutorResetOp;
