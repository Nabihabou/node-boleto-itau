const Boleto = require('../../../index').Boleto
const moment = require('moment')
const expect = require('chai').expect

describe('Santander Boleto', () => {
  describe('when creating a valid boleto', () => {
    let boleto
    before(() => {
      boleto = new Boleto({
        'banco': 'santander',
        'data_emissao': moment('2017-01-01T00:00:00Z'),
        'data_vencimento': moment('2017-01-05'),
        'valor': 1500,
        'nosso_numero': '6',
        'numero_documento': '1',
        'cedente': 'Pagar.me Pagamentos S/A',
        'cedente_cnpj': '18727053000174',
        'agencia': '1229',
        'codigo_cedente': '469',
        'carteira': '25',
        'pagador': 'Nome do pagador\nCPF: 000.000.000-00',
        'local_de_pagamento': 'PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO.',
        'instrucoes': 'Sr. Caixa, aceitar o pagamento e não cobrar juros após o vencimento.'
      })
    })

    it('contains correct bank options', () => {
      expect(boleto.bank.options).to.have.property('logoURL').that.contains('santander.png')
      expect(boleto.bank.options).to.have.property('codigo', '033')
    })

    it('contains correct codigo_banco', () => {
      expect(boleto.codigo_banco).to.equal('033-7')
    })

    it('contains correct barcode_data', () => {
      expect(boleto.barcode_data).to.equal('0339670300000001500900004690000000000060025')
    })

    it('contains correct linha_digitavel', () => {
      expect(boleto.linha_digitavel).to.equal('03399.00003 46900.000004 00006.00254 6 70300000001500')
    })
  })
})

