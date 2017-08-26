/**
 * Base class for an operation.
 *
 * An operation is a piece of logic that can be executed, usually from a GScript instruction call.
 */
class Op {
    /**
     * Returns a globally unique identifier for this Op.
     * This is the name of the instruction in GScript.
     *
     * @public
     * @abstract
     * @return {string}
     */
    static get id() {
        throw new Error('Not implemented: Op.id() getter');
    }

    /**
     * Returns which platform or platforms are supported by this Op.
     *
     * @return {string|array}
     */
    static get supportedPlatforms() {
        return Op.PLATFORM_ANY;
    }

    /**
     * Executes the op call.
     *
     * @public
     * @abstract
     * @param       {GCall}         call            Struct containing call information and parameters.
     * @return      {boolean}                       Call result; TRUE if successful, FALSE if failed. If FALSE, script execution may halt depending on error mode.
     */
    static execute(call) {
        throw new Error('Not implemented: Op.execute()');
    }
}

Op.PLATFORM_ANY = 'any';
Op.PLATFORM_LINUX = 'linux';
Op.PLATFORM_MAC = 'darwin';
Op.PLATFORM_WINDOWS = 'win32';

module.exports = Op;