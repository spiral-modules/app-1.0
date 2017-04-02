(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("sf"));
	else if(typeof define === 'function' && define.amd)
		define(["sf"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("sf")) : factory(root["sf"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _sf = __webpack_require__(1);
	
	var _sf2 = _interopRequireDefault(_sf);
	
	var _input = __webpack_require__(6);
	
	var _input2 = _interopRequireDefault(_input);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_sf2.default.instancesController.registerInstanceType(_input2.default, "sf-js-input"); //resolved in webpack's "externals"
	
	module.exports = _input2.default; // ES6 default export will not expose us as global

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(4), __esModule: true };

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $ = __webpack_require__(5);
	module.exports = function create(P, D) {
	  return $.create(P, D);
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	var $Object = Object;
	module.exports = {
	  create: $Object.create,
	  getProto: $Object.getPrototypeOf,
	  isEnum: {}.propertyIsEnumerable,
	  getDesc: $Object.getOwnPropertyDescriptor,
	  setDesc: $Object.defineProperty,
	  setDescs: $Object.defineProperties,
	  getKeys: $Object.keys,
	  getNames: $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each: [].forEach
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _create = __webpack_require__(3);
	
	var _create2 = _interopRequireDefault(_create);
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;
	
	var _sf = __webpack_require__(1);
	
	var _sf2 = _interopRequireDefault(_sf);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	//resolved in webpack's "externals"
	
	var Input = function Input(sf, node, options) {
	    this._construct(sf, node, options);
	};
	
	/**
	 * @lends sf.Form.prototype
	 */
	Input.prototype = (0, _create2.default)(_sf2.default.modules.core.BaseDOMConstructor.prototype);
	
	/**
	 * Name to register
	 * @type {string}
	 */
	Input.prototype.name = "input";
	
	Input.prototype._construct = function (sf, node, options) {
	
	    this.init(sf, node, options); //call parent
	
	    if (options) {
	        //if we pass options extend all options by passed options
	        this.options = sf.tools.extend(this.options, options);
	    }
	
	    //elements
	    this.els = {
	        node: node
	    };
	
	    if (this.options.prefix) {
	        this.setPrefix();
	        this.addPrefixEventListeners();
	    } else if (this.options.pattern) {
	        this.setupPattern();
	        this.addPatternEventListeners();
	    }
	};
	
	/**
	 * @override
	 * @inheritDoc
	 * @enum {string}
	 */
	Input.prototype.optionsToGrab = {
	    /**
	     *  Pattern of input
	     */
	    "pattern": {
	        "domAttr": "data-pattern"
	    },
	    /**
	     *  Prefix of  input
	     */
	    "prefix": {
	        "domAttr": "data-prefix"
	    }
	
	};
	
	/**
	 * Setup pattern
	 */
	Input.prototype.isValidPattern = function () {
	    return this.els.node.value.match(this.pattern);
	};
	
	Input.prototype.addPatternEventListeners = function () {
	    var that = this;
	
	    this._inputKeyPress = function (event) {
	
	        var char = String.fromCharCode(event.keyCode);
	        var value = that.els.node.value;
	        var position = that.getCursorPosition();
	
	        if (char.length > 0) {
	            event.preventDefault();
	            var offset = 1;
	            for (var i = position; i < value.length; i++) {
	                if (that.formatCharacters.indexOf(value[i]) !== -1) {
	                    offset++;
	                } else {
	                    break;
	                }
	            }
	
	            var futureValue = value.substring(0, position + offset - 1) + char + value.substring(position + offset, value.length);
	
	            if (!futureValue.match(that.patternWithEmpty)) {
	                return false;
	            } else {
	                that.els.node.value = futureValue;
	                that.setCursorPosition(position + offset);
	                return false;
	            }
	        }
	        return true;
	    };
	    this.els.node.addEventListener('keypress', this._inputKeyPress);
	
	    this._inputFocus = function (event) {
	        event.preventDefault();
	
	        setTimeout(function () {
	            if (that.els.node.value == "") {
	                that.els.node.value = that.patternString.replace(/[^\-\(\)\[\]\:\.\,\$\%\@\ \/]/g, '_');
	                that.setCursorPosition(0);
	            }
	        }, 0);
	    };
	    this.els.node.addEventListener('focus', this._inputFocus);
	
	    this._inputKeyDown = function (event) {
	        var char = String.fromCharCode(event.keyCode);
	        var value = that.els.node.value;
	        var position = that.getCursorPosition();
	
	        if (event.keyCode == 8 || event.keyCode == 46) {
	            event.preventDefault();
	            var offset = 0;
	            for (var i = position - 1; i > 0; i--) {
	                if (that.formatCharacters.indexOf(value[i]) !== -1) {
	                    offset--;
	                } else {
	                    break;
	                }
	            }
	
	            var futureValue = value.substring(0, position + offset - 1) + '_' + value.substring(position + offset, value.length);
	
	            if (!futureValue.match(that.patternWithEmpty)) {
	                return false;
	            } else {
	                console.log(futureValue);
	                that.els.node.value = futureValue;
	                that.setCursorPosition(position + offset - 1);
	                return false;
	            }
	        } else if (char.match(/\W/)) {
	            return false;
	        }
	
	        return true;
	    };
	    this.els.node.addEventListener('keydown', this._inputKeyDown);
	
	    this._inputBlur = function (event) {
	        if (!that.els.node.value.match(that.pattern)) {
	            that.els.node.value = '';
	        }
	    };
	    this.els.node.addEventListener('blur', this._inputBlur);
	};
	
	Input.prototype.getCursorPosition = function () {
	    var position = 0;
	
	    if (document.selection) {
	        this.els.node.focus();
	
	        var selectRange = document.selection.createRange();
	
	        selectRange.moveStart("character", -this.els.node.value.length);
	
	        position = selectRange.text.length;
	    } else if (this.els.node.selectionStart || this.els.node.selectionStart === "0") {
	        position = this.els.node.selectionStart;
	    }
	
	    return position;
	};
	
	Input.prototype.setCursorPosition = function (position) {
	    if (this.els.node.createTextRange) {
	        var range = this.els.node.createTextRange();
	        range.move('character', position);
	        range.select();
	    } else {
	        if (this.els.node.selectionStart) {
	            this.els.node.focus();
	            this.els.node.selectionStart = this.els.node.selectionEnd = position;
	        } else {
	            this.els.node.focus();
	        }
	    }
	};
	
	Input.prototype.setupPattern = function () {
	    this.formatCharacters = this.els.node.getAttribute('data-format-characters') || "-()[]:.,$%@ /";
	    this.patternString = this.options.pattern;
	    this.els.node.placeholder = this.patternString;
	
	    var _initPattern = function () {
	        var formattedPatternStr = "";
	        var formattedPatternWithEmptyStr = "";
	
	        for (var i = 0; i < this.patternString.length; i++) {
	            var char = this.patternString[i];
	
	            if (this.formatCharacters.indexOf(char) >= 0) {
	                formattedPatternStr += char;
	                formattedPatternWithEmptyStr += char;
	            } else if (char.match(/[0-9]/)) {
	                formattedPatternStr += "[0-9]";
	                formattedPatternWithEmptyStr += "([0-9]|_)";
	            } else if (char.match(/[a-zA-Z]/)) {
	                formattedPatternStr += "[a-zA-Z]";
	                formattedPatternWithEmptyStr += "([a-zA-Z]|_)";
	            } else if (char === "*") {
	                formattedPatternStr += "[0-9a-zA-Z]";
	                formattedPatternWithEmptyStr += "([0-9a-zA-Z]|_)";
	            }
	        }
	
	        this.pattern = new RegExp("^" + formattedPatternStr + "$", 'g');
	        this.patternWithEmpty = new RegExp("^" + formattedPatternWithEmptyStr + "$", 'g');
	    }.bind(this);
	
	    _initPattern();
	};
	
	/**
	 * Adds static events listeners.
	 */
	Input.prototype.addPrefixEventListeners = function () {
	    var that = this;
	
	    this._inputKeyup = function () {
	
	        var oldValue = this.getAttribute('data-prefix');
	
	        if (that.els.node.value.indexOf(oldValue) !== 0) {
	            that.els.node.value = oldValue + ' ';
	        }
	    };
	    if (this.els.node) {
	        this.els.node.addEventListener('keyup', this._inputKeyup);
	    }
	};
	
	Input.prototype.removePatternEventListeners = function () {
	    if (this.els.node) {
	        this.els.node.addEventListener('keypress', this._inputKeyPress);
	        this.els.node.addEventListener('focus', this._inputFocus);
	        this.els.node.addEventListener('keydown', this._inputKeyDown);
	        this.els.node.addEventListener('blur', this._inputBlur);
	    }
	};
	
	Input.prototype.removePrefixEventListeners = function () {
	    if (this.els.node) {
	        this.els.node.removeEventListener('keyup', this._inputKeyup);
	    }
	};
	
	Input.prototype.die = function () {
	    if (this.options.pattern) {
	        this.removePatternEventListeners();
	    } else if (this.options.prefix) {
	        this.removePrefixEventListeners();
	    }
	    delete this;
	};
	
	Input.prototype.setPrefix = function () {
	    this.els.node.value = this.options.prefix + " " + this.els.node.value;
	};
	
	exports.default = Input;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=sf.input.js.map