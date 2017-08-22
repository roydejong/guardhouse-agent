const crypto = require('crypto');

const Interpreters = require('./interpreters');
const Runner = require('./runner');

/**
 * Represents a single instance of a Recipe, containing raw instructions that can be parsed and executed.
 */
class Recipe {
    /**
     * Constructs a new recipe, with the raw script text.
     *
     * @param {string} recipeText
     */
    constructor (recipeText) {
        this.text = recipeText;
        this.interpreter = Interpreters.DEFAULT;
    }

    /**
     * Identifies this recipe in some unique fashion.
     *
     * @return {string}
     */
    get identifier () {
        // TODO Probably get this from remote or something, huh?
        return this.checksumSHA1;
    }

    /**
     * Calculates and returns a hex representation of the SHA1 hash for the raw recipe script.
     *
     * @return {string}
     */
    get checksumSHA1 () {
        return crypto.createHash('sha1')
            .update(this.text)
            .digest('hex')
            .toString();
    }

    /**
     * Verifies a script checksum.
     *
     * @param {string} againstSHA1
     * @returns {boolean}
     */
    verifyChecksum (againstSHA1) {
        return againstSHA1.length && this.checksumSHA1 === againstSHA1;
    }

    /**
     * Executes the recipe.
     *
     * @param {Runner|null} runner
     */
    run(runner) {
        if (!runner) {
            // Initialize a new runner instance as none was provided
            runner = new Runner();
        }

        // Execute on the runner
        runner.run(this);
    }
}

module.exports = Recipe;