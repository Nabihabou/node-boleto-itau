var banks = null;

module.exports = function(banks) {
  return {
	parse: function(bankName, fileContent) {
	  // var bankCode = fileContent.substring(0, 3);
	  
	  // for(var bank in banks) {
		// if(banks[bank].options.codigo == bankCode && banks[bank].parseEDIFile) {
		  return banks[bankName].parseEDIFile(fileContent);
		// }
	  // }

	  // throw "Unsupported bank for EDI file parsing.";
	}
  }
}
