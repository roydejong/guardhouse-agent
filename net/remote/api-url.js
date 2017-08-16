const config = require('config');

class ApiUrl {
    /*
     * @param {string} path
     */
    static make(path) {
        if (!path) {
            path = "/";
        }

        return ApiUrl.BASE_URL + path;
    }
}

ApiUrl.BASE_URL = config.get('guardhouse.server');

module.exports = ApiUrl;