const logging = require('winston-color');
const config = require('config');
const axios = require('axios');
const apiUrl = require('./remote/api-url');
const selfReg = require('./remote/server-registration');
const TaskProcessor = require('./task-processor');

class Poller {
    static start() {
        this.clientToken = config.get('guardhouse.token_client');
        this.intervalSeconds = parseInt(config.get('guardhouse.poll_interval_seconds'));

        if (!this.intervalSeconds || isNaN(this.intervalSeconds)) {
            this.intervalSeconds = this.DEFAULT_INTERVAL;
            logging.warn(`Poller: Invalid "guardhouse.poll_interval_seconds" value, using default value of ${this.intervalSeconds} seconds`);
        }

        if (this.intervalSeconds < this.MIN_INTERVAL) {
            logging.warn(`Poller: Refusing to use "guardhouse.poll_interval_seconds" value of ${this.intervalSeconds} seconds -- value is too low, using the minimum of ${this.MIN_INTERVAL} seconds instead`);
            this.intervalSeconds = this.MIN_INTERVAL;
        }

        if (this.interval) {
            this.stop();
        }

        this.interval = setInterval(Poller.poll.bind(this), this.intervalSeconds * 1000);
        logging.info(`Poller: Started polling scheduler, running every ${this.intervalSeconds} seconds (pull enabled)`);
    }

    static stop() {
        if (this.interval) {
            clearInterval(this.interval);
            logging.info('Poller: Stopped polling scheduler');
        }
    }

    static poll() {
        axios.get(apiUrl.make('/sync/pull'))
            .then((response) => {
                logging.debug('Pull result:', response.data);

                if (!selfReg.didSucceed) {
                    logging.warn('Poller: Registration has not yet been completed, re-trying now instead of regular sync');
                    selfReg.perform();
                    return;
                }

                TaskProcessor.handleTask(response.data);
            })
            .catch((error) => {
                logging.error('Poller: Pull from server failed:', error.message);
            });
    }
}

Poller.MIN_INTERVAL = 60;
Poller.DEFAULT_INTERVAL = Poller.MIN_INTERVAL;

module.exports = Poller;
global.xPoller = Poller; // TODO wtf is going on?