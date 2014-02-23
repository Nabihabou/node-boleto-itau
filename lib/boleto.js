var fs = require('fs'),
	ejs = require('ejs'),
	renderHelper = require('./render-helper');

var Boleto = function(options) {
  if(!options) {
	throw "No options provided initializing Boleto.";
  }

  var bank = null;
  
  try {
	bank = require('../banks/' + options['banco'] + '/index.js');
  } catch(e) {
	throw "Unable to load bank. Check lib/banks folder.";
  }

  this.bank = bank;

  if(!options['data_emissao']) {
	options['data_emissao'] = new Date();
  }

  if(!options['data_expiracao']) {
	options['data_expiracao'] = new Date(new Date().getTime() + (5 * 24 * 3600 * 1000));
  }

  this.options = options;
};

Boleto.prototype.barcodeNumbers = function() {
  return this.bank.barcodeData();
}

Boleto.prototype._mod11 = function(num, base, r) {
  if(!base) base = 9;
  if(!r) r = 0;

  var soma = 0;
  var fator = 2;

  for(var i = num.length - 1; i >= 0; i--) {
	var parcial = parseInt(num[i]) * fator;
	soma += parcial;

	if(fator == base) {
	  fator = 1;
	}

	fator++;
  }

  if(r == 0) {
	soma *= 10;
	var digito = soma % 11;
	return digito == 10 ? 0 : digito;
  } else if(r == 1) {
	return soma % 11;
  }
}

Boleto.prototype._calculate = function() {
  this.options['codigo_banco'] = this.bank.options.codigo + "-" + this._mod11(this.bank.options.codigo);
}

Boleto.prototype.renderHTML = function(callback) {
  var self = this;

  fs.readFile(__dirname + '/../assets/layout.ejs', function(err, content){
	if(err) {
	  throw err;
	}

	self._calculate();

	var renderOptions = self.bank.options;
	renderOptions.boleto = self.options;

	// Copy renderHelper's methods to renderOptions
	for(var key in renderHelper) {
	  renderOptions[key] = renderHelper[key];
	}

	var html = ejs.render(content.toString(), renderOptions);

	callback(html);
  });
}

module.exports = Boleto;
