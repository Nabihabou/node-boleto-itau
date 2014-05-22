var express = require('express');

var app = express();

var Boleto = require('../index').Boleto;

var boleto = new Boleto({
  'banco': "bradesco",
  'data_emissao': new Date(),
  'data_vencimento': new Date(new Date().getTime() + 5 * 24 * 3600 * 1000),
  'valor': 1500,
  'nosso_numero': "6",
  'numero_documento': "1",
  'cedente': "Pagar.me Pagamentos S/A",
  'cedente_cnpj': "18727053000174",
  'agencia': "1229",
  'codigo_cedente': "469",
  'carteira': "25"
})

// console.log(boleto['linha_digitavel']);

app.use(express.static(__dirname + '/../'));

app.get('/', function(req, res){
  boleto.renderHTML(function(html){
	return res.send(html);
  });
});

app.listen(3003);
