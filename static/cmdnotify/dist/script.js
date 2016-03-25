/* global Promise */
(function(){ "use strict";
	
	// Load CSS
	(function(){
		var css = document.createElement("link");
		css.rel = "stylesheet";
		css.href = "//GreyMage.github.io/static/cmdnotify/dist/style.min.css"+"?"+(new Date().getTime());
		css.type = "text/css";
		document.head.appendChild(css);
	})();
	
	var PRODLIST = [
		'partnersportal.jeld-wen.com',
		'www.jeld-wen.com'
	];
	var DEVLIST = [
		'jeld-wen-partners-portal',
		'jeld-wen-com',
		'jw-clt-jira-form',
		'jeld-wen-com-dev-ids-replacement.developmentcmd.com',
	];
		
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
			var tick = function() {
				
				var cur = parseFloat(el.style.top);			
				cur = (cur + (new Date() - last) / 20);
				el.style.top = cur + "px";			
				
				last = +new Date();
				
				if (cur < 0) {
					if(window.requestAnimationFrame){
						requestAnimationFrame(tick);
					} else {
						setTimeout(tick, 16);
					}
				} else {
					el.style.top = 0;
					resolve();
				}
			};
			
			tick();
		});
		
	};
	
	if(inIframe()) { return; } 
	
	var insttag	= document.createElement("div");
	if(PRODLIST.indexOf(window.location.host) > -1){
		insttag.classList.add("production");
	} else if(DEVLIST.indexOf(window.location.host) > -1){
		insttag.classList.add("development");
	} else {
		return; // We shouldnt be here
	}
	
	insttag.setAttribute("id","inst-tag");
		
	fancyShow(insttag).then(function(){
		
		var factor = 3;
		
		document.body.addEventListener("mousemove",function(e){
			var tol = (insttag.clientHeight * factor);
			if(e.clientY <= tol){
				var newY = Math.min(0,-1*(tol - e.clientY));
				insttag.style.top = (newY/factor)+"px";
			} else {
				if(insttag.style.top !== "0px") { insttag.style.top = "0px"; }
			}
		});
		
		document.addEventListener("mouseout",function(e){
			e = e ? e : window.event;
			var from = e.relatedTarget || e.toElement;
			if (!from || from.nodeName === "HTML") {
				insttag.style.top = "0px";
			}
		});
		
	});
	
})();