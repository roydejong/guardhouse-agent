const logging = require('winston-color');

const GCall = require('./g-call');
const GResult = require('./g-result');
const Op = require('../../logic/Op');

/**
 * Execution environment for GScript in which Ops run.
 */
class GExecutor {
    /**
     * Initializes the environment by setting default values and indexing available ops.
     */
    static init() {
        this.ops = require('../../logic/index').ops;

        GExecutor.setErrorMode(GExecutor.ERROR_MODE_NORMAL);
    }

    /**
     * Changes the executor error mode.
     *
     * @see "GExecutor.ERROR_MODE_*"
     * @param {string} errorMode
     * @return {boolean}
     */
    static setErrorMode(errorMode) {
        this.errorMode = errorMode;
        return true;
    }

    /**
     * Resolves a given op name to the instance of an op.
     * Automatically detects compatibility and logs any issues.
     *
     * @param {string} commandStr
     * @return {null|Op} Returns Op instance, or NULL if no match was found.
     */
    static resolveCommand(commandStr) {
        if (typeof this.ops[commandStr] === "undefined") {
            return null;
        }

        let opMatches = this.ops[commandStr];

        if (!opMatches || !opMatches.length) {
            logging.warn(`GScript: Command not found: "${opName}"`);
            return false;
        }

        // Find all ops with a matching platform
        let compatibleOps = [];
        let preferredOp = null;

        for (let i = 0; i < opMatches.length; i++) {
            let _op = opMatches[i];
            let platformList = _op.supportedPlatforms;

            if (!Array.isArray(platformList)) {
                platformList = [platformList.toString()];
            }

            let isCompatible = false;
            let isPreferred = false;

            for (let j = 0; j < platformList.length; j++) {
                if (platformList[j] === Op.PLATFORM_ANY) {
                    isCompatible = true;
                }

                if (platformList[j] === osPlatform) {
                    isCompatible = true;
                    isPreferred = true;
                }
            }

            if (isCompatible) {
                compatibleOps.push(_op);

                if (isPreferred) {
                    preferredOp = _op;
                }
            }
        }

        // Return first match, if any
        if (!compatibleOps.length) {
            logging.warn(`GScript: Command is not implemented on this platform: "${opName}" - ${osPlatform} ${osRelease}`);
            return null;
        }

        if (!preferredOp) {
            preferredOp = compatibleOps.shift();
        }

        return preferredOp;
    }

    /**
     * Executes a GScript instruction.
     *
     * @param {array} callComponents        Array of call components: [0] contains the Op name, other values are args.
     * @return {GResult}                    Result information in GResult struct.
     */
    static executeCommand(callComponents) {
        callComponents = callComponents.slice(); // copy; do not modify input

        let opName = callComponents.shift();
        let opInstance = GExecutor.resolveCommand(opName);

        let result = new GResult();

        if (opInstance) {
            let callData = new GCall(opName, callComponents, this);
            let returnValue = opInstance.execute(callData);

            result.opRan = opName;
            result.opResult = returnValue;

            if (this.errorMode === GExecutor.ERROR_MODE_NORMAL) {
                // Normal error mode: Abort execution if return value evaluates to false.
                result.abortExecution = !returnValue;
            }
        }

        return result;
    }
}

/**
 * In "normal" error handling mode, all errors are logged and script execution is aborted on failure.
 */
GExecutor.ERROR_MODE_NORMAL = 'normal';
/**
 * In "continue" error handling mode, all errors are logged but execution is never aborted.
 */
GExecutor.ERROR_MODE_CONTINUE = 'continue';

// Self init & export
GExecutor.init();
module.exports = GExecutor;