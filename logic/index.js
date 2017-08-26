const path = require('path');
const fs = require('fs');

let normalizedPath = require('path').join(__dirname, 'ops');
let opsList = { };

fs.readdirSync(normalizedPath).forEach(function (file) {
    let nextOp = require('./ops/' + file);
    let nextOpId = nextOp.id;

    if (!opsList[nextOpId]) {
        opsList[nextOpId] = [];
    }

    opsList[nextOpId].push(nextOp);
});

module.exports = {
    ops: opsList
};