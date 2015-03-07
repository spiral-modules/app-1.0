"use strict";
/**
 * This a constructor (class) for credit card number input
 * Has jQuery in dependence. Due to limit of development time.
 * @param {Object} node dom node
 * @param {Object} options all options to override default
 * @constructor
 * @extends spiral.BaseDOMConstructor
 */
spiral.CardNumber = function (node, options) {
    this.init(node);//call parent

    if (options) {//if we pass options extend all options by passed options
        this.options = spiral.tools.extend(this.options, options);
    }

    //elements
    this.els = {
        node: node,
        input: node.getElementsByClassName("form-control")[0],
        hidden: node.querySelectorAll("input[type='hidden']")[0]
    };
    this.els.$input = $(this.els.input);
    this.els.$hidden = $(this.els.hidden);

    this.addEventListeners();
};

/**
 *
 * @type {spiral.BaseDOMConstructor.prototype}
 * @lends spiral.CardNumber.prototype
 */
spiral.CardNumber.prototype = Object.create(spiral.BaseDOMConstructor.prototype);

/**
 * There are no attributes to grab for cardNumber
 * @override
 * @inheritDoc
 */
spiral.CardNumber.prototype.attributesToGrab = {};

/**
 * There are no options to process for cardNumber
 * @override
 * @inheritDoc
 */
spiral.CardNumber.prototype.optionsToProcess = {};

/**
 * Rules to detect card types
 * @type {{Visa: string[], MasterCard: string[], Amex: string[], Discover: string[], Maestro: string[], Solo: string[], Diners: string[], JCB: string[]}}
 */
spiral.CardNumber.prototype.rules = {
    "Visa": ["4"],
    "MasterCard": ["51", "52", "53", "54", "55"],
    "Amex": ["34", "37"],
    "Discover": ["6011","65"],
    "Maestro": ["5018", "5020", "5038", "6304", "6759", "6761", "6763"],
    "Solo": ["6334", "6767"],
    "Diners": ['300', '301', '302', '303', '304', '305', '36'],
    "JCB": ['3528', '3529', '353', '354', '355', '356', '357', '358']
};
/**
 * Check card type from number by rules
 * @param n
 */
spiral.CardNumber.prototype.checkType = function(n){
    var type = "";
    for (var r in this.rules) {
        if (this.rules.hasOwnProperty(r)) {
            this.rules[r].forEach(function (subrule) {
                if (subrule == n.substring(0, subrule.length)) {
                    type = r;
                }
            });
        }
    }
    return type;
};

/**
 * Adds events listeners.
 */
spiral.CardNumber.prototype.addEventListeners = function () {
    var that = this;
    this.els.$input.on("input", function (e) {
        var start = $(this)[0].selectionStart;
        var v = $(this).val();
        var startNonDigitString = v.substring(0, start).match(/\D/g);
        var startNonDigitLength = (startNonDigitString) ? startNonDigitString.length : 0;
        v = v.replace(/\D/g, '');
        var type = that.checkType(v);
        that.setType(type);

        /* formating input */
        var ar = [];
        if (type == "Amex") {
            ar[0] = v.substring(0, 4);
            if (v.length > 4) ar[1] = v.substring(4, 10);
            if (v.length > 10) ar[2] = v.substring(10, 15);
        } else if (type == "MasterCard" || type == "Visa") {
            ar[0] = v.substring(0, 4);
            if (v.length > 4) ar[1] = v.substring(4, 8);
            if (v.length > 8) ar[2] = v.substring(8, 12);
            if (v.length > 12) ar[3] = v.substring(12, 16);
        } else {
            ar[0] = v.substring(0, 4);
            if (v.length > 4) ar[1] = v.substring(4, 8);
            if (v.length > 8) ar[2] = v.substring(8, 12);
            if (v.length > 12) ar[3] = v.substring(12, 16);
            if (v.length > 16) ar[4] = v.substring(16, 19);
//            ar = v.match(/.{1,4}/g);
        }
        var result = ar ? ar.join(' ') : '';
        var resultToSend = ar ? ar.join('') : '';
        that.els.$hidden.val(resultToSend);
        $(this).val(result);

        /* calculating position where is caret need to be placed */
        var stopNonDigitString = result.substring(0, start).match(/\D/g);
        var stopNonDigitLength = (stopNonDigitString) ? stopNonDigitString.length : 0;
        var position = start + stopNonDigitLength - startNonDigitLength;
        $(this)[0].setSelectionRange(position, position);
    });

    if (this.els.input.form) {
        this.els.input.form.addEventListener("reset", function(){
            that.reset();
        })
    }
};

/**
 * Set data-cardtype for styling
 * @param t Type
 */
spiral.CardNumber.prototype.setType = function (t) {
    this.els.$input.attr('data-cardtype', t);
};

/**
 * Reset cardNumber's type and value.
 */
spiral.CardNumber.prototype.reset = function () {
    this.els.$input.attr('data-cardtype', "");
    this.els.$hidden.val("");
};

spiral.CardNumber.prototype.die = function () {
    console.error("TODO DIE");//TODO DIE
};

spiral.instancesController.addInstanceType("CardNumber", "js-spiral-cardnumber", spiral.CardNumber);