const Recipe = require('../../scripting/recipe');

const logging = require('winston-color');

module.exports = {
    register: function (express) {
        express.post('/recipe', function (req, res) {
            // Receive script text and checksum
            let scriptText          = req.body.script;
            let scriptChecksum      = req.body.checksum;
            let scriptInterpreter   = req.body.interpreter;     // optional field
            let scriptDoExecute     = !!req.body.execute;       // optional field

            if (!scriptText || !scriptChecksum) {
                res.status(400).send('error:data');
                return;
            }

            // Load data into recipe object
            let recipe = new Recipe(scriptText);

            if (scriptInterpreter) {
                recipe.interpreter = scriptInterpreter;
            }

            // Verify checksum
            let actualChecksum = recipe.checksumSHA1;

            if (actualChecksum !== scriptChecksum) {
                logging.warn('Server:', '[post-recipe]', `Recipe pushed by remote server failed checksum: Expected ${scriptChecksum}, actual is ${actualChecksum}.`);

                res.status(400).send('error:checksum');
                return;
            }

            // Execute if requested
            let execResult = true;

            if (scriptDoExecute) {
                logging.info('Server:', '[post-recipe]', 'Executing recipe pushed by serer.');
                execResult = recipe.run();
            }

            // TODO Store script in local db, issue GUID

            if (execResult) {
                res.status(200).send('ok');
            } else {
                res.status(500).send('error:exec');
            }
        });
    }
};