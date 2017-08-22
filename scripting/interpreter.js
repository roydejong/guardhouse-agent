class Interpreter {
    /**
     * @abstract
     * @returns {string}
     */
    static get id() {
        // ...
        return 'unknown';
    }

    /**
     * @abstract
     * @returns {boolean}
     */
    static get isSupported() {
        // ...
        return false;
    }

    /**
     * @abstract
     */
    static run (scriptText) {
        // ...
    }
}

module.exports = Interpreter;