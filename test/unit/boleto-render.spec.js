const boletoMock20181109 = require('../mocks/boleto-2018-11-09')
const boletoMock20181031 = require('../mocks/boleto-2018-10-31')
const expect = require('chai').expect

describe('Boleto render', () => {
  describe('boleto from 2018-11-09', () => {
    let boletoHTML20181109, boletoHTML20181031
    before(() => {
      return new Promise((resolve, reject) => {
        boletoMock20181109.renderHTML(function (html) {
          boletoHTML20181109 = html
          resolve(html)
        })
      })
    })

    before(() => {
      return new Promise((resolve, reject) => {
        boletoMock20181031.renderHTML(function (html) {
          boletoHTML20181031 = html
          resolve(html)
        })
      })
    })

    it('should have the expiration date as 09/11/2018', () => {
      expect(boletoHTML20181109.includes('09/11/2018')).to.be.equal(true)
    })

    it('should have the expiration date as 31/10/2018', () => {
      expect(boletoHTML20181031.includes('31/10/2018')).to.be.equal(true)
    })
  })
})
