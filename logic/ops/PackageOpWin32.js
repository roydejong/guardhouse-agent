const shell = require('shelljs');
const logging = require('winston-color');

const Op = require('../Op');
const PackageOpGeneric = require('./PackageOpGeneric');

/**
 * Op for managing OS packages on Windows-based platforms using the Chocolatey package manager.
 */
class PackageOpWin32 extends PackageOpGeneric {
    static get id() {
        return "package";
    }

    static get supportedPlatforms() {
        return Op.PLATFORM_WINDOWS;
    }

    static _installChoco() {
        logging.warn('[PackageOpWin32]', 'Package manager for your playform is not yet installed.');
        logging.info('[PackageOpWin32]', 'Win32: Attempting to install Chocolatey package manager...');

        shell.exec(`@"%SystemRoot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))"`);
        shell.exec(`SET "PATH=%PATH%;%ALLUSERSPROFILE%\\chocolatey\\bin"`);
    }

    static get _chocoBinPath() {
        return "%ALLUSERSPROFILE%\\chocolatey\\bin\\choco";
    }

    static _warmUp() {
        this.warm = false;
        this.packageManager = PackageOpWin32.PM_CHOCO;

        if (!shell.which('choco')) {
            this._installChoco();
        }

        if (!shell.which('choco')) {
            logging.error('[PackageOpWin32]', 'Error: Chocolatey package manager not available, auto install did not succeed.');
            return false;
        }

        this.warm = true;
        return true;
    }

    static _executeInstall(pkgName) {
        logging.info('[PackageOpWin32]', `${this.packageManager} -> Install package "${pkgName}"...`);

        let result = shell.exec(`${PackageOpWin32._chocoBinPath} install ${pkgName} -y`);

        if (result.code === 0) {
            return true;
        }

        logging.warn('[PackageOpWin32]', 'Package installation failed.');
        logging.warn(result.stdout);

        return false;
    }

    static _executeRemove(pkgName) {
        logging.info('[PackageOpWin32]', `${this.packageManager} -> Remove package "${pkgName}"...`);

        let result = shell.exec(`${PackageOpWin32._chocoBinPath} uninstall ${pkgName} -y`);

        if (result.code === 0) {
            return true;
        }

        logging.warn('[PackageOpWin32]', 'Package removal failed.');
        logging.warn(result.stdout);

        return false;
    }

    static _executeUpdate(pkgName) {
        logging.info('[PackageOpWin32]', `${this.packageManager} -> Update package "${pkgName}"...`);

        let result = shell.exec(`${PackageOpWin32._chocoBinPath} upgrade ${pkgName} -y`);

        if (result.code === 0) {
            return true;
        }

        logging.warn('[PackageOpWin32]', 'Package update failed.');
        logging.warn(result.stdout);

        return false;
    }
}

PackageOpWin32.PM_CHOCO = 'chocolatey';

module.exports = PackageOpWin32;
