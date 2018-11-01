const moment = require('moment')
const testBanks = require('./banks')
const Boleto = require('../../lib/boleto')(testBanks)

const dataEmissao = moment(moment('2018-10-25 20:48:01.981+00').utc().format('YYYY-MM-DD')).valueOf()
const dataVencimento = moment(moment('2018-11-09 02:00:00+00').utc().format('YYYY-MM-DD')).valueOf()

const boletoOptions = {
  banco: 'test',
  cedente: 'SOGNI COMERCIO E SERVICO DIGITAL | Pagar.me Pagamentos S/A',
  cedente_cnpj: '18727053000174',
  agencia: '1229',
  codigo_cedente: '469',
  carteira: '26',
  data_emissao: new Date(dataEmissao),
  data_vencimento: new Date(dataVencimento),
  valor: 1000,
  nosso_numero: 20615808,
  numero_documento: 20615808,
  pagador: 'Abilio Cipriano',
  local_de_pagamento: 'PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO.',
  instrucoes: 'teste'
}

module.exports = new Boleto(boletoOptions)
