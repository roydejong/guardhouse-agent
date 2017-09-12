const Logging = require('winston-color');
const Recipe = require('../scripting/recipe');
const ApiUrl = require('./remote/api-url');
const Axios = require('axios');

class TaskProcessor {
    static handleTask(taskData) {
        let taskId = taskData.task_id;

        if (!taskId) {
            Logging.error('TaskProcessor:', '[dispatch]', `Missing task ID, ignoring task run request. (Bad data from server?)`);
            return false;
        }

        TaskProcessor.reportTaskStatus(taskId, TaskProcessor.STATUS_RUNNING);

        let runResult = false;

        if (taskData.type === 'recipe') {
            runResult = this._handleRecipeTask(taskData.data);
        } else {
            Logging.warn('TaskProcessor:', '[dispatch]', `Unknown type of task received: ${taskData.type}`);
        }

        if (!runResult) {
            TaskProcessor.reportTaskStatus(taskId, TaskProcessor.STATUS_RUN_FAILED);
            return false;
        }


        TaskProcessor.reportTaskStatus(taskId, TaskProcessor.STATUS_RUN_OK);
        return true;
    }

    static _handleRecipeTask(recipeData) {
        let scriptText          = recipeData.script;
        let scriptChecksum      = recipeData.checksum;
        let scriptInterpreter   = recipeData.interpreter;     // optional field
        let scriptDoExecute     = !!recipeData.execute;       // optional field

        if (!scriptText || !scriptChecksum) {
            Logging.warn('TaskProcessor:', '[recipe-task]', 'Received invalid recipe data from remote: missing data.');
            return false;
        }

        // Load data into recipe object
        let recipe = new Recipe(scriptText);

        if (scriptInterpreter) {
            recipe.interpreter = scriptInterpreter;
        }

        // Verify checksum
        let actualChecksum = recipe.checksumSHA1;

        if (actualChecksum !== scriptChecksum) {
            Logging.warn('TaskProcessor:', '[recipe-task]', `Received recipe failed checksum: Expected ${scriptChecksum}, actual is ${actualChecksum}.`);
            return false;
        }

        // Execute if requested
        if (!scriptDoExecute) {
            return true;
        }

        return recipe.run();
    }

    static reportTaskStatus(taskId, newStatus) {
        let payload = {
            task_id: taskId,
            status: newStatus
        };

        return Axios.post(ApiUrl.make('/sync/receipt'), payload)
            .catch((err) => {
                logging.error('TaskProcessor:', '[report-status]', `Net error: ${err}`);
            });
    }
}

TaskProcessor.STATUS_RUNNING = 3;
TaskProcessor.STATUS_RUN_FAILED = 4;
TaskProcessor.STATUS_RUN_OK = 5;

module.exports = TaskProcessor;