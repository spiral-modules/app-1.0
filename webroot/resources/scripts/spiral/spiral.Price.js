"use strict";
/**
 * This a constructor (class) input with price
 * @param {Object} node dom node
 * @param {Object} options all options to override default
 * @constructor
 * @extends spiral.BaseDOMConstructor
 */
spiral.Price = function (node, options) {
    this.init(node);

    if (options) this.options = spiral.tools.extend(this.options, options);

    this.el = node;

    this.format(true);
    this.addEventListeners();
};

/**
 *
 * @type {spiral.BaseDOMConstructor.prototype}
 * @lends spiral.Price.prototype
 */
spiral.Price.prototype = Object.create(spiral.BaseDOMConstructor.prototype);

/**
 * @override
 * @inheritDoc
 * @enum {string}
 */
spiral.Price.prototype.attributesToGrab = {

};

/**
 * Adds events listeners.
 */
spiral.Price.prototype.addEventListeners = function () {
    this.el.addEventListener("change", this.format.bind(this));
    //this.el.addEventListener("keyup", this.format.bind(this));
    this.el.addEventListener("input", this.format.bind(this));
};

/**
 *
 */
spiral.Price.prototype.format = function () {
    var v = this.el.value;
    var pos = this.el.selectionStart;

    //if point was deleted
    if (this.oldValue && this.oldValue.indexOf(".") > -1 && v.indexOf(".") === -1 && this.oldValue.replace(".", "") === v) {
        v = v.slice(-100,-2) + "." + v.slice(-2);
        this.el.value = v;
        this.oldValue = v;
        this.el.setSelectionRange(pos, pos);
        return;
    }

    var vs = v.split(".");
    if (vs[0] === "") {
        vs[0] = "0";
        pos = 1;
    }
    if (!vs[1]) vs[1] = "00";
    if (vs[1].length === 1) vs[1] = vs[1] + "0";

    vs[0] = vs[0].replace(/\D/g, '');
    vs[1] = vs[1].replace(/\D/g, '');

    //if the integer part starts with zero
    var vs0l = vs[0].length;
    vs[0] = "" + parseInt(vs[0], 10);
    if (vs0l > vs[0].length) pos -= (vs0l - vs[0].length);

    //split to first two numbers
    if (vs[1].length > 2) vs[1] = vs[1].slice(0,2);

    var result = vs[0] + "." + vs[1];

    this.oldValue = result;
    if (result !== v) {
        this.el.value = result;
        this.el.setSelectionRange(pos, pos);
    }
};

spiral.Price.prototype.die = function () {
    console.error("TODO DIE");//TODO DIE
};

spiral.instancesController.addInstanceType("Price", "js-spiral-price", spiral.Price);