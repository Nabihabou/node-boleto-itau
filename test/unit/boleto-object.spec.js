const R = require('ramda')
const moment = require('moment')

const chai = require('chai')
chai.use(require('chai-subset'))
chai.use(require('chai-datetime'))
const expect = chai.expect

const testBanks = require('../mocks/banks')
const Boleto = require('../../lib/boleto')(testBanks)

describe('Boleto Object', () => {
  describe('when creating a boleto with no options', () => {
    it('should error', () => {
      expect(() => { new Boleto() }).to.throw('No options provided initializing Boleto.') // eslint-disable-line no-new
    })
  })

  describe('when creating a boleto with invalid bank', () => {
    it('should error', () => {
      expect(() => { new Boleto({ banco: 'richardbank' }) }).to.throw('Invalid bank.') // eslint-disable-line no-new
    })
  })

  describe('when creating a valid boleto with empty dates', () => {
    const boletoOptions = {
      'banco': 'test',
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
      'instrucoes': 'Sr. Caixa, aceitar o pagamento e não cobrar juros após o vencimento.\nTOP\n\nKEK'
    }

    let boleto
    before(() => {
      boleto = new Boleto(boletoOptions)
    })

    it('has current date as data_emissao', () => {
      expect(moment(boleto.data_emissao).format()).to.be.equal(moment().utc().format())
    })

    it('has five days past data_emissao as data_vencimento', () => {
      expect(moment(boleto.data_vencimento).format()).to.be.equal(moment().utc().add(5, 'days').format())
    })
  })

  describe('when creating a boleto with empty payment location', () => {
    const boletoOptions = {
      'banco': 'test',
      'data_emissao': new Date(),
      'data_vencimento': new Date(new Date().getTime() + 5 * 24 * 3600 * 1000),
      'valor': 1500,
      'nosso_numero': '6',
      'numero_documento': '1',
      'cedente': 'Pagar.me Pagamentos S/A',
      'cedente_cnpj': '18727053000174',
      'agencia': '1229',
      'codigo_cedente': '469',
      'carteira': '25',
      'pagador': 'Nome do pagador\nCPF: 000.000.000-00',
      'instrucoes': 'Sr. Caixa, aceitar o pagamento e não cobrar juros após o vencimento.\nTOP\n\nKEK'
    }

    let boleto
    before(() => {
      boleto = new Boleto(boletoOptions)
    })

    it('has default local_de_pagamento', () => {
      expect(boleto.local_de_pagamento).to.equal('Até o vencimento, preferencialmente no Banco Test')
    })
  })

  describe('when creating a valid boleto', () => {
    const boletoOptions = {
      'banco': 'test',
      'data_emissao': new Date(),
      'data_vencimento': new Date(new Date().getTime() + 5 * 24 * 3600 * 1000),
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
      'instrucoes': 'Sr. Caixa, aceitar o pagamento e não cobrar juros após o vencimento.\nTOP\n\nKEK'
    }

    let boleto
    before(() => {
      boleto = new Boleto(boletoOptions)
    })

    it('contains creation properties', () => {
      expect(boleto).to.containSubset(R.omit(['pagador', 'instrucoes', 'data_emissao', 'data_vencimento'], boletoOptions))
    })

    it('contains formatted pagador', () => {
      expect(boleto.pagador).to.equal('Nome do pagador<br/>CPF: 000.000.000-00')
    })

    it('contains formatted instrucoes', () => {
      expect(boleto.instrucoes).to.equal('Sr. Caixa, aceitar o pagamento e não cobrar juros após o vencimento.<br/>TOP<br/><br/>KEK')
    })

    it('contains dates in options', () => {
      expect(moment(boleto.data_emissao).format()).to.be.equal(moment(boletoOptions.data_emissao).format())
      expect(moment(boleto.data_vencimento).format()).to.be.equal(moment(boleto.data_vencimento).format())
    })

    it('contains formatted nosso_numero_dv', () => {
      expect(boleto.nosso_numero_dv).to.equal(0)
    })

    it('contains a bank object', () => {
      expect(boleto).to.include.keys('bank')
    })

    it('contains calculated properties', () => {
      expect(boleto).to.include.all.keys(['codigo_banco', 'barcode_data', 'linha_digitavel'])
    })
  })
})
