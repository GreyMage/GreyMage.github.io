;(function(){
	"use strict";
	
	var ready = ready || function(fn) {
		if (document.readyState != 'loading'){
			fn();
		} else if (document.addEventListener) {
			document.addEventListener('DOMContentLoaded', fn);
		} else {
			document.attachEvent('onreadystatechange', function() {
				if (document.readyState != 'loading')
				fn();
			});
		}
	};
		
	ready(function(){
		
	});
		
})();