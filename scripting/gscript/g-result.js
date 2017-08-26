/**
 * Result struct after a function call.
 */
class GResult {
    constructor () {
        this.opRan = null;
        this.opResult = null;
        this.abortExecution = false;
    }
}

module.exports = GResult;