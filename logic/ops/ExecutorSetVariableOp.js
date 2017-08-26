const shell = require('shelljs');
const logging = require('winston-color');

const Op = require('../Op');

/**
 * Op for resetting the executor state.
 */
class ExecutorSetVariableOp extends Op {
    static get id() {
        return "set";
    }

    static execute(call) {
        let args = call.args.slice();

        if (args.length !== 2) {
            logging.warn('[ExecutorSetVariableOp]', `Syntax error. Usage: set [name] [value]`);
            return false;
        }

        let varName = args.shift();
        let varValue = args.shift();

        call.executor.setVariable(varName, varValue);

        logging.debug('[ExecutorSetVariableOp]', `Assign variable ${varName} -> "${varValue}"`);

        return true;
    }
}

module.exports = ExecutorSetVariableOp;
