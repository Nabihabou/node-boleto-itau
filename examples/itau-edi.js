var fs = require('fs')
var path = require('path')

var ediParser = require('../index').EdiParser

console.log(ediParser.parse('itau', fs.readFileSync(path.join(__dirname, 'retorno_itau.txt')).toString()))
