/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(1);

	var engine = __webpack_require__(5);
	var Actor = __webpack_require__(6);
	//const player = require("./lib/actors/oldplayer.js");
	var Player = __webpack_require__(7);
	var Pickaxe = __webpack_require__(8);

	var joe = new Actor();
	var fred = new Player();

	engine.add(joe);
	engine.add(fred);
	engine.add(new Pickaxe());
	engine.kickoffRenderLoop();

	//document.write(require("./content.js"));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./style.less", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./style.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "body {\n  background: lightblue;\n}\n#game {\n  width: 800px;\n  height: 500px;\n  border: 2px solid black;\n}\n", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	var engine = {};

	// get engine elem
	engine.canvas = document.getElementById("game");

	// CSS to dom fix. Lets you be lazy. :)
	engine.canvas.setAttribute("width", engine.canvas.clientWidth);
	engine.canvas.setAttribute("height", engine.canvas.clientHeight);

	// get canvas context
	engine.ctx = engine.canvas.getContext("2d");

	// Stuff to render
	engine.items = [];

	var render = function render() {
		// Clear engine.
		engine.ctx.clearRect(0, 0, engine.width(), engine.height());

		engine.items.forEach(function (item) {
			if (item.render) {
				item.render(engine.ctx, {
					width: engine.width(),
					height: engine.height()
				});
			}
		});

		window.requestAnimationFrame(render);
	};

	var distance = function distance(a, b) {
		return Math.sqrt((b.x - a.x) * (b.x - a.x) // (x2 - x1)^2
		+ (b.y - a.y) * (b.y - a.y) // (y2 - y1)^2
		);
	};

	var tick = function tick() {
		engine.items.forEach(function (item) {

			if (item.tick) {
				item.tick();
			}

			if (item.solid) {
				engine.items.forEach(function (other) {
					if (item == other) return;
					if (!other.solid) return;
					var d = distance(item, other);
					if (d < item.r + other.r) {
						if (item.collide) item.collide(other);
					}
				});
			}
		});

		window.requestAnimationFrame(tick);
	};

	engine.width = function () {
		return engine.canvas.clientWidth;
	};
	engine.height = function () {
		return engine.canvas.clientHeight;
	};

	engine.add = function (item) {
		item.engine = engine;
		engine.items.push(item);
		if (item.init) item.init(engine);
	};

	engine.kickoffRenderLoop = function () {
		if (engine.__rendering) return;
		engine.__rendering = true;
		window.requestAnimationFrame(render);
		window.requestAnimationFrame(tick);
	};

	module.exports = engine;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Actor = function () {
		function Actor() {
			_classCallCheck(this, Actor);

			this.x = 0;
			this.y = 0;
			this.r = 0;
			this.speed = 0;
			this.solid = false;
			this.inputs = {};
		}

		_createClass(Actor, [{
			key: "init",
			value: function init(engine) {
				this.engine = engine;
				this.class = "Actor";
			}
		}, {
			key: "tick",
			value: function tick() {}
		}, {
			key: "render",
			value: function render(ctx) {}
		}, {
			key: "move",
			value: function move(delta) {
				this.x += delta.x || 0;
				this.y += delta.y || 0;
			}
		}]);

		return Actor;
	}();

	module.exports = Actor;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _actor = __webpack_require__(6);

	var _actor2 = _interopRequireDefault(_actor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Player = function (_Actor) {
		_inherits(Player, _Actor);

		function Player() {
			_classCallCheck(this, Player);

			var _this = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this));

			_this.r = 10;
			_this.speed = 4;
			_this.solid = true;
			_this.inputs = {
				left: false,
				right: false,
				up: false,
				down: false
			};
			return _this;
		}

		_createClass(Player, [{
			key: 'render',
			value: function render(ctx) {

				_get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), 'render', this).call(this, ctx);
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'rgba(0,0,0,0.5)';
				ctx.fill();
				ctx.lineWidth = 1;
				ctx.strokeStyle = 'rgba(0,0,0,1)';
				ctx.stroke();
			}
		}, {
			key: 'tick',
			value: function tick() {
				_get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), 'tick', this).call(this);
				// Handle any movement
				this.move({
					x: (this.inputs.right ? 1 : 0) * this.speed - (this.inputs.left ? 1 : 0) * this.speed,
					y: (this.inputs.down ? 1 : 0) * this.speed - (this.inputs.up ? 1 : 0) * this.speed
				});
			}
		}, {
			key: 'handleKeyDown',
			value: function handleKeyDown(event) {
				if (event.keyCode === 65) this.inputs.left = true;
				if (event.keyCode === 68) this.inputs.right = true;
				if (event.keyCode === 87) this.inputs.up = true;
				if (event.keyCode === 83) this.inputs.down = true;
			}
		}, {
			key: 'handleKeyUp',
			value: function handleKeyUp(event) {
				if (event.keyCode === 65) this.inputs.left = false;
				if (event.keyCode === 68) this.inputs.right = false;
				if (event.keyCode === 87) this.inputs.up = false;
				if (event.keyCode === 83) this.inputs.down = false;
			}
		}, {
			key: 'init',
			value: function init(engine) {
				var _this2 = this;

				_get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), 'init', this).call(this, engine);
				console.log("I AM NOT A NUMBER");
				this.engine.canvas.addEventListener("keydown", function (event) {
					_this2.handleKeyDown(event);
				});
				this.engine.canvas.addEventListener("keyup", function (event) {
					_this2.handleKeyUp(event);
				});
			}
		}]);

		return Player;
	}(_actor2.default);

	module.exports = Player;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _actor = __webpack_require__(6);

	var _actor2 = _interopRequireDefault(_actor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Pickaxe = function (_Actor) {
		_inherits(Pickaxe, _Actor);

		function Pickaxe() {
			_classCallCheck(this, Pickaxe);

			var _this = _possibleConstructorReturn(this, (Pickaxe.__proto__ || Object.getPrototypeOf(Pickaxe)).call(this));

			_this.r = 3;
			_this.speed = 4;
			_this.solid = true;
			_this.inputs = {
				left: false,
				right: false,
				up: false,
				down: false
			};
			return _this;
		}

		_createClass(Pickaxe, [{
			key: 'render',
			value: function render(ctx) {

				_get(Pickaxe.prototype.__proto__ || Object.getPrototypeOf(Pickaxe.prototype), 'render', this).call(this, ctx);
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'rgba(0,255,0,0.5)';
				ctx.fill();
				ctx.lineWidth = 1;
				ctx.strokeStyle = 'rgba(0,0,0,1)';
				ctx.stroke();
			}
		}, {
			key: 'tick',
			value: function tick() {
				_get(Pickaxe.prototype.__proto__ || Object.getPrototypeOf(Pickaxe.prototype), 'tick', this).call(this);
				// Handle any movement
				this.move({
					x: (this.inputs.right ? 1 : 0) * this.speed - (this.inputs.left ? 1 : 0) * this.speed,
					y: (this.inputs.down ? 1 : 0) * this.speed - (this.inputs.up ? 1 : 0) * this.speed
				});
			}
		}, {
			key: 'collide',
			value: function collide(other) {
				console.log(other);
			}
		}, {
			key: 'init',
			value: function init(engine) {
				_get(Pickaxe.prototype.__proto__ || Object.getPrototypeOf(Pickaxe.prototype), 'init', this).call(this, engine);
				this.clazz = "Pickaxe";
			}
		}]);

		return Pickaxe;
	}(_actor2.default);

	module.exports = Pickaxe;

/***/ }
/******/ ]);