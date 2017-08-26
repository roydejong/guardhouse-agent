const logging = require('winston-color');

const Interpreters = require('./interpreters');

class Runner {
    constructor() {
        this.currentRecipe = null;
    }

    /**
     * Runs a Recipe.
     *
     * @param {Recipe} recipe
     */
    run(recipe) {
        // TODO Return a promise for this stuff

        this.currentRecipe = recipe;

        // Intialize the interpreter
        let interpreterId = recipe.interpreter;
        let interpreterObj = Interpreters.getInstance(interpreterId);

        if (!interpreterObj) {
            logging.error(`Scripting - ERROR: Recipe ${recipe.identifier} cannot be run due to an interpreter set-up problem.`);
            return;
        }

        // Execute on the interpreter
        logging.info(`Scripting: Running recipe ${recipe.identifier} (${recipe.interpreter})...`);

        try {
            interpreterObj.run(recipe.text);
            logging.info(`Scripting: OK - Script execution completed.`);
        } catch (e) {
            logging.error(`Scripting: ERROR - Execution failed: ${e.message}`);
        }

        // Done
        this.currentRecipe = null;
    }
}

module.exports = Runner;