exports.capitalize = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

exports.addTrailingZeros = function(string, length) {
  string = string.toString();

  while(string.length < length) {
	string = "0" + string;
  }

  return string;
}

exports.formatAmount = function(amount) {
  amount = amount.toString();
  var cents = exports.addTrailingZeros(amount.substring(amount.length - 2, amount.length), 2);
  var integers = exports.addTrailingZeros(amount.substring(0, amount.length - 2), 1);

  var newIntegers = "";

  for(var i = 0; i < integers.length; i++) {
	if(i > 0 && (integers.length - i) % 3 == 0) newIntegers += ".";
	newIntegers += integers[i];
  }

  return "R$ " + newIntegers + "," + cents;
}

exports.formatDate = function(date) {
  return exports.addTrailingZeros(date.getUTCDate(), 2) + "/" +
	exports.addTrailingZeros(date.getUTCMonth() + 1, 2) + "/" + date.getFullYear();
}
