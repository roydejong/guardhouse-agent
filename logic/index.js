const path = require('path');
const fs = require('fs');

let normalizedPath = require('path').join(__dirname, 'ops');
let opsList = { };

fs.readdirSync(normalizedPath).forEach(function (file) {
    let nextOp = require('./ops/' + file);
    let nextOpId = nextOp.id;

    opsList[nextOpId] = nextOp;
});

module.exports = {
    ops: opsList
};