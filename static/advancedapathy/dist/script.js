/*global IGNORELIST*/
/*global socket*/
/*global btEvents*/
(function(){
	'use strict';

	function ready(fn) {
		if (document.readyState !== 'loading'){
			fn();
		} else {
			document.addEventListener('DOMContentLoaded', fn);
		}
	}

	var apathy = {};
	
	apathy.chat = function(msg){
		var chatlist = document.getElementById("chatbuffer");
		var wrap = document.createElement("div");
		var inner = document.createElement("div");
		inner.classList.add("message");
		inner.setAttribute("style","font-size: 0.7em;");
		inner.innerHTML = "<b>** Apathy **</b>: "+msg;
		chatlist.appendChild(wrap);
		wrap.appendChild(inner);
	};
	
	apathy.saveIgnores = function(){
		var previous = apathy.getList();
		var current = IGNORELIST;
		
		current.forEach(function(name){
			if(previous.indexOf(name) === -1){
				apathy.chat("Added "+name+" To Apathy");
			}
		});
		previous.forEach(function(name){
			if(current.indexOf(name) === -1){
				apathy.chat("Removed "+name+" From Apathy");
			}
		});
		
		var x = JSON.stringify(current);
		localStorage.setItem("apathy",x);
	};
	
	apathy.getList = function(){
		var raw = localStorage.getItem("apathy") || '[]';
		var x = JSON.parse(raw);
		return x;
	};
	
	apathy.loadApathy = function(){
		var x = apathy.getList();
		var chatlist = document.getElementById("chatlist");
		x.forEach(function(name){
			var li = chatlist.getElementsByClassName(name);
			IGNORELIST.push(name);
			for(var i=0;i<li.length;i++){
				li[i].classList.add("ignored");
			}
		});
		
		apathy.chat("Loaded Apathy: "+x.join(", "));
	};
	
	apathy.loopCheck = function(){
		apathy.saveIgnores();
		setTimeout(function(){
			apathy.loopCheck();
		},1000);
	};
	
	function main(){
		socket.once("chatMsg",function(){
			setTimeout(function(){
				apathy.loadApathy();
				apathy.loopCheck();
			},2000);
		});
		
		btEvents.on("chat",function(data){
			console.log("apathy",data);
		});  
		
	}
	
	ready(main);
    window.apathy = apathy;
	
})();
