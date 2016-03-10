(function(){
	
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
	if(prex) prex.parentNode.removeChild(prex);
  
	function inIframe () {
		try {
			return window.self !== window.top;
		} catch (e) {
			return true;
		}
	}
	
	var fancyShow = function(el){
		
		document.body.appendChild(el);
		
		return new Promise(function(resolve,reject){
			var last = +new Date();
			var tick = function() {
				
				var cur = parseFloat(el.style.top);
				//console.log('tick',cur);
				
				cur = (cur + (new Date() - last) / 20);
				el.style.top = cur + "px";			
				
				last = +new Date();

				if (cur < 0) {
					(window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
				} else {
					el.style.top = 0;
					resolve();
				}
			};

			tick();
		});
		
	}
  
	if(inIframe()) return;

	var PROD = document.createElement("div");
	PROD.innerHTML = "PRODUCTION";
	PROD.style.background = "red";

	var DEV = document.createElement("div");
	DEV.innerHTML = "DEVELOPMENT";
	DEV.style.background = "green";
	
	var insttag	= null;
	
	if(!!~DEVLIST.indexOf(window.location.host)){
		insttag = DEV;
	} 
	
	// Prod wins ties.
	if(!!~PRODLIST.indexOf(window.location.host)){
		insttag = PROD;
	} 
	
	if(!insttag) return;
	
	insttag.setAttribute("id","inst-tag");
	
	var inststyle = document.createElement("style");
	
	var style = {
		position:'fixed',
		top:'-'+barHeight+'px',
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
	};
	
	for(i in style){
		insttag.style[i] = style[i];
	}
	
	fancyShow(insttag).then(function(){
		
		var factor = 3;
	
		document.body.addEventListener("mousemove",function(e){
			var tol = (insttag.clientHeight * factor);
			if(e.clientY <= tol){
				var newY = Math.min(0,-1*(tol - e.clientY));
				insttag.style.top = (newY/factor)+"px";
			} else {
				if(insttag.style.top !== "0px") insttag.style.top = "0px";
			}
		});
	  
		document.addEventListener("mouseout",function(e){
			e = e ? e : window.event;
			var from = e.relatedTarget || e.toElement;
			if (!from || from.nodeName == "HTML") {
				insttag.style.top = "0px";
			}
		});
		
	});
  
})();