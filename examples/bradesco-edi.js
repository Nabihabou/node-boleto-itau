var fs = require('fs')
var path = require('path')

var ediParser = require('../index').EdiParser

console.log(ediParser.parse('bradesco', fs.readFileSync(path.join(__dirname, 'retorno_bradesco.txt')).toString()))
