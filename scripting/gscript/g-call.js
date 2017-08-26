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
        this.op = op;
        this.args = args;
        this.executor = executor;
    }
}

module.exports = GCall;