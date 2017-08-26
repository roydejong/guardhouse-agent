const logging = require('winston-color');

const GCall = require('./g-call');
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

        for (let i = 0; i < opMatches.length; i++) {
            let _op = opMatches[i];
            let platformList = _op.supportedPlatforms;

            if (!Array.isArray(platformList)) {
                platformList = [platformList.toString()];
            }

            let isCompatible = false;

            for (let j = 0; j < platformList.length; i++) {
                if (platformList[j] === osPlatform || platformList[j] === Op.PLATFORM_ANY) {
                    isCompatible = true;
                    break;
                }
            }

            if (isCompatible) {
                compatibleOps.push(_op);
            }
        }

        // Return first match, if any
        if (!compatibleOps.length) {
            logging.warn(`GScript: Command is not implemented on this platform: "${opName}" - ${osPlatform} ${osRelease}`);
            return false;
        }

        return compatibleOps.shift();
    }

    /**
     * Executes a GScript instruction.
     *
     * @param {array} callComponents        Array of call components: [0] contains the Op name, other values are args.
     * @return {*}                          Function return value. Returns FALSE if execution is not possible.
     */
    static executeCommand(callComponents) {
        callComponents = callComponents.slice(); // copy; do not modify input

        let opName = callComponents.shift();
        let opInstance = GExecutor.resolveCommand(opName);

        if (opInstance) {
            let callData = new GCall(opName, callComponents, this);
            return opInstance.execute(callData);
        }

        return false;
    }
}

GExecutor.init();

module.exports = GExecutor;