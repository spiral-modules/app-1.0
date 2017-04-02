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
	
	var _Lock = __webpack_require__(2);
	
	var _Lock2 = _interopRequireDefault(_Lock);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_sf2.default.registerInstanceType(_Lock2.default); //resolved in webpack's "externals"
	
	module.exports = _Lock2.default; // ES6 default export will not expose us as global

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;
	
	var _sf = __webpack_require__(1);
	
	var _sf2 = _interopRequireDefault(_sf);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	//resolved in webpack's "externals"
	
	/**
	 * Spiral lock for forms
	 * @constructor Lock
	 */
	
	var Lock = function Lock(sf, node, options) {
	  this._construct(sf, node, options);
	};
	
	/**
	 * @lends Lock.prototype
	 */
	Lock.prototype = _sf2.default.createModulePrototype();
	
	/**
	 * Name of module
	 * @type {string}
	 */
	Lock.prototype.name = "lock";
	
	/**
	 * Function that call on new instance is created.
	 * @param {Object} sf
	 * @param {Object} node  DomNode of form
	 * @param {Object} [options] all options to override default
	 * @private
	 */
	Lock.prototype._construct = function (sf, node, options) {
	  this.init(sf, node, options); //call parent
	  this.add(this.options.type, this.node);
	};
	/**
	 * Add lock
	 * @param {String} [type] type of lock @see sf.lock.types
	 * @param {Object} context context to add lock
	 * @returns {Function|*}
	 */
	Lock.prototype.add = function (type, context) {
	  if (!this.types.hasOwnProperty(type)) {
	    return false;
	  }
	  var node = document.createElement("div");
	  node.className = this.types[type].className || 'js-sf-lock';
	  node.innerHTML = this.types[type].html;
	  context.appendChild(node);
	  context.classList.add("locked");
	  return this.types[type].progress;
	};
	/**
	 * Clear all variables and die
	 */
	Lock.prototype.die = function () {
	  this.remove();
	};
	/**
	 * Remove lock
	 */
	Lock.prototype.remove = function () {
	  this.node.classList.remove("locked");
	  var sfLock = this.node.querySelector(".js-sf-lock"); //todo this.lockNode ?
	  if (sfLock) {
	    this.node.removeChild(sfLock);
	  }
	  return true;
	};
	/**
	 * Object with lock types.
	 * @enum {Object}
	 */
	Lock.prototype.types = {
	  /**
	   * @type {Object}
	   */
	  spinner: {
	    /**
	     * HTML
	     * @inner
	     * @type String
	     */
	    html: '<div class="sf-spinner"></div>'
	  },
	  progress: {
	    /**
	     * HTML
	     * @inner
	     * @type String
	     */
	    html: '<div class="sf-progress"><div class="progress-line"></div></div>',
	    /**
	     * Function to change styles while AJAX progress
	     * @param current
	     * @param total
	     */
	    progress: function progress(current, total) {
	      var progress = this.context.getElementsByClassName("progress-line")[0];
	      progress.style.width = 100 * (current / total) + "%";
	    }
	  }
	};
	
	//we have to have some default locker, let it be spinner
	Lock.prototype.types.default = Lock.prototype.types.spinner;
	
	exports.default = Lock;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=sf.locker.js.map