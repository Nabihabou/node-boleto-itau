var express = require('express');

var app = express();

var Boleto = require('../index').Boleto;

var boleto = new Boleto({
  'banco': "bradesco",
  'data_emissao': new Date(),
  'data_vencimento': new Date(new Date().getTime() + 5 * 24 * 3600 * 1000),
  'valor': 1500,
  'nosso_numero': "1234567",
  'numero_documento': "1234567",
  'cedente': "Pagar.me Pagamentos S/A",
  'cedente_cnpj': "18727053000174",
  'agencia': "1229",
  'codigo_cedente': "4628596", // PSK (código da carteira)
  'carteira': "06"
})

console.log(boleto['linha_digitavel']);

app.use(express.static(__dirname + '/../'));

app.get('/', function(req, res){
  boleto.renderHTML(function(html){
	return res.send(html);
  });
});

app.listen(3003);
