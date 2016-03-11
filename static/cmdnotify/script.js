/* global Promise */
(function(){ "use strict";
	
	var PRODLIST = [
		'partnersportal.jeld-wen.com',
		'www.jeld-wen.com'
	];
	var DEVLIST = [
		'jeld-wen-partners-portal',
		'jeld-wen-com',
	];
	
	var barHeight = 20;
	
	var prex = document.getElementById("inst-tag");
	if(prex) { prex.parentNode.removeChild(prex); }
	
	function inIframe () {
		try {
			return window.self !== window.top;
		} catch (e) {
			return true;
		}
	}
	
	var fancyShow = function(el){
		
		document.body.appendChild(el);
		
		return new Promise(function(resolve){
			var last = +new Date();
			var sc = 0;
			var tick = function() {
				
				sc = (sc + (new Date() - last) / 500);
				el.style.transform = 'scaleY('+sc+')';	
				
				last = +new Date();
				
				if (sc < 1) {
					if(window.requestAnimationFrame){
						requestAnimationFrame(tick);
					} else {
						setTimeout(tick, 16);
					}
				} else {
					el.style.transform = 'scaleY(1)';
					resolve();
				}
			};
			
			tick();
		});
		
	};
	
	if(inIframe()) { return; } 
	
	var PROD = document.createElement("div");
	PROD.innerHTML = "PRODUCTION";
	PROD.style.background = "red";
	
	var DEV = document.createElement("div");
	DEV.innerHTML = "DEVELOPMENT";
	DEV.style.background = "green";
	
	var insttag	= null;
	
	if(DEVLIST.indexOf(window.location.host) > -1){
		insttag = DEV;
	} 
	
	// Prod wins ties.
	if(PRODLIST.indexOf(window.location.host) > -1){
		insttag = PROD;
	} 
	
	if(!insttag) { return; }
	
	insttag.setAttribute("id","inst-tag");
	
	//var inststyle = document.createElement("style");
	
	var style = {
		position:'fixed',
		top:'0px',
		'transform': 'scaleY(0)',
		left:'0',
		right:'0',
		margin:'auto',
		width:'200px',
		height:barHeight+'px',
		'font-family': 'Consolas',
		'line-height': barHeight+'px',
		'text-align':'center',
		color:'white',
		'z-index':100000,
		'letter-spacing': '5px',
		'font-weight': 'bold',
		'font-size': '16px',
		'border-radius': '0px 0px 100px 100px',
		'transform-origin': 'top',
	};
	
	for (var i in style) { if(style.hasOwnProperty(i)){
		insttag.style[i] = style[i];
	}}
	
	fancyShow(insttag).then(function(){
		
		var factor = 3;
		
		document.body.addEventListener("mousemove",function(e){
			var tol = (insttag.clientHeight * factor);
			if(e.clientY <= tol){
				var str = e.clientY / tol;
				insttag.style.transform = 'scaleY('+str+')';
			} else {
				if(insttag.style.transform !== 'scaleY(1)') { insttag.style.transform = 'scaleY(1)'; }
			}
		});
		
		document.addEventListener("mouseout",function(e){
			e = e ? e : window.event;
			var from = e.relatedTarget || e.toElement;
			if (!from || from.nodeName === "HTML") {
				insttag.style.transform = 'scaleY(1)';
			}
		});
		
	});
	
})();