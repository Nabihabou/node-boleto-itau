var express = require('express')
var path = require('path')

var app = express()

var Boleto = require('../index').Boleto

var boleto = new Boleto({
  'banco': 'itau',
  'data_emissao': new Date(2020, 00 , 30),
  'data_vencimento': new Date(2020, 02, 30),
  'valor': 42101,
  'nosso_numero': '90252511',
  'numero_documento': '1001',
  'cedente': 'Pagar.me Pagamentos S/A',
  'cedente_cnpj': '1872705300333',
  'agencia': '0936',
  'codigo_cedente': '17949',
  'digito': '8',
  'carteira': '109',
  'pagador': 'Nome do pagador\nCPF: 000.000.000-00',
  'local_de_pagamento': 'PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO.',
  'instrucoes': 'Sr. Caixa, aceitar o pagamento e não cobrar juros após o vencimento.'
})

console.log(boleto['linha_digitavel']);

app.use(express.static(path.join(__dirname, '/../')))

app.get('/', function (req, res) {
  boleto.renderHTML(function (html) {
    return res.send(html)
  })
})

app.listen(3003)
