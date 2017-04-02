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
	
	var _fileinput = __webpack_require__(2);
	
	var _fileinput2 = _interopRequireDefault(_fileinput);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_sf2.default.instancesController.registerInstanceType(_fileinput2.default, "sf-js-file-input"); //resolved in webpack's "externals"
	
	module.exports = _fileinput2.default; // ES6 default export will not expose us as global

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
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
	
	var FileInput = function FileInput(sf, node, options) {
	    this._construct(sf, node, options);
	};
	
	/**
	 * @lends sf.Form.prototype
	 */
	FileInput.prototype = (0, _create2.default)(_sf2.default.modules.core.BaseDOMConstructor.prototype);
	
	/**
	 * Name to register
	 * @type {string}
	 */
	FileInput.prototype.name = "fileInput";
	
	FileInput.prototype._construct = function (sf, node, options) {
	
	    this.init(sf, node, options); //call parent
	
	    if (options) {
	        //if we pass options extend all options by passed options
	        this.options = sf.tools.extend(this.options, options);
	    }
	
	    //elements
	    this.els = {
	        node: node
	    };
	
	    if (this.options.file) {
	        this.addFileEventListeners();
	    }
	};
	
	/**
	 * @override
	 * @inheritDoc
	 * @enum {string}
	 */
	FileInput.prototype.optionsToGrab = {
	    /**
	     *  File input
	     */
	    "file": {
	        "domAttr": "data-file"
	    }
	};
	
	/**
	 * Adds static events listeners.
	 */
	
	FileInput.prototype.addFileEventListeners = function () {
	    var that = this;
	    this._inputChange = function (e) {
	        var label = that.els.node.nextElementSibling,
	            labelVal = label.innerHTML;
	
	        var fileName = '';
	
	        if (that.els.node.files && that.els.node.files.length > 1) {
	            fileName = (that.els.node.getAttribute('data-multiple-text') || '{count} files selected').replace('{count}', that.els.node.files.length);
	        } else {
	            fileName = e.target.value.split('\\').pop();
	        }
	
	        if (fileName) {
	            label.querySelector('span').innerHTML = fileName;
	        } else {
	            label.innerHTML = labelVal;
	        }
	    };
	
	    this._inputBlur = function () {
	        that.els.node.classList.add('has-focus');
	    };
	
	    this._inputFocus = function () {
	        that.els.node.classList.remove('has-focus');
	    };
	
	    if (this.els.node) {
	        this.els.node.addEventListener('change', this._inputChange);
	        this.els.node.addEventListener('blur', this._inputBlur);
	        this.els.node.addEventListener('foxus', this._inputFocus);
	    }
	};
	
	FileInput.prototype.removeFileEventListeners = function () {
	    if (this.els.node) {
	        this.els.node.removeEventListener('change', this._inputChange);
	        this.els.node.removeEventListener('focus', this._inputFocus);
	        this.els.node.removeEventListener('blur', this._inputBlur);
	    }
	};
	
	FileInput.prototype.die = function () {
	    if (this.options.file) {
	        this.removeFileEventListeners();
	    }
	    delete this;
	};
	
	exports.default = FileInput;

/***/ },
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

/***/ }
/******/ ])
});
;
//# sourceMappingURL=sf.fileinput.js.map