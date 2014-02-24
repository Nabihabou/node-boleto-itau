var fs = require('fs'),
	ejs = require('ejs'),
	formatters = require('./formatters'),
	barcode = require('./barcode');

var banks = {};
var banksFolders = fs.readdirSync(__dirname + '/../banks/');
for(var i = 0; i < banksFolders.length; i++) {
  var Bank = require(__dirname + '/../banks/' + banksFolders[i] + '/index.js');
  banks[banksFolders[i]] = new Bank(formatters);
}

var Boleto = function(options) {
  if(!options) {
	throw "No options provided initializing Boleto.";
  }

  this.bank = banks[options['banco']];
  if(!this.bank) {
	throw "Invalid bank."
  }

  if(!options['data_emissao']) {
	options['data_emissao'] = new Date();
  }

  if(!options['data_expiracao']) {
	options['data_expiracao'] = new Date(new Date().getTime() + (5 * 24 * 3600 * 1000));
  }

  this.options = options;
  this._calculate();
};

Boleto.barcodeRenderEngine = 'css';

Boleto.prototype._calculate = function() {
  this.options['codigo_banco'] = this.bank.options.codigo + "-" + formatters.mod11(this.bank.options.codigo);
  this.options['nosso_numero_dv'] = formatters.mod11(this.options['nosso_numero']);
  this.options['barcode_data'] = this.bank.barcodeData(this.options);
  this.options['linha_digitavel'] = this.bank.linhaDigitavel(this.options['barcode_data']);
}

Boleto.prototype.renderHTML = function(callback) {
  var self = this;

  fs.readFile(__dirname + '/../assets/layout.ejs', function(err, content){
	if(err) {
	  throw err;
	}

	var renderOptions = self.bank.options;
	renderOptions.boleto = self.options;

	// Copy renderHelper's methods to renderOptions
	for(var key in formatters) {
	  renderOptions[key] = formatters[key];
	}

	renderOptions['barcode_render_engine'] = Boleto.barcodeRenderEngine;

	if(Boleto.barcodeRenderEngine == 'bmp') {
	  renderOptions['barcode_data'] = barcode.bmpLineForBarcodeData(self.options['barcode_data']);
	} else if(Boleto.barcodeRenderEngine == 'css') {
	  renderOptions['barcode_data'] = barcode.binaryRepresentationForBarcodeData(self.options['barcode_data']);
	}

	var html = ejs.render(content.toString(), renderOptions);

	callback(html);
  });
}

module.exports = Boleto;
