const logging = require('winston-color');
const GCall = require('./g-call');

class GExecutor {
    static init() {
        this.ops = require('../../logic/index').ops;
    }

    static resolveCommand(commandStr) {
        if (typeof this.ops[commandStr] !== "undefined") {
            return this.ops[commandStr];
        }

        return null;
    }

    static executeCommand(args) {
        args = args.slice(); // do not modify input

        let opName = args.shift();
        let opInstance = GExecutor.resolveCommand(opName);

        if (!opInstance) {
            logging.warn(`GScript: Command not found: "${opName}"`);
            return false;
        }

        let callData = new GCall(opName, args, this);
        return opInstance.execute(callData);
    }
}

GExecutor.init();

module.exports = GExecutor;