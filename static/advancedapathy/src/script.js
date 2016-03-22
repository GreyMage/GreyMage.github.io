/*global IGNORELIST*/
/*global socket*/
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
	
	apathy._addChatMsg = addChatMsg;
	apathy.addChatMsg = function(data,_to) {
		whenExists(_to, function(to) {

			// New format cause fuck all that argument shit. know whats cool? Objects.
			var nick = "Apa.. "+data.msg.nick;
			var msgText = data.msg.msg; // Don't hate me.
			var metadata = data.msg.metadata;
			var isGhost = data.ghost;

			if(typeof(nick != "undefined"))	var msgwrap = $("<div/>").appendTo(to).addClass("msg-" + nick);
			var newmsg = $("<div/>");

			if (IGNORELIST.indexOf(nick) != -1 ||
				(IGNORE_GHOST_MESSAGES && isGhost)) {
				// Don't add the message if we're ignoring the sender or it's a ghost on a reconnect
				return;
			}
			
			msgwrap.addClass($("#chatlist ."+nick).attr("class"));
			if(metadata.graymute){msgwrap.addClass("graymute");}
			
			var isSquee = (nick != NAME && NAME.length > 0 && detectName(NAME, msgText));
			var includeTimestamp = false;
			
			switch (data.msg.emote) {
				case false:
					// Regular message
					if (isSquee) {
						msgwrap.addClass("highlight");
						doSqueeNotify();
						addNewMailMessage(data.msg.nick, data.msg.msg);
					}
					
					newmsg.addClass("message").appendTo(msgwrap);
					
					if (to.data("lastMsgRecvBy") != nick) {
						var name = $("<span/>").addClass("nick").appendTo(newmsg);
						if (metadata.nameflaunt) {
							name.addClass("flaunt level_" + data.msg.type);
						}
						if (metadata.flair != 0 && metadata.flair != null) {
							name.text(nick);
							$("<div/>").addClass("flair").addClass("flair_" + metadata.flair).appendTo(name);
							name.append(":");
						}
						else {
							name.text(nick + ":");
						}
						includeTimestamp = true;
					}
					
					$("<span/>").addClass("msg").appendTo(newmsg).append(formatChatMsg(msgText));
					to.data("lastMsgRecvBy", nick);
					break;
				case "act":
					// Action text
					if (isSquee) {
						msgwrap.addClass("highlight");
						doSqueeNotify();
					}
					
					newmsg.addClass("message act").appendTo(msgwrap);
					$("<span/>").addClass("nick").appendTo(newmsg).text(nick);
					$("<span/>").addClass("msg").appendTo(newmsg).append(formatChatMsg(msgText));
					includeTimestamp = true;
					to.data("lastMsgRecvBy", "");
					break;
				case "request":
					// Request
					newmsg.addClass("message request").appendTo(msgwrap);
					$("<span/>").addClass("nick").appendTo(newmsg).text(nick);
					$("<span/>").addClass("msg").appendTo(newmsg).append(formatChatMsg("requests " + msgText));
					includeTimestamp = true;
					to.data("lastMsgRecvBy", "");
					break;
				case "sweetiebot":
					// [](/sbstare)
					if (isSquee) {
						msgwrap.addClass("highlight");
						doSqueeNotify();
						addNewMailMessage(data.msg.nick, data.msg.msg);
					}
					newmsg.addClass("message sweetiebot").appendTo(msgwrap);
					$("<span/>").addClass("nick").appendTo(newmsg).text(nick + ":");
					$("<span/>").addClass("msg").appendTo(newmsg).append(formatChatMsg(msgText));
					includeTimestamp = true;
					to.data("lastMsgRecvBy", "");
					break;
				case "spoiler":
					// Spoiler text
					newmsg.addClass("message spoiler").appendTo(msgwrap);
					$("<span/>").addClass("nick").appendTo(newmsg).text(nick + ":");
					$("<span/>").addClass("spoiltag").appendTo(newmsg).text("SPOILER:");
					$("<span/>").addClass("msg").appendTo(newmsg).append(formatChatMsg(msgText));
					includeTimestamp = true;
					to.data("lastMsgRecvBy", "");
					break;
				case "rcv":
					// ROYAL CANTERLOT VOICE
					if (isSquee) {
						msgwrap.addClass("highlight");
						doSqueeNotify();
						addNewMailMessage(data.msg.nick, data.msg.msg);
					}
					newmsg.addClass("message rcv").appendTo(msgwrap);
					$("<span/>").addClass("nick").appendTo(newmsg).text(nick + ":");
					var msg = $("<span/>").addClass("msg").appendTo(newmsg).append(formatChatMsg(msgText));
					
					msgwrap.data("oldPlace", msg.prev());
					msgwrap.data("madeAt", new Date().getTime());
					var rcv = $("#chatbuffer").data("rcv");
					rcv.unshift(msgwrap);
					
					includeTimestamp = true;
					to.data("lastMsgRecvBy", "");
					break;
				case "drink":
					// Drink call
					msgwrap.addClass("drinkWrap");
					if (msgwrap.prev().hasClass("drinkWrap")) {
						msgwrap.css("border-top", "0px");
					}
					newmsg.addClass("message drink").appendTo(msgwrap);
					var tr = $("<tr/>").appendTo($("<table/>").appendTo(newmsg));
					var td = $('<td width="100%"/>').appendTo(tr);
					$("<span/>").addClass("nick").appendTo(td).text(nick + ":");
					$("<span/>").addClass("msg").appendTo(td).html(msgText + " drink!");
					
					if (data.msg.multi > 1) {
						$("<span/>").addClass("multi").appendTo($("<td/>").appendTo(tr)).text(data.msg.multi + "x");
					}
					
					to.data("lastMsgRecvBy", "");
					break;
				case "poll":
					// New poll
					newmsg.addClass("pollNote").appendTo(msgwrap);
					$("<span/>").appendTo(newmsg).html(nick + ' has created a new poll: "' + msgText + '"');
					break;
				case "server":
					// Server message
					console.log(msgText);
					newmsg.addClass("server").appendTo(msgwrap);
					$("<span/>").appendTo(newmsg).html(msgText);
					break;
				default:
					dbg("Unknown message type, emote=" + data.msg.emote);
					return;
			}

			while ($(to).children().length > 500) {
				$(to).children().first().remove();
			}

			var d = new Date(data.msg.timestamp);
			CHATLIST[nick] = d.getTime();

			if (includeTimestamp) {
				var h = addZero(d.getHours());
				var m = addZero(d.getMinutes());
				var s = addZero(d.getSeconds());
				var name = $("<span/>").addClass("timestamp").prependTo(newmsg).text("<" + h + ":" + m + ":" + s + ">");
			}
			
			if (!isGhost) {
				notifyNewMsg(metadata.channel, isSquee, data.msg.emote == "rcv");
			}
		});
	}
	// Monkeypatch
	addChatMsg = apathy.addChatMsg;
	
	function main(){
		socket.once("chatMsg",function(){
			setTimeout(function(){
				apathy.loadApathy();
				apathy.loopCheck();
			},2000);
		});
	}
	
	ready(main);
    
})();
