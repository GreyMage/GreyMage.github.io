
(function(){
	
	var self = {};
	
	self.page = window.location.hash.replace(/^#/,'');
	
	// Ajax
	var ajax = function(url){
		return new Promise(function(resolve,reject){
			
			var request = new XMLHttpRequest();
			request.open('GET', url, true);

			request.onload = function() {
			  if (this.status >= 200 && this.status < 400) {
				// Success!
				var resp = this.response;
				resolve(resp);
			  } else {
				// We reached our target server, but it returned an error
				reject();
			  }
			};

			request.onerror = function() {
				reject();
			};

			request.send();

		});
	}
	
	// Load JSQR
	var script = document.createElement('script');
	script.src = 'js/qrcode.min.js';
	document.head.appendChild(script);
	
	// Wait for and run
	var generate = function(){
		if(!window.QRCode) {
			setTimeout(function(){
				generate();
			},100);
			return;
		}
		new QRCode(document.getElementById("qr"), {
			text: window.location.href,
			width: 128,
			height: 128,
		});
	}
	generate();
	
	ajax("pages/"+self.page+".html").then(function(html){
		document.getElementById("main").innerHTML = html;
		document.getElementById("printtitle").innerHTML = document.getElementById("title").innerHTML;
	});
	console.log(self);
	
})();