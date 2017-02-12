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
	
	var _Form = __webpack_require__(2);
	
	var _Form2 = _interopRequireDefault(_Form);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_sf2.default.registerInstanceType(_Form2.default, "js-sf-form"); //resolved in webpack's "externals"
	
	module.exports = _Form2.default; // ES6 default export will not expose us as global

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _assign = __webpack_require__(3);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;
	
	var _sf = __webpack_require__(1);
	
	var _sf2 = _interopRequireDefault(_sf);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	//resolved in webpack's "externals"
	
	var formMessages = __webpack_require__(18);
	var iterateInputs = __webpack_require__(23);
	__webpack_require__(24);
	
	/**
	 * Spiral Forms
	 * @param {Object} sf
	 * @param {Object} node  DomNode of form
	 * @param {Object} [options] all options to override default
	 * @constructor Form
	 * @extends BaseDOMConstructor
	 */
	var Form = function Form(sf, node, options) {
	    this._construct(sf, node, options);
	};
	
	/**
	 * @lends sf.Form.prototype
	 */
	Form.prototype = _sf2.default.createModulePrototype();
	
	/**
	 * Name to register
	 * @type {string}
	 */
	Form.prototype.name = "form";
	
	/**
	 * Function that call on new instance is created.
	 * @param {Object} sf
	 * @param {Object} node  DomNode of form
	 * @param {Object} [options] all options to override default
	 * @private
	 */
	Form.prototype._construct = function (sf, node, options) {
	    this.init(sf, node, options); //call parent
	    this.mixMessagesOptions();
	    //this.options.fillFrom && this.fillFieldsFrom();//id required to fill form
	
	    /**
	     * @extends DOMEvents
	     * @type {DOMEvents}
	     * @inheritDoc
	     * */
	    this.DOMEvents = new this.sf.modules.helpers.DOMEvents();
	    this.addEvents();
	
	    this.events = new this.sf.modules.core.Events(["beforeSend", "success", "error", "always"]);
	    sf.iterateInputs = iterateInputs;
	};
	
	/**
	 * @override
	 * @inheritDoc
	 * @enum {Object}
	 * @deprecated
	 */
	Form.prototype.optionsToGrab = {
	    /**
	     * Link to form
	     */
	    context: {
	        processor: function processor(node, val) {
	            //processor
	            return node;
	        }
	    },
	    /**
	     * Link to 'this'
	     */
	    self: {
	        processor: function processor(node, val) {
	            return this;
	        }
	    },
	    /**
	     * URL to send form (if ajax form) <b>Default: "/"</b>
	     */
	    url: {
	        domAttr: "action",
	        value: "/"
	    },
	    /**
	     * Method to send to send form (if ajax form) <b>Default: "POST"</b>
	     */
	    method: {
	        domAttr: "method",
	        value: "POST"
	    },
	    /**
	     * Lock type when form sending <b>Default: "default"</b> @see sf.lock
	     */
	    lockType: {
	        value: "default",
	        domAttr: "data-lockType"
	    },
	    /**
	     *
	     */
	    "messagesType": {
	        value: "spiral",
	        domAttr: "data-messagesType"
	    },
	    /**
	     * Pass custom template for form messages
	     */
	    messages: {
	        value: "",
	        domAttr: "data-messages",
	        processor: function processor(node, val, self) {
	            if (!val) return this.value;
	            if (typeof val == "string") {
	                try {
	                    val = JSON.parse(val);
	                } catch (e) {
	                    console.error("Form JSON.parse error: ", e);
	                }
	            }
	            return (0, _assign2.default)(self.value, val);
	        }
	    },
	    /**
	     * Use ajax to submit form <b>Default: true</b>
	     */
	    useAjax: { // attribute of form
	        value: true, //default value
	        domAttr: "data-useAjax",
	        processor: function processor(node, val) {
	            // processor to process data before return
	            if (typeof val === "boolean") {
	                return val;
	            }
	            val = val !== void 0 && val !== null ? val.toLowerCase() : '';
	            if (val === 'false') {
	                val = false;
	            } else if (val === 'true') {
	                val = true;
	            }
	            return val;
	        }
	    },
	    /**
	     * Callback after form submitting <b>Default: false</b>
	     * <br/>
	     * <b> Example </b>
	     * function(options){
	     *  //options contains all options after send
	     * }
	     */
	    ajaxCallback: { // attribute of form
	        value: false, //default value
	        domAttr: "data-callback"
	    },
	    beforeSubmitCallback: { // attribute of form
	        value: false, //default value
	        domAttr: "data-before-submit"
	    },
	    afterSubmitCallback: { // attribute of form
	        value: false, //default value
	        domAttr: "data-after-submit"
	    },
	    headers: { // attribute of form
	        value: { "Accept": "application/json" }, //default value
	        domAttr: "data-headers",
	        processor: function processor(node, val, self) {
	            if (val === void 0 || val == null) return this.value;
	            if (typeof val == "string") {
	                try {
	                    val = JSON.parse(val);
	                } catch (e) {
	                    console.error("Form JSON.parse error: ", e);
	                }
	            }
	            return (0, _assign2.default)(self.value, val);
	        }
	    }
	};
	
	Form.prototype.mixMessagesOptions = function () {
	    var global = this.sf.options.instances.form;
	    this.options.messages = (0, _assign2.default)({}, formMessages.defaults, global && global.messages && global.messages[this.options.messagesType], this.options.messages);
	};
	
	/**
	 * Call on form submit
	 * @param {Event} e submit event
	 */
	Form.prototype.onSubmit = function (e) {
	    if (this.sf.getInstance('lock', this.node)) {
	        //on lock we should'n do any actions
	        e.preventDefault();
	        e.stopPropagation();
	        return;
	    }
	
	    this.removeMessages();
	
	    this.options.data = this.getFormData();
	
	    // We can send files only with FormData
	    // If form contain files and no FormData than disable ajax
	    if (!window.FormData && this.options.context.querySelectorAll("input[type='file']").length !== 0) {
	        this.options.useAjax = false;
	    }
	    this.events.trigger("beforeSend", this.options);
	    //sf.events.performAction("beforeSubmit", this.options);
	    //this.events.performAction("beforeSubmit", this.options);
	
	    if (this.options.useAjax) {
	
	        this.send(this.options);
	
	        e.preventDefault();
	        e.stopPropagation();
	    }
	};
	
	/**
	 * Locker. Add or remove.
	 * @param {Boolean} [remove]
	 */
	Form.prototype.lock = function (remove) {
	    if (!this.options.lockType || this.options.lockType === 'none') {
	        return;
	    }
	    if (remove) {
	        if (!this.sf.removeInstance("lock", this.node)) {
	            console.warn("You try to remove 'lock' instance, but it is not available or not started");
	        }
	    } else {
	        if (!this.sf.addInstance("lock", this.node, { type: this.options.lockType })) {
	            console.warn("You try to add 'lock' instance, but it is not available or already started");
	        }
	    }
	};
	
	//Form messages
	Form.prototype.showFormMessage = formMessages.showFormMessage;
	Form.prototype.showFieldMessage = formMessages.showFieldMessage;
	Form.prototype.showFieldsMessages = formMessages.showFieldsMessages;
	Form.prototype.showMessages = formMessages.showMessages;
	Form.prototype.removeMessages = formMessages.removeMessages;
	Form.prototype.removeMessage = formMessages.removeMessage;
	
	Form.prototype.processAnswer = function (answer) {
	    this.options.messagesType && this.showMessages(answer);
	};
	
	/**
	 * Send form to server
	 * @param sendOptions
	 */
	Form.prototype.send = function (sendOptions) {
	    var that = this;
	    this.lock();
	    if (sendOptions.beforeSubmitCallback) {
	        var fn = eval(sendOptions.beforeSubmitCallback);
	        if (typeof fn === "function") {
	            fn.call(sendOptions);
	        }
	    }
	    this.sf.ajax.send(sendOptions).then(function (answer) {
	        that.events.trigger("success", sendOptions);
	        return answer;
	    }, function (error) {
	        that.events.trigger("error", sendOptions);
	        return error;
	    }).then(function (answer) {
	        that.lock(true);
	        that.processAnswer(answer);
	        that.events.trigger("always", sendOptions);
	    });
	};
	
	/**
	 * Serialize form
	 */
	Form.prototype.getFormData = function () {
	    if (!!window.FormData) {
	        return new FormData(this.options.context);
	    } else {
	        console.log("Form `" + this.options.context + "` were processed without FormData.");
	        return new formToObject(this.options.context);
	    }
	};
	
	/**
	 * Set options (overwrite current)
	 * @param {Object} opt options
	 */
	Form.prototype.setOptions = function (opt) {
	    this.options = (0, _assign2.default)(this.options, opt);
	};
	
	/**
	 * Add all events for forms
	 */
	Form.prototype.addEvents = function () {
	    var that = this;
	    this.DOMEvents.add([{
	        DOMNode: this.options.context,
	        eventType: "submit",
	        eventFunction: function eventFunction(e) {
	            that.onSubmit.call(that, e);
	        }
	    }]);
	};
	
	/**
	 * Clear all variables and die
	 */
	Form.prototype.die = function () {
	    this.DOMEvents.removeAll();
	    //todo don't we need to remove it's addons and plugins?
	};
	
	exports.default = Form;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(4), __esModule: true };

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(5);
	module.exports = __webpack_require__(8).Object.assign;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(6);
	
	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(11)});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(7)
	  , core      = __webpack_require__(8)
	  , ctx       = __webpack_require__(9)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$export.F = 1;  // forced
	$export.G = 2;  // global
	$export.S = 4;  // static
	$export.P = 8;  // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ },
/* 7 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 8 */
/***/ function(module, exports) {

	var core = module.exports = {version: '1.2.6'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(10);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.1 Object.assign(target, source, ...)
	var $        = __webpack_require__(12)
	  , toObject = __webpack_require__(13)
	  , IObject  = __webpack_require__(15);
	
	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = __webpack_require__(17)(function(){
	  var a = Object.assign
	    , A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , $$    = arguments
	    , $$len = $$.length
	    , index = 1
	    , getKeys    = $.getKeys
	    , getSymbols = $.getSymbols
	    , isEnum     = $.isEnum;
	  while($$len > index){
	    var S      = IObject($$[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  }
	  return T;
	} : Object.assign;

/***/ },
/* 12 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(14);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(16);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _keys = __webpack_require__(19);
	
	var _keys2 = _interopRequireDefault(_keys);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var defaults = {
	    template: '<div class="alert form-msg ${type}"><button class="btn-close">×</button><p class="msg">${text}</p></div>',
	    close: '.btn-close',
	    place: 'bottom',
	    levels: {
	        success: "success", info: "info", warning: "warning", error: "error"
	    },
	    field: '.item-form',
	    fieldTemplate: '<div class="alert form-msg ${type}"><p class="msg">${text}</p></div>',
	    fieldClose: '.btn-close',
	    fieldPlace: 'bottom',
	    fieldPrefix: '' //for bootstrap: class="has-danger"
	};
	
	//often used alias
	defaults.levels.message = defaults.levels.success;
	
	//other aliases
	//PSR-3 severity levels mapping (debug, info, notice, warning, error, critical, alert, emergency)
	//https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-3-logger-interface.md
	defaults.levels.debug = defaults.levels.success;
	defaults.levels.info = defaults.levels.notice = defaults.levels.info;
	defaults.levels.danger = defaults.levels.critical = defaults.levels.alert = defaults.levels.emergency = defaults.levels.error;
	
	function prepareMessageObject(message, type) {
	    if (Object.prototype.toString.call(message) !== "[object Object]") {
	        message = { text: message, type: type };
	    }
	    message.text = message.text || message.message || message;
	    message.type = message.type || type;
	    return message;
	}
	
	module.exports = {
	    defaults: defaults,
	    showMessages: function showMessages(answer) {
	        if (!answer) return;
	        var isMsg = false,
	            that = this;
	
	        for (var type in this.options.messages.levels) {
	            if (answer[type]) {
	                this.showFormMessage(answer[type], this.options.messages.levels[type]);
	                isMsg = true;
	            }
	        }
	
	        if (answer.messages) {
	            this.showFieldsMessages(answer.messages, "success");
	            isMsg = true;
	        }
	        if (answer.errors) {
	            this.showFieldsMessages(answer.errors, "error");
	            isMsg = true;
	        }
	        if (answer.warnings) {
	            this.showFieldsMessages(answer.warnings, "warning");
	            isMsg = true;
	        }
	
	        if (!isMsg && answer.status > 300) {
	            var error = answer.status ? answer.status + " " : "";
	            error += answer.statusText ? answer.statusText : "";
	            error += answer.data && !answer.statusText ? answer.data : "";
	            error += error.length === 0 ? answer : "";
	            this.showFormMessage(error, "error");
	        }
	
	        this._messages.forEach(function (m) {
	            if (m.close) {
	                m.closeHandler = that.removeMessage.bind(that, m);
	                m.close.addEventListener("click", m.closeHandler);
	            }
	        });
	    },
	    removeMessage: function removeMessage(m, e) {
	        m.close && m.close.removeEventListener("click", m.closeHandler);
	        m.el.parentNode.removeChild(m.el);
	        m.field && m.field.classList.remove(this.options.messages.fieldPrefix + m.type);
	        if (e) {
	            e.preventDefault && e.preventDefault();
	            this._messages.splice(this._messages.indexOf(m), 1);
	        }
	    },
	    removeMessages: function removeMessages() {
	        var that = this;
	        if (this._messages) {
	            this._messages.forEach(function (m) {
	                that.removeMessage(m, false);
	            });
	        }
	        that._messages = [];
	    },
	    showFormMessage: function showFormMessage(message, type) {
	        message = prepareMessageObject(message, type);
	
	        var msgEl,
	            parent,
	            tpl = this.options.messages.template,
	            parser = new DOMParser();
	
	        for (var item in message) {
	            if (!message.hasOwnProperty(item)) return;
	            tpl = tpl.replace('${' + item + '}', message[item]);
	        }
	
	        msgEl = parser.parseFromString(tpl, "text/html").firstChild.lastChild.firstChild;
	
	        if (this.options.messages.place === "bottom") {
	            this.node.appendChild(msgEl);
	        } else if (this.options.messages.place === "top") {
	            this.node.insertBefore(msgEl, this.node.firstChild);
	        } else {
	            parent = document.querySelector(this.options.messages.place);
	            parent.appendChild(msgEl);
	        }
	        this._messages.push({ el: msgEl, close: msgEl.querySelector(this.options.messages.close) });
	    },
	    /**
	     * @param {HTMLElement} el
	     * @param {String} message
	     * @param {String} type
	     * @param {Boolean} [isContainer]
	     */
	    showFieldMessage: function showFieldMessage(el, message, type, isContainer) {
	        var field = isContainer ? el : sf.helpers.domTools.closest(el, this.options.messages.field),
	            msgEl,
	            tpl = this.options.messages.fieldTemplate;
	        if (!field) return;
	        var parser = new DOMParser();
	        message = prepareMessageObject(message, type);
	
	        field.classList.add(this.options.messages.fieldPrefix + type);
	
	        for (var item in message) {
	            if (!message.hasOwnProperty(item)) return;
	            tpl = tpl.replace('${' + item + '}', message[item]);
	        }
	
	        msgEl = parser.parseFromString(tpl, "text/html").firstChild.lastChild.firstChild;
	
	        if (this.options.messages.fieldPlace === "bottom") {
	            field.appendChild(msgEl);
	        } else if (this.options.messages.fieldPlace === "top") {
	            field.insertBefore(msgEl, field.firstChild);
	        } else {
	            field = field.querySelector(this.options.messages.fieldPlace);
	            field.appendChild(msgEl);
	        }
	
	        this._messages.push({
	            el: msgEl,
	            close: msgEl.querySelector(this.options.messages.fieldClose),
	            field: field,
	            type: type
	        });
	    },
	    showFieldsMessages: function showFieldsMessages(messages, type) {
	        var that = this,
	            notFound = sf.iterateInputs(this.node, messages, function (el, message) {
	            that.showFieldMessage(el, message, type);
	        });
	
	        notFound.forEach(function (msgObj) {
	            (0, _keys2.default)(msgObj).forEach(function (name) {
	                var container = that.node.querySelector('[data-message-placeholder="' + name + '"]');
	                if (container) {
	                    //todo check container.dataset.messageVariant? variants are "field" and "form"
	                    that.showFieldMessage(container, msgObj[name], type, true);
	                }
	            });
	        });
	    }
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(20), __esModule: true };

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(21);
	module.exports = __webpack_require__(8).Object.keys;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(13);
	
	__webpack_require__(22)('keys', function($keys){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(6)
	  , core    = __webpack_require__(8)
	  , fails   = __webpack_require__(17);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	"use strict";
	//plugin in formMessages to iterate form inputs
	
	//todo comment all of this
	//todo ask @Systerr the reason of variable 'prefix'
	
	var notFound = [];
	
	/**
	 *
	 * @param {HTMLElement} context
	 * @param {Object} names
	 * @param {Function} callback
	 * @param {String} [prefix]
	 */
	function findNodes(context, names, callback, prefix) {
	    for (var name in names) {
	        if (!names.hasOwnProperty(name)) {
	            continue;
	        }
	
	        var partOfSelector = prefix ? prefix + "[" + name + "]" : name,
	            type = Object.prototype.toString.call(names[name]),
	            selector = "[name='" + partOfSelector + "']";
	        switch (type) {
	            case '[object Object]':
	                findNodes(context, names[name], callback, partOfSelector); //call recursive
	                break;
	            case '[object Array]':
	                names[name].forEach(function (el) {
	                    "use strict";
	                    //TODO refactor this should call recursive
	
	                    var sel = "[name='" + partOfSelector + "[]']" + "[value='" + el + "']";
	                    var nodes = context.querySelectorAll(sel);
	                    if (nodes.length === 0) {
	                        notFound.push(sel);
	                    }
	                    for (var i = 0, max = nodes.length; i < max; i++) {
	                        callback(nodes[i], true);
	                    }
	                });
	                break;
	            case '[object String]':
	            case '[object Number]':
	                var nodes = context.querySelectorAll(selector);
	                if (nodes.length === 0) {
	                    var obj = {};
	                    obj[partOfSelector] = names[name];
	                    notFound.push(obj);
	                }
	                for (var i = 0, max = nodes.length; i < max; i++) {
	                    callback(nodes[i], names[name]);
	                }
	                break;
	
	            default:
	                console.error("unknown type -", type, " and message", names[name]);
	        }
	    }
	}
	
	/**
	 * @param {HTMLElement} context
	 * @param {Object} names
	 * @param {Function} callback
	 * @param {String} [prefix]
	 */
	var iterateInputs = function iterateInputs(context, names, callback, prefix) {
	    notFound = [];
	    findNodes(context, names, callback, prefix);
	    if (notFound.length !== 0) {
	        console.log("Some element not found in form", notFound);
	    }
	    return notFound;
	};
	
	module.exports = iterateInputs;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _typeof2 = __webpack_require__(25);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/*! github.com/serbanghita/formToObject.js 1.0.1  (c) 2013 Serban Ghita <serbanghita@gmail.com> @licence MIT */
	
	(function () {
	
		// Constructor.
		var formToObject = function formToObject(formRef) {
	
			if (!formRef) {
				return false;
			}
	
			this.formRef = formRef;
			this.keyRegex = /[^\[\]]+/g;
			this.$form = null;
			this.$formElements = [];
			this.formObj = {};
	
			if (!this.setForm()) {
				return false;
			}
			if (!this.setFormElements()) {
				return false;
			}
	
			return this.setFormObj();
		};
	
		// Set the main form object we are working on.
		formToObject.prototype.setForm = function () {
	
			switch ((0, _typeof3.default)(this.formRef)) {
	
				case 'string':
					this.$form = document.getElementById(this.formRef);
					break;
	
				case 'object':
					if (this.isDomNode(this.formRef)) {
						this.$form = this.formRef;
					}
					break;
	
			}
	
			return this.$form;
		};
	
		// Set the elements we need to parse.
		formToObject.prototype.setFormElements = function () {
			this.$formElements = this.$form.querySelectorAll('input, textarea, select');
			return this.$formElements.length;
		};
	
		// Check to see if the object is a HTML node.
		formToObject.prototype.isDomNode = function (node) {
			return (typeof node === 'undefined' ? 'undefined' : (0, _typeof3.default)(node)) === "object" && "nodeType" in node && node.nodeType === 1;
		};
	
		// Iteration through arrays and objects. Compatible with IE.
		formToObject.prototype.forEach = function (arr, callback) {
	
			if ([].forEach) {
				return [].forEach.call(arr, callback);
			}
	
			var i;
			for (i in arr) {
				// Object.prototype.hasOwnProperty instead of arr.hasOwnProperty for IE8 compatibility.
				if (Object.prototype.hasOwnProperty.call(arr, i)) {
					callback.call(arr, arr[i]);
				}
			}
	
			return;
		};
	
		// Recursive method that adds keys and values of the corresponding fields.
		formToObject.prototype.addChild = function (result, domNode, keys, value) {
	
			// #1 - Single dimensional array.
			if (keys.length === 1) {
	
				// We're only interested in the radio that is checked.
				if (domNode.nodeName === 'INPUT' && domNode.type === 'radio') {
					if (domNode.checked) {
						return result[keys] = value;
					} else {
						return;
					}
				}
	
				// Checkboxes are a special case. We have to grab each checked values
				// and put them into an array.
				if (domNode.nodeName === 'INPUT' && domNode.type === 'checkbox') {
	
					if (domNode.checked) {
	
						if (!result[keys]) {
							result[keys] = [];
						}
						return result[keys].push(value);
					} else {
						return;
					}
				}
	
				// Multiple select is a special case.
				// We have to grab each selected option and put them into an array.
				if (domNode.nodeName === 'SELECT' && domNode.type === 'select-multiple') {
	
					result[keys] = [];
					var DOMchilds = domNode.querySelectorAll('option[selected]');
					if (DOMchilds) {
						this.forEach(DOMchilds, function (child) {
							result[keys].push(child.value);
						});
					}
					return;
				}
	
				// Fallback. The default one to one assign.
				result[keys] = value;
			}
	
			// #2 - Multi dimensional array.
			if (keys.length > 1) {
	
				if (!result[keys[0]]) {
					result[keys[0]] = {};
				}
	
				return this.addChild(result[keys[0]], domNode, keys.splice(1, keys.length), value);
			}
	
			return result;
		};
	
		formToObject.prototype.setFormObj = function () {
	
			var test,
			    i = 0;
	
			for (i = 0; i < this.$formElements.length; i++) {
				// Ignore the element if the 'name' attribute is empty.
				// Ignore the 'disabled' elements.
				if (this.$formElements[i].name && !this.$formElements[i].disabled) {
					test = this.$formElements[i].name.match(this.keyRegex);
					this.addChild(this.formObj, this.$formElements[i], test, this.$formElements[i].value);
				}
			}
	
			return this.formObj;
		};
	
		// AMD/requirejs: Define the module
		if (true) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return formToObject;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		}
		// Browser: Expose to window
		else {
				window.formToObject = formToObject;
			}
	})();

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Symbol = __webpack_require__(26)["default"];
	
	exports["default"] = function (obj) {
	  return obj && obj.constructor === _Symbol ? "symbol" : typeof obj;
	};
	
	exports.__esModule = true;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(27), __esModule: true };

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(28);
	__webpack_require__(46);
	module.exports = __webpack_require__(8).Symbol;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var $              = __webpack_require__(12)
	  , global         = __webpack_require__(7)
	  , has            = __webpack_require__(29)
	  , DESCRIPTORS    = __webpack_require__(30)
	  , $export        = __webpack_require__(6)
	  , redefine       = __webpack_require__(31)
	  , $fails         = __webpack_require__(17)
	  , shared         = __webpack_require__(34)
	  , setToStringTag = __webpack_require__(35)
	  , uid            = __webpack_require__(37)
	  , wks            = __webpack_require__(36)
	  , keyOf          = __webpack_require__(38)
	  , $names         = __webpack_require__(40)
	  , enumKeys       = __webpack_require__(41)
	  , isArray        = __webpack_require__(42)
	  , anObject       = __webpack_require__(43)
	  , toIObject      = __webpack_require__(39)
	  , createDesc     = __webpack_require__(33)
	  , getDesc        = $.getDesc
	  , setDesc        = $.setDesc
	  , _create        = $.create
	  , getNames       = $names.get
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , setter         = false
	  , HIDDEN         = wks('_hidden')
	  , isEnum         = $.isEnum
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , useNative      = typeof $Symbol == 'function'
	  , ObjectProto    = Object.prototype;
	
	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(setDesc({}, 'a', {
	    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = getDesc(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  setDesc(it, key, D);
	  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
	} : setDesc;
	
	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol.prototype);
	  sym._k = tag;
	  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
	    configurable: true,
	    set: function(value){
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    }
	  });
	  return sym;
	};
	
	var isSymbol = function(it){
	  return typeof it == 'symbol';
	};
	
	var $defineProperty = function defineProperty(it, key, D){
	  if(D && has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return setDesc(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key);
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
	    ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  var D = getDesc(it = toIObject(it), key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = getNames(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
	  return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var names  = getNames(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
	  return result;
	};
	var $stringify = function stringify(it){
	  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	  var args = [it]
	    , i    = 1
	    , $$   = arguments
	    , replacer, $replacer;
	  while($$.length > i)args.push($$[i++]);
	  replacer = args[1];
	  if(typeof replacer == 'function')$replacer = replacer;
	  if($replacer || !isArray(replacer))replacer = function(key, value){
	    if($replacer)value = $replacer.call(this, key, value);
	    if(!isSymbol(value))return value;
	  };
	  args[1] = replacer;
	  return _stringify.apply($JSON, args);
	};
	var buggyJSON = $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	});
	
	// 19.4.1.1 Symbol([description])
	if(!useNative){
	  $Symbol = function Symbol(){
	    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
	    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
	  };
	  redefine($Symbol.prototype, 'toString', function toString(){
	    return this._k;
	  });
	
	  isSymbol = function(it){
	    return it instanceof $Symbol;
	  };
	
	  $.create     = $create;
	  $.isEnum     = $propertyIsEnumerable;
	  $.getDesc    = $getOwnPropertyDescriptor;
	  $.setDesc    = $defineProperty;
	  $.setDescs   = $defineProperties;
	  $.getNames   = $names.get = $getOwnPropertyNames;
	  $.getSymbols = $getOwnPropertySymbols;
	
	  if(DESCRIPTORS && !__webpack_require__(45)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	}
	
	var symbolStatics = {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    return keyOf(SymbolRegistry, key);
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	};
	// 19.4.2.2 Symbol.hasInstance
	// 19.4.2.3 Symbol.isConcatSpreadable
	// 19.4.2.4 Symbol.iterator
	// 19.4.2.6 Symbol.match
	// 19.4.2.8 Symbol.replace
	// 19.4.2.9 Symbol.search
	// 19.4.2.10 Symbol.species
	// 19.4.2.11 Symbol.split
	// 19.4.2.12 Symbol.toPrimitive
	// 19.4.2.13 Symbol.toStringTag
	// 19.4.2.14 Symbol.unscopables
	$.each.call((
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
	  'species,split,toPrimitive,toStringTag,unscopables'
	).split(','), function(it){
	  var sym = wks(it);
	  symbolStatics[it] = useNative ? sym : wrap(sym);
	});
	
	setter = true;
	
	$export($export.G + $export.W, {Symbol: $Symbol});
	
	$export($export.S, 'Symbol', symbolStatics);
	
	$export($export.S + $export.F * !useNative, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});
	
	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});
	
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 29 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(17)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(32);

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(12)
	  , createDesc = __webpack_require__(33);
	module.exports = __webpack_require__(30) ? function(object, key, value){
	  return $.setDesc(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(7)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(12).setDesc
	  , has = __webpack_require__(29)
	  , TAG = __webpack_require__(36)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var store  = __webpack_require__(34)('wks')
	  , uid    = __webpack_require__(37)
	  , Symbol = __webpack_require__(7).Symbol;
	module.exports = function(name){
	  return store[name] || (store[name] =
	    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var $         = __webpack_require__(12)
	  , toIObject = __webpack_require__(39);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = $.getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(15)
	  , defined = __webpack_require__(14);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(39)
	  , getNames  = __webpack_require__(12).getNames
	  , toString  = {}.toString;
	
	var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];
	
	var getWindowNames = function(it){
	  try {
	    return getNames(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};
	
	module.exports.get = function getOwnPropertyNames(it){
	  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
	  return getNames(toIObject(it));
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var $ = __webpack_require__(12);
	module.exports = function(it){
	  var keys       = $.getKeys(it)
	    , getSymbols = $.getSymbols;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = $.isEnum
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
	  }
	  return keys;
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(16);
	module.exports = Array.isArray || function(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(44);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 45 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 46 */
/***/ function(module, exports) {



/***/ }
/******/ ])
});
;
//# sourceMappingURL=sf.form.js.map