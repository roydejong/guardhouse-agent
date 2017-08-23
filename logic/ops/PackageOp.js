const Op = require('../Op');

class PackageOp extends Op {
    static get id() {
        return "package";
    }

    static execute(args) {
        return "hello I can do package stuff maybe";
    }
}

module.exports = PackageOp;
