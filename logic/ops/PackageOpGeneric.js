const shell = require('shelljs');
const logging = require('winston-color');

const Op = require('../Op');

/**
 * Op for managing OS packages using a native package manager.
 */
class PackageOpGeneric extends Op {
    static get id() {
        return "package";
    }

    static execute(call) {
        let args = call.args.slice();

        if (args.length !== 2) {
            logging.warn('[PackageOpGeneric]', 'Syntax error. Usage: package [operation] [name]');
            return false;
        }

        let command = args.shift();
        let packageName = args.shift();

        if (!this.warm) {
            if (!this._warmUp()) {
                // Cannot perform package management in this env, unsupported
                logging.error('[PackageOpGeneric]', `Unable to perform package management, leaving package untouched: "${packageName}"`);
                return false;
            }
        }

        if (command === PackageOpGeneric.COMMAND_INSTALL) {
            return this._executeInstall(packageName);
        } else if (command === PackageOpGeneric.COMMAND_REMOVE) {
            return this._executeRemove(packageName);
        } else if (command === PackageOpGeneric.COMMAND_UPDATE) {
            return this._executeUpdate(packageName)
        } else {
            logging.warn('[PackageOpGeneric]', `Unrecognized command: "${command}" for package "${packageName}". Use "${PackageOpGeneric.COMMAND_INSTALL}", "${PackageOpGeneric.COMMAND_REMOVE}", or "${PackageOpGeneric.COMMAND_UPDATE}".`);
            return false;
        }
    }

    static _warmUp() {
        if (this.warm) {
            return;
        }

        if (shell.which('apt-get')) {
            this.packageManager = PackageOpGeneric.PM_APT_GET;
        }

        if (this.packageManager) {
            logging.info('[PackageOpGeneric]', 'Using package manager: ' + this.packageManager);
            this.warm = true;
            return true;
        } else {
            logging.error('[PackageOpGeneric]', `Unsupported environment for package management / no supported package manager available: ${osPlatform} / ${osRelease}`);
            return false;
        }
    }

    static _executeInstall(pkgName) {
        logging.info('[PackageOpGeneric]', `${this.packageManager} -> Install package "${pkgName}"...`);

        if (this.packageManager === PackageOpGeneric.PM_APT_GET) {
            return shell.exec(`apt-get install ${pkgName} -y`).code === 0;
        }
    }

    static _executeRemove(pkgName) {
        logging.info('[PackageOpGeneric]', `${this.packageManager} -> Remove package "${pkgName}"...`);

        if (this.packageManager === PackageOpGeneric.PM_APT_GET) {
            return shell.exec(`apt-get remove ${pkgName} -y`).code === 0;
        }
    }

    static _executeUpdate(pkgName) {
        logging.info('[PackageOpGeneric]', `${this.packageManager} -> Update package "${pkgName}"...`);

        if (this.packageManager === PackageOpGeneric.PM_APT_GET) {
            return shell.exec(`apt-get upgrade ${pkgName} -y`).code === 0;
        }

        return false;
    }
}

PackageOpGeneric.COMMAND_INSTALL = "install";
PackageOpGeneric.COMMAND_REMOVE = "remove";
PackageOpGeneric.COMMAND_UPDATE = "update";

PackageOpGeneric.PM_APT_GET = 'apt-get';

module.exports = PackageOpGeneric;
