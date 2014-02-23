var express = require('express');

var app = express();

var Boleto = require('../index');

var boleto = new Boleto({
  'banco': "santander",
  'data_emissao': new Date(),
  'data_vencimento': new Date(new Date().getTime() + 5 * 24 * 3600 * 1000),
  'valor': 15049,
  'nosso_numero': "1231231",
  'numero_documento': "123123",
  'beneficiario': "Pagar.me Pagamentos S/A",
  'beneficiario_cnpj': "18727053000174",
  'agencia': "3978",
  'codigo_beneficiario': "6404154", // PSK (código da carteira)
  'carteira': "102"
})

app.get('/', function(req, res){
  boleto.renderHTML(function(html){
	return res.send(html);
  });
});

app.listen(3003);
