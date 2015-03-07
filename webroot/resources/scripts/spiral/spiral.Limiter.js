"use strict";
/**
 * This a constructor (class) text counter/limiter in text area or input
 * @param {Object} node dom node
 * @param {Object} options all options to override default
 * @constructor
 * @extends spiral.BaseDOMConstructor
 */
spiral.Limiter = function (node, options) {
    this.init(node);//call parent

    if (options) {//if we pass options extend all options by passed options
        this.options = spiral.tools.extend(this.options, options);
    }

    this.options.limiter = JSON.parse(this.options.limiter);
    this.options.limiter.limit = parseInt(this.options.limiter.limit, 10);

    this.els = {
        node: node
    };

    this.els.limit = document.createElement('div');
    this.els.limit.className = "limit";
    this.els.node.parentNode.style.position = "relative";
    this.els.node.parentNode.appendChild(this.els.limit);

    if (this.options.limiter.style) {
        var style = {
            position: "absolute",
            top: -this.els.limit.clientHeight + "px",
            right: "2px",
            fontSize: "10px"
        };
        this.options.limiter.style = spiral.tools.extend(style, this.options.limiter.style);
        for (var s in this.options.limiter.style) {
            this.els.limit.style[s] = this.options.limiter.style[s];
        }
    }

    if (!RegExp.quote) {
        RegExp.quote = function (str) {
            return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        };
    }

    this.limit();
    this.addEventListeners();
};

/**
 *
 * @type {spiral.BaseDOMConstructor.prototype}
 * @lends spiral.Limiter.prototype
 */
spiral.Limiter.prototype = Object.create(spiral.BaseDOMConstructor.prototype);

/**
 * @override
 * @inheritDoc
 * @enum {string}
 */
spiral.Limiter.prototype.attributesToGrab = {
    /**
     *  Limiter <b>Default: {}</b>
     */
    "data-limiter": {
        "value": "{}",
        "key": "limiter"
    }
};

/**
 * Adds events listeners.
 */
spiral.Limiter.prototype.addEventListeners = function () {
    var that = this;
    function limit () {
        that.limit();
    }
    this.els.node.addEventListener("change", limit);
    this.els.node.addEventListener("keyup", limit);
    this.els.node.addEventListener("input", limit);
};

/**
 *
 */
spiral.Limiter.prototype.limit = function () {
    this.currentLength = this.els.node.value.length;
    this.setLimiter();
};

/**
 *
 */
spiral.Limiter.prototype.formatLimiter = function () {
    if (this.currentLength >= this.options.limiter.limit) {
        var p = this.els.node.selectionStart;
        this.els.node.value = this.els.node.value.substring(0, this.options.limiter.limit);
        this.els.node.setSelectionRange(p, p);
    }

    var text = this.options.limiter.pattern.replace(new RegExp(RegExp.quote("$countup"), "g"), this.currentLength);
    text = text.replace(new RegExp(RegExp.quote("$limit"), "g"), this.options.limiter.limit);
    text = text.replace(new RegExp(RegExp.quote("$countdown"), "g"), this.options.limiter.limit - this.currentLength);

    return text;
};

/**
 *
 */
spiral.Limiter.prototype.setLimiter = function () {
    this.els.limit.innerHTML = this.formatLimiter();
};

spiral.Limiter.prototype.die = function () {
    console.error("TODO DIE");//TODO DIE
};

spiral.instancesController.addInstanceType("limitText", "js-spiral-limiter", spiral.Limiter);