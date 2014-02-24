exports._binaryRepresentation = function(barcodeData) {
  var digits = {
	0: "00110",
	1: "10001",
	2: "01001",
	3: "11000",
	4: "00101",
	5: "10100",
	6: "01100",
	7: "00011",
	8: "10010",
	9: "01010"
  };

  if(barcodeData.length % 2 != 0) {
	barcodeData = "0" + barcodeData;
  }

  var binaryDigits = "0000";
  // Start of barcode

  for(var i = 0; i < barcodeData.length; i += 2) {
	var digit1 = digits[parseInt(barcodeData[i])];
	var digit2 = digits[parseInt(barcodeData[i+1])];

	for(var j = 0; j < digit1.length; j++) {
	  binaryDigits += digit1[j] + digit2[j];
	}
  }

  // End of barcode
  binaryDigits += "100";

  return binaryDigits;
}

exports.bmpLineForBarcodeData = function(barcodeData) {
  var binaryRepresentation = exports._binaryRepresentation(barcodeData);
  console.log(binaryRepresentation);
}
