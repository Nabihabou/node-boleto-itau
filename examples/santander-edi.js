var fs = require('fs');

var ediParser = require('../index').ediParser;

console.log(ediParser.parse(fs.readFileSync(__dirname + "/retorno.txt").toString()));
