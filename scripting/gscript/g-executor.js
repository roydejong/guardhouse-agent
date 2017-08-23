const logging = require('winston-color');

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
        let opName = args.shift();
        let opInstance = GExecutor.resolveCommand(opName);

        if (!opInstance) {
            logging.info(`GScript: Command not found: "${opName}"`);
            return false;
        }

        return opInstance.execute(args);
    }
}

GExecutor.init();

module.exports = GExecutor;