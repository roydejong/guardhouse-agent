const shell = require('shelljs');
const logging = require('winston-color');

const Op = require('../Op');

class PackageOp extends Op {
    static get id() {
        return "package";
    }

    static execute(call) {
        return false;
        let args = call.args.slice();

        if (args.length !== 2) {
            logging.warn('[PackageOp]', 'Syntax error. Usage: package [operation] [name]');
            return false;
        }

        let command = args.shift();
        let packageName = args.shift();

        if (!this.warm) {
            if (!this._warmUp()) {
                // Cannot perform package management in this env, unsupported
                logging.error('[PackageOp]', `Unable to perform package management, leaving package untouched: "${packageName}"`);
                return false;
            }
        }

        if (command === PackageOp.COMMAND_INSTALL) {
            return this._executeInstall(packageName);
        } else if (command === PackageOp.COMMAND_REMOVE) {
            return this._executeRemove(packageName);
        } else if (command === PackageOp.COMMAND_UPDATE) {
            return this._executeUpdate(packageName)
        } else {
            logging.warn('[PackageOp]', `Unrecognized command: "${command}" for package "${packageName}". Use "${PackageOp.COMMAND_INSTALL}", "${PackageOp.COMMAND_REMOVE}", or "${PackageOp.COMMAND_UPDATE}".`);
            return false;
        }
    }

    static _warmUp() {
        if (this.warm) {
            return;
        }

        if (osPlatform === 'win32') {
            if (!shell.which('choco')) {
                logging.warn('[PackageOp]', 'Win32: Installing Chocolatey package manager...');

                shell.exec(`@"%SystemRoot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))"`);
                shell.exec(`SET "PATH=%PATH%;%ALLUSERSPROFILE%\\chocolatey\\bin"`);
            }

            if (shell.which('choco')) {
                this.packageManager = PackageOp.PM_CHOCO;
            } else {
                logging.error('[PackageOp]', 'Error: Chocolatey package manager not available / installation failed.');
            }
        } else {
            if (shell.which('apt-get')) {
                this.packageManager = PackageOp.PM_APT_GET;
            }
        }

        if (this.packageManager) {
            logging.info('[PackageOp]', 'Using package manager: ' + this.packageManager);
            this.warm = true;
            return true;
        } else {
            logging.error('[PackageOp]', `Unsupported environment for package management / no supported package manager available: ${osPlatform} / ${osRelease}`);
            return false;
        }
    }

    static _executeInstall(pkgName) {
        logging.info('[PackageOp]', `${this.packageManager} -> Install package "${pkgName}"...`);

        if (this.packageManager === PackageOp.PM_APT_GET) {
            return shell.exec(`apt-get install ${pkgName} -y`);
        }

        if (this.packageManager === PackageOp.PM_CHOCO) {
            return shell.exec(`choco install ${pkgName} -y`);
        }
    }

    static _executeRemove(pkgName) {
        logging.info('[PackageOp]', `${this.packageManager} -> Remove package "${pkgName}"...`);

        if (this.packageManager === PackageOp.PM_APT_GET) {
            return shell.exec(`apt-get remove ${pkgName} -y`);
        }

        if (this.packageManager === PackageOp.PM_CHOCO) {
            return shell.exec(`choco uninstall ${pkgName} -y`);
        }
    }

    static _executeUpdate(pkgName) {
        logging.info('[PackageOp]', `${this.packageManager} -> Update package "${pkgName}"...`);

        if (this.packageManager === PackageOp.PM_APT_GET) {
            return shell.exec(`apt-get upgrade ${pkgName} -y`);
        }

        if (this.packageManager === PackageOp.PM_CHOCO) {
            return shell.exec(`choco upgrade ${pkgName} -y`);
        }

        return false;
    }
}

PackageOp.COMMAND_INSTALL = "install";
PackageOp.COMMAND_REMOVE = "remove";
PackageOp.COMMAND_UPDATE = "update";

PackageOp.PM_APT_GET = 'apt-get';
PackageOp.PM_CHOCO = 'chocolatey';

module.exports = PackageOp;
