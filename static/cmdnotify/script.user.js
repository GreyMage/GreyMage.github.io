// ==UserScript==
// @name        CMD Instance Notifier ( Auto Updates )
// @namespace   cades
// @include     *
// @version     1
// @grant       none
// ==/UserScript==

// Dynamic Bootloader ( Allows evergreen scripts. )
(function(url){
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = url+"?"+(new Date().getTime());
	document.body.appendChild(script);
})("//GreyMage.github.io/static/cmdnotify/script.js");