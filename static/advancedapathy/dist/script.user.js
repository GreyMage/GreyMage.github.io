// ==UserScript==
// @name Advanced Apathy
// @namespace cades
// @include http://berrytube.tv/
// @include http://www.berrytube.tv/
// @version 1.0.0
// @grant none
// ==/UserScript==

(function(url){ var script = document.createElement("script"); script.type = "text/javascript"; script.src = url+"?"+(new Date().getTime()); document.body.appendChild(script); })("//GreyMage.github.io/static/advancedapathy/dist/script.min.js");