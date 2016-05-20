// Attach "Character Left" indicators
(function(){
	
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
	}
	
	// Using a special variant to allow multiple events at once.
	function addEventListener(el, eventName, handler) {
		eventName.split(" ").forEach(function(eventName){
			if (el.addEventListener) {
				el.addEventListener(eventName, handler);
			} else {
				el.attachEvent('on' + eventName, function(){
					handler.call(el);
				});
			}
		});
	}
	
	var addClass = addClass || function(el,className){
		if (el.classList)
			el.classList.add(className);
		else
			el.className += ' ' + className;
	};
	
	var removeClass = removeClass || function(el,className){
		if (el.classList)
			el.classList.remove(className);
		else
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}
	
	function checkForCharlimit(el){
		
		var amtAttr = 'data-charlimit-amount';
		var addAttr = 'data-charlimit-value';
		
		if(!el) return;
		if(!el.getAttribute(amtAttr)) return;
		if(!el.getAttribute('id')) return;
		
		el.charlimit = {};
		
		el.charlimit.max = function(){
			return parseInt(el.getAttribute(amtAttr),10);
		}
		
		el.charlimit.init = function(){
			el.charlimit.updateLabels();
			addEventListener(el,"keypress change input",el.charlimit.update);
		};
		
		el.charlimit.update = function(e){
			el.charlimit.oldvalue = el.charlimit.oldvalue || "";
			if(!el.charlimit.valid()){
				e.preventDefault();
				el.value = el.charlimit.oldvalue;
			} else {
				el.charlimit.oldvalue = el.value
			}
			el.charlimit.updateLabels();
		}
		
		// Gets all labels every time. slightly less efficient than saving them, but allows for
		// delegate-like behavior in that newly added elements need no special introduction.
		el.charlimit.getLabels = function(){
			var set = [];
			for(var i=0, list = document.getElementsByTagName("*") ; i < list.length; i++){
				if(list[i].getAttribute(addAttr) == el.getAttribute('id')){
					set.push(list[i]);
				}
			}
			return set;
		}
		
		el.charlimit.valid = function(){
			if(el.value.length > el.charlimit.max()) return false;
			return true;
		}
		
		el.charlimit.updateLabels = function(){
			el.charlimit.getLabels().forEach(function(label){
				var left = el.charlimit.max() - el.value.length;
				var ratio = left / el.charlimit.max();
				label.innerHTML = left;
				label.setAttribute("data-charlimit-used-ratio",ratio);
			});
		}
		
		el.charlimit.init();
	}
	
	ready(function(){
		for(var i=0, list = document.getElementsByTagName("*") ; i < list.length; i++){
			checkForCharlimit(list[i]);
		}
	});
		
})();