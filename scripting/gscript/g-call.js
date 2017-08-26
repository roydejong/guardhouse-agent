/**
 * Struct containing information about an Op call from a GScript.
 */
class GCall {
    /**
     * GCall constructor.
     *
     * @param {string}      op          The name of the operation being called.
     * @param {array}       args        Optional arguments for the operation call.
     * @param {GExecutor}   executor    Reference to the GExecutor environment.
     */
    constructor(op, args, executor) {
        /**
         * The name of the op being executed.
         *
         * @type {string}
         */
        this.op = op;
        /**
         * A list of arguments for the function call.
         * May be empty, and is not validated before being passed to the Op.
         *
         * @type {array}
         */
        this.args = args;
        /**
         * The Executor instance that is executing this call.
         *
         * @type {GExecutor}
         */
        this.executor = executor;
    }
}

module.exports = GCall;