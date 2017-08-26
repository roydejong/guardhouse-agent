module.exports = {
    "get-status": require('./get-status')
};




const path = require('path');
const fs = require('fs');

let normalizedPath = path.join(__dirname);
let exportList = { };

fs.readdirSync(normalizedPath).forEach(function (file) {
    if (file === 'index.js') {
        return;
    }

    let subModule = require('./' + file);
    let subModuleName = file.replace('.js', '');

    exportList[subModuleName] = subModule;
});

module.exports = exportList;




