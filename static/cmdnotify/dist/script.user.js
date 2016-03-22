// ==UserScript==
// @name CMD Instance Notifier
// @namespace cades
// @include *
// @version 1.0.0
// @grant none
// ==/UserScript==

(function(url){ var script = document.createElement("script"); script.type = "text/javascript"; script.src = url+"?"+(new Date().getTime()); document.body.appendChild(script); })("//GreyMage.github.io/static/cmdnotify/dist/script.min.js");