const logging = require('winston-color');

const gscript = require('./gscript');

class Interpreters {
    static get list() {
        let result = { };

        for (let prop in Interpreters) {
            if (Interpreters.hasOwnProperty(prop) && prop.startsWith("INTERPRETER_")) {
                let interpreterObj = Interpreters[prop];
                let interpreterId = interpreterObj.id;

                result[interpreterId] = interpreterObj;
            }
        }

        return result;
    }

    static get ids() {
        let ids = [];
        let list = Interpreters.list;

        for (let id in list) {
            ids.push(id);
        }

        return ids;
    }

    static isValid (interpreterId) {
        return Interpreters.ids.indexOf(interpreterId) >= 0;
    }

    /**
     * Fetches an instance of an interpreter by its id.
     *
     * @param interpreterId
     * @returns {Interpreter}
     */
    static getInstance (interpreterId) {
        console.log(this.ids);
        if (!Interpreters.isValid(interpreterId)) {
            logging.error('Cannot create interpreter instance, not implemented in this agent build:', interpreterId);
            return null;
        }

        let instance = Interpreters.list[interpreterId];

        if (!instance.isSupported) {
            logging.error(`Interpreter ${interpreterId} is not supported on this platform, unable to initialize.`);
            return null;
        }

        return instance;
    }
}

Interpreters.INTERPRETER_GUARDSCRIPT = gscript.GInterpreter;
Interpreters.DEFAULT = Interpreters.ids[0];

module.exports = Interpreters;