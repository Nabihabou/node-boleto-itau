var fs = require('fs');

var ediParser = require('../index').EdiParser;

console.log(ediParser.parse('bradesco', fs.readFileSync(__dirname + "/retorno_bradesco.txt").toString()));
