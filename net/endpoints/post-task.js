const Recipe = require('../../scripting/recipe');
const TaskProcessor = require('../task-processor');

const logging = require('winston-color');

module.exports = {
    register: function (express) {
        express.post('/task', function (req, res) {
            let taskData = req.body;
            let handleResult = TaskProcessor.handleTask(taskData);

            if (handleResult) {
                res.status(200).send('ok');
            } else {
                res.status(400).send('error');
            }
        });
    }
};