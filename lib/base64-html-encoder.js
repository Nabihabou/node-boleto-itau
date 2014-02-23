var fs = require('fs'),
	jsdom = require('jsdom');

exports._base64RepresentationForFile = function(path) {
  fs.readFile(path, function(err, content){
	if(err) {
	  throw err;
	}
  });
}

exports.encodeHTMLImages = function(html, callback) {
  jsdom.env({
	html: html,
	scripts: [
	  'http://code.jquery.com/jquery-1.5.min.js'
	],
	done: function (err, window) {
	  var $ = window.jQuery;

	  $('img').each(function() {
		var $img = $(this);
		var imgsrc = $img.attr('src');

		console.log(imgsrc);

		var imgsrc2 ='http://dl.dropbox.com/u/xxxxxx/img/' + imgsrc;
		$img.attr('src',imgsrc2);
	  });
	}
  });
};
