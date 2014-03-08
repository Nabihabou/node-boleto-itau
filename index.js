var fs = require('fs');

// Load banks
var banks = {};
var banksFolders = fs.readdirSync(__dirname + '/banks/');
for(var i = 0; i < banksFolders.length; i++) {
  banks[banksFolders[i]] = require(__dirname + '/banks/' + banksFolders[i] + '/index.js');
}

exports.Boleto = require('./lib/boleto')(banks);
exports.ediParser = require('./lib/edi-parser')(banks);
