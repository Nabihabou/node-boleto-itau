var fs = require('fs')
var path = require('path')

var ediParser = require('../index').EdiParser

console.log(ediParser.parse('santander', fs.readFileSync(path.join(__dirname, '/retorno.txt')).toString()))
