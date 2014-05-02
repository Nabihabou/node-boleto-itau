var formatters = require('../../lib/formatters');

exports.options = {
  logoURL: 'https://pagar.me/assets/boleto/images/bradesco.jpg',
  codigo: '237'
}

exports.dvBarra = function(barra) {
  var resto2 = formatters.mod11(barra, 9, 1);
  return (resto2 == 0 || resto2 == 1 || resto2 == 10) ? 1 : 11 - resto2;
}

exports.barcodeData = function(boleto){
  var codigoBanco = this.options.codigo;
  var numMoeda = "9";
  var fixo = "9"; // Numero fixo para a posição 05-05
  
  var fatorVencimento = formatters.fatorVencimento(boleto['data_vencimento']);

  var agencia = formatters.addTrailingZeros(boleto['agencia'], 4);

  var valor = formatters.addTrailingZeros(boleto['valor'], 10);
  var carteira = boleto['carteira'];
  var codigoCedente = formatters.addTrailingZeros(boleto['codigo_cedente'], 7);

  var nossoNumero = carteira + formatters.addTrailingZeros(boleto['nosso_numero'], 11);

  var barra = codigoBanco + numMoeda + fatorVencimento + valor + agencia + nossoNumero + codigoCedente + '0';

  var dvBarra = this.dvBarra(barra);
  var lineData = barra.substring(0, 4) + dvBarra + barra.substring(4, barra.length);

  return lineData;
}

exports.linhaDigitavel = function(barcodeData) {
  // 01-03    -> Código do banco sem o digito
  // 04-04    -> Código da Moeda (9-Real)
  // 05-05    -> Dígito verificador do código de barras
  // 06-09    -> Fator de vencimento
  // 10-19    -> Valor Nominal do Título
  // 20-44    -> Campo Livre (Abaixo)
  // 20-23    -> Código da Agencia (sem dígito)
  // 24-05    -> Número da Carteira
  // 26-36    -> Nosso Número (sem dígito)
  // 37-43    -> Conta do Cedente (sem dígito)
  // 44-44    -> Zero (Fixo)

  var campos = new Array();

  // 1. Campo - composto pelo código do banco, código da moéda, as cinco primeiras posições
  // do campo livre e DV (modulo10) deste campo
  var campo = barcodeData.substring(0, 3) + barcodeData.substring(3, 4) + barcodeData.substring(19, 20) + barcodeData.substring(20, 24);
  campo = campo + formatters.mod10(campo);
  campo = campo.substring(0, 5) + '.' + campo.substring(5, campo.length);
  campos.push(campo);

  // 2. Campo - composto pelas posiçoes 6 a 15 do campo livre
  // e livre e DV (modulo10) deste campo
  var campo = barcodeData.substring(24, 34);
  campo = campo + formatters.mod10(campo);
  campo = campo.substring(0, 5) + '.' + campo.substring(5, campo.length);
  campos.push(campo);

  // 3. Campo composto pelas posicoes 16 a 25 do campo livre
  // e livre e DV (modulo10) deste campo
  var campo = barcodeData.substring(34, 44);
  campo = campo + formatters.mod10(campo);
  campo = campo.substring(0, 5) + '.' + campo.substring(5, campo.length);
  campos.push(campo);

  // 4. Campo - digito verificador do codigo de barras
  var campo = barcodeData.substring(4, 5);
  campos.push(campo);

  // 5. Campo composto pelo fator vencimento e valor nominal do documento, sem
  // indicacao de zeros a esquerda e sem edicao (sem ponto e virgula). Quando se
  // tratar de valor zerado, a representacao deve ser 000 (tres zeros).
  var campo = barcodeData.substring(5, 9) + barcodeData.substring(9, 19);
  campos.push(campo);

  return campos.join(" ");
}

// exports.parseEDIFile = function(fileContent){
//   try {
// 	var lines = fileContent.split("\n");
// 	var parsedFile = {
// 	  boletos: {}
// 	};
//
// 	var currentNossoNumero = null;
//
// 	for(var i = 0; i < lines.length; i++) {
// 	  var line = lines[i];
// 	  var registro = line.substring(7, 8);
//
// 	  if(registro == '0') {
// 		parsedFile['cnpj'] = line.substring(17, 32);
// 		parsedFile['razao_social'] = line.substring(72, 102);
// 		parsedFile['agencia_cedente'] = line.substring(32, 36);
// 		parsedFile['conta_cedente'] = line.substring(37, 47);
// 		parsedFile['data_arquivo'] = formatters.dateFromEdiDate(line.substring(143, 152));
// 	  } else if(registro == '3') {
// 		var segmento = line.substring(13, 14);
//
// 		if(segmento == 'T') {
// 		  var boleto = {};
//
// 		  boleto['codigo_ocorrencia'] = line.substring(15, 17);
// 		  boleto['vencimento'] = formatters.dateFromEdiDate(line.substring(69, 77));
// 		  boleto['valor'] = formatters.removeTrailingZeros(line.substring(77, 92));
// 		  boleto['tarifa'] = formatters.removeTrailingZeros(line.substring(193, 208));
// 		  boleto['banco_recebedor'] = formatters.removeTrailingZeros(line.substring(92, 95));
// 		  boleto['agencia_recebedora'] = formatters.removeTrailingZeros(line.substring(95, 100));
//
// 		  currentNossoNumero = formatters.removeTrailingZeros(line.substring(40, 52));
// 		  parsedFile.boletos[currentNossoNumero] = boleto;
// 		} else if(segmento == 'U') {
// 		  parsedFile.boletos[currentNossoNumero]['valor_pago'] = formatters.removeTrailingZeros(line.substring(77, 92));
//
// 		  var paid = parsedFile.boletos[currentNossoNumero]['valor_pago'] >= parsedFile.boletos[currentNossoNumero]['valor'];
// 		  paid = paid && parsedFile.boletos[currentNossoNumero]['codigo_ocorrencia'] == '17';
//
// 		  parsedFile.boletos[currentNossoNumero]['pago'] = paid;
//
// 		  currentNossoNumero = null;
// 		}
// 	  }
// 	}
//
// 	return parsedFile;
//   } catch(e) {
// 	return null;
//   }
// };
