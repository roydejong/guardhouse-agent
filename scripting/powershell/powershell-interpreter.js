const Interpreter = require('../interpreter');
const spawn = require("child_process").spawn;
const tmp = require('tmp');
const logging = require('winston-color');
const shell = require('shelljs');
const config = require('config');

class PowershellInterpreter extends Interpreter {
    static get id() {
        return 'powershell';
    }

    static get isSupported() {
        // Powershell is a Windows-only feature, but we'll support any platform that has a "powershell.exe" binary :-)
        return !!shell.which('powershell.exe');
    }

    static run(scriptText) {
        // Powershell works best when we run the script as a complete ".ps1" script file, so...
        // Create a temporary PS1 script file for us
        let tmpFileOptions = {
            prefix: 'gh-',
            postfix: config.get('powershell.file_extension')
        };

        tmp.file(tmpFileOptions, (err, path, fd, cleanupCallback) => {
            if (err) {
                throw err;
            }

            logging.debug('[Powershell]', 'Created a script file:', path);

            // Create a child process for powershell.exe runtime
            let psProcess = spawn("powershell.exe", [`-ExecutionPolicy`, config.get('powershell.execution_policy'), `-File`, `${path}`]);

            psProcess.stdout.on("data", function (data) {
                let output = data.toString('utf8').trim();

                if (output) {
                    logging.info('[Powershell]', 'stdout:', output);
                }
            });

            psProcess.stderr.on("data", function (data) {
                let output = data.toString('utf8').trim();

                if (output) {
                    logging.error('[Powershell]', 'stderr:', output);
                }
            });

            psProcess.on("exit", function () {
                logging.debug('[Powershell]', 'Script has exited.');

                // Destroy the script file
                cleanupCallback();
            });

            psProcess.stdin.end();
        });
    }
}

module.exports = PowershellInterpreter;