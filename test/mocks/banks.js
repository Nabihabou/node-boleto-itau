const R = require('ramda')

module.exports = {
  test: {
    options: {
      logoURL: 'https://pagar.me/img.png',
      codigo: '123'
    },
    barcodeData: R.always('123'),
    linhaDigitavel: R.always('123')
  }
}

