const chai = require('chai')
chai.use(require('chai-subset'))
chai.use(require('chai-datetime'))
const expect = chai.expect

const ediParser = require('../../../index').EdiParser

const ediFileContent = `
02RETORNO01COBRANCA       00000000000004628596PAGAR.ME PAGAMENTOS S.A.      237BRADESCO       2005160160000000001                                                                                                                                                                                                                                                                          220514         000001
1021872705300017400000250122900004693                         000000000000000000600000000000000000000000000506200516          00000000000000000000000000000000000150034103830  000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000   210516             00000000000000                                                                  000002
9201237          000000010000000000150000000001          00000000000000000000000000500000010000000005000000000000000000000000000000000000000000000000000000000000000000000000000000000000000                                                                                                                                                                              00000000000000000000000         000003`

describe('Bradesco EDI Parser', () => {
  describe('when parsing a valid EDI file', () => {
    let result
    let boleto
    before(() => {
      result = ediParser.parse('bradesco', ediFileContent)
      boleto = result.boletos[0]
    })

    it('should have found 1 boleto', () => {
      expect(result.boletos).to.have.lengthOf(1)
    })

    it('should parse boleto correctly', () => {
      expect(boleto).to.containSubset({
        codigo_ocorrencia: '06',
        motivos_ocorrencia: [
          '00',
          '00',
          '00',
          '00',
          '00'
        ],
        valor_pago: '100',
        valor: '1500',
        banco_recebedor: '341',
        agencia_recebedora: '3830',
        paid: true,
        edi_line_number: 2,
        edi_line_checksum: '3bc78a0fa0897ab07f14f17a6b723f1ca6140f93',
        edi_line_fingerprint: '2:3bc78a0fa0897ab07f14f17a6b723f1ca6140f93',
        nosso_numero: '6'
      })
    })

    it('should parse boleto data_ocorrencia correctly', () => {
      expect(boleto.data_ocorrencia).to.equalDate(new Date(2016, 4, 20))
    })

    it('should parse boleto data_credito correctly', () => {
      expect(boleto.data_credito).to.equalDate(new Date(2016, 4, 21))
    })

    it('should parse boleto vencimento correctly', () => {
      expect(boleto.vencimento).to.equalDate(new Date(2016, 4, 20))
    })

    it('should parse EDI properties correctly', () => {
      expect(result).to.containSubset({
        razao_social: 'PAGAR.ME PAGAMENTOS S.A.      ',
        cnpj: '18727053000174',
        carteira: '25',
        agencia_cedente: '1229',
        conta_cedente: '4693'
      })

      it('should parse EDI dates correctly', () => {
        expect(result.data_arquivo).to.equalDate(new Date(2016, 4, 20))
      })
    })
  })
})
