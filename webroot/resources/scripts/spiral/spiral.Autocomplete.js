"use strict";
/**
 * This a constructor (class) for text input with suggestions.
 * Suggestions can be received from server or from php.
 * @param {Object} node dom node
 * @param {Object} options all options to override default
 * @constructor
 * @extends spiral.BaseDOMConstructor
 */
spiral.Autocomplete = function (node, options) {
    this.init(node);//call parent

    //TODO rewrite similar to tags
    /**
     * @property {string}  query                    - The default query symbols for AJAX.
     * @property {string}  suggestionsClassName     - The default class for suggestions.
     * @property {string}  selectedClassName        - The default class for selected suggestions.
     * @property {number}  deferRequestBy           - The default defer time before AJAX in milliseconds.
     * @property {number}  minChars                 - The default minimum entered chars before sending AJAX.
     */
    var defaults = {
        /*NOT REQUIRED OPTIONS*/
        query: "query",
        suggestionsClassName: 'autocomplete-suggestion',
        selectedClassName: 'autocomplete-selected',
        deferRequestBy: 500,
        /*delimiter: "",*/
        minChars: 1
    };

    this.options = spiral.tools.extend(this.options, defaults);
    if (options) {//if we pass options extend all options by passed options
        this.options = spiral.tools.extend(this.options, options);
    }

    /*INITIAL VARIABLES*/
    /**
     * @default false
     * */
    this.filled = false;
    /**
     * @default ""
     * */
    this.currentValue = "";
    /**
     * @default -1
     * */
    this.selectedIndex = -1;
    /**
     * @default "search"
     * */
    this.addonState = "search";

    this.els = {
        node: node,
        input: node.getElementsByClassName("js-spiral-autocomplete-el")[0],
        suggestions: node.getElementsByClassName("js-spiral-autocomplete-suggestions")[0],
        addon: node.getElementsByClassName("js-spiral-autocomplete-addon")[0],
        singleInput: node.getElementsByClassName("js-spiral-autocomplete-invisible")[0]
    };

    this.els.group = this.els.node.getElementsByClassName("autocomplete-group");
    this.els.group = this.els.group[0];

    if (this.options.URL[this.options.URL.length - 1] === "/") {
        this.options.URL = this.options.URL.substring(0, this.options.URL.length - 1);
    }

    this.options.value = this.els.input.value;
    this.options.key = this.els.singleInput.value;

    if (this.options.key && this.options.value) {
        this.currentValue = this.els.input.value;
        this.readOnly();
        this.changeAddon("remove");
    }

    this.els.singleInput.name = this.options.name;

    if (this.options.availableTags && !this.options.URL)
        this.options.deferRequestBy = 0;

    this.addEventListeners();
};

/**
 *
 * @type {spiral.BaseDOMConstructor.prototype}
 * @lends spiral.Autocomplete.prototype
 */
spiral.Autocomplete.prototype = Object.create(spiral.BaseDOMConstructor.prototype);

/**
 * @override
 * @inheritDoc
 * @enum {string}
 */
spiral.Autocomplete.prototype.attributesToGrab = {
    /**
     * URL to get suggestions form <b>Default: "/"</b>
     */
    "data-url": {
        "value": "/",
        "key": "URL"
    },
    /**
     *  Accept or not values that not present in suggestions <b>Default: "false"</b>
     */
    "data-allowNew": {
        "value": false,
        "key": "allowNew"
    },
    /**
     * Name to send <b>Default: "autocomplete"</b>
     */
    "data-name": {
        "value": "autocomplete",
        "key": "name"
    }
};

/**
 * @override
 * @inheritDoc
 * @enum {Object}
 */
spiral.Autocomplete.prototype.optionsToProcess = {
    /**
     * For Autocomplete (not for Tags) this means available key->values for Autocomplete but given by PHP, not from server.
     */
    "availableTags": {
        "processor": function (node) { //processor
            var JSONNode = node.getElementsByClassName("js-spiral-autocomplete-available-tags")[0];
            if (!JSONNode || !(JSONNode.innerHTML)) {
                return this.value
            }
            var ret_val;
            try {
                ret_val = JSON.parse(JSONNode.innerHTML);
            } catch (e) {
                console.error("Failed to parse JSON -", JSONNode.innerHTML, e);
                ret_val = this.value
            }
            return ret_val;
        }
    }
};

/**
 * Adds events listeners.</br>
 * input - "keydown"</br>
 * input - "change"</br>
 * input - "input"</br>
 * suggestions - "click"</br>
 * addon - "click"</br>
 * input - "focus"</br>
 * document - "click"
 */
spiral.Autocomplete.prototype.addEventListeners = function () {
    var that = this;

    this.els.input.addEventListener("keydown", function (e) {
        that.onKeyPress(e);
    });

    this.els.input.addEventListener("change", function (e) {
        that.onKeyUp(e);
    });

    this.els.input.addEventListener("input", function (e) {
        that.onKeyUp(e);
    });

    this.els.suggestions.addEventListener("click", function (e) {
        var div = (e.target.nodeName === "DIV") ? e.target : e.target.parentNode;
        if (div.getAttribute("data-key")) {
            that.select(div.getAttribute("data-key"));
        }
    });

    this.els.addon.addEventListener("click", function () {
        switch (that.addonState) {
            case "search":
                that.onValueChange();
                break;
            case "remove":
                that.clear();
                break;
            case "plus":
                that.addTag(false, that.els.input.value);
                break;
            case "hand-up":

                break;
            default:
                break;
        }
    });

    if (this.options.availableTags) {
        this.els.input.addEventListener("focus", function () {
            that.onFocus();
        });
    }

    document.addEventListener("click", function (e) {
        if (e.target != that.els.input) {
            that.hide();
        }
    });
};

/**
 * Key codes.
 * @enum {Number}
 */
spiral.Autocomplete.prototype.keys = {
    ESC: 27,
    TAB: 9,
    RETURN: 13,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    BACKSPACE: 8
};


/**
 * Gets key from data-key from element.
 * @param {Number} index Index of current suggestion.
 * @return {String} Key that written in "data-key" attribute
 */
spiral.Autocomplete.prototype.getKeyByIndex = function (index) {
    return this.els.suggestions.children[index].getAttribute("data-key");
};

/**
 * Hides autocomplete suggestions. Changes bootsrap addon.
 */
spiral.Autocomplete.prototype.hide = function () {
    this.els.suggestions.style.visibility = "hidden";
    this.visible = false;
    this.selectedIndex = -1;
    if (this.currentValue != "" && this.currentValue != this.els.input.value) {
        if (this.options.allowNew) {
            this.changeAddon("plus");
        } else {
            this.changeAddon("search");
        }
    }
};

/**
 * Shows autocomplete suggestions. Changes bootsrap addon.
 */
spiral.Autocomplete.prototype.show = function () {
    this.els.suggestions.style.visibility = "visible";
    this.visible = true;
    if (this.options.allowNew) {
        this.changeAddon("plus");
    } else {
        this.changeAddon("hand-up");
    }

};

/**
 * Sets input into readonly state.
 */
spiral.Autocomplete.prototype.readOnly = function () {
    this.hide();
    this.els.input.readOnly = true;
    this.els.group.classList.add("readonly");
};

/**
 * Clears input, suggestions, variables.
 */
spiral.Autocomplete.prototype.clear = function () {
    this.els.input.readOnly = false;
    this.currentValue = "";
    this.els.input.value = "";
    this.els.singleInput.value = "";
    this.suggestions = {};
    this.filled = false;
    this.hide();
    this.changeAddon("search");
    this.els.group.classList.remove("readonly");
};

/**
 * Trim string.
 * @param {String} str String that will be trimmed
 * @return {String} Trimmed string
 */
spiral.Autocomplete.prototype.trim = function (str) {
    return str.trim().replace(/\s+/g, '_')
};

/**
 * Changes bootsrap addon.</br>
 * this.els.addon.firstChild.className = "glyphicon glyphicon-" + type;</br>
 * or</br>
 * this.els.addon.firstChild.className = type;
 * @param {String} type Bootstrap class for glyphicons
 * @param {Boolean} [custom] Allow custom class instead "glyphicon glyphicon-" + type
 * @example
 * this.changeAddon("remove");
 * @example
 * this.changeAddon("glyphicon gif-loading", true);
 */
spiral.Autocomplete.prototype.changeAddon = function (type, custom) {
    if (this.addonState != type) {
        if (custom) {
            this.els.addon.firstChild.className = type;
        } else {
            this.els.addon.firstChild.className = "glyphicon glyphicon-" + type;
        }
        this.addonState = type;
    }
};

/**
 * Change value for visible input and for invisible inputs.
 * @param {String | Boolean} key Key to add to hidden input and than send to server.
 * @param {String} value Value just to show to users.
 */
spiral.Autocomplete.prototype.addTag = function (key, value) {
    if (this.options.allowNew || key !== true) {
        if (this.options.allowNew) {
            this.els.singleInput.value = value;
        } else {
            this.els.singleInput.value = key;
        }
        this.currentValue = value;
        this.readOnly();
        this.els.input.value = this.currentValue;
        this.suggestions = {};
        this.filled = true;
        this.changeAddon("remove");
    }
};

/**
 * Process key up.
 * @param e Event that fires on key up.
 */
spiral.Autocomplete.prototype.onKeyUp = function (e) {
    var that = this;
    if (this.disabled) return;

//    switch (e.which) {
//        case this.keys.UP:
//        case this.keys.DOWN:
//            return;
//    }

    clearTimeout(this.onChangeTimeout);

    if (this.currentValue !== this.els.input.value) {
        this.findBestHint();
        if (this.options.deferRequestBy > 0) {
            if (this.options.allowNew)
                this.changeAddon("plus");
            // Defer lookup in case when value changes very quickly:
            this.onChangeTimeout = setTimeout(function () {
                that.onValueChange();
            }, this.options.deferRequestBy);
        } else {
            this.onValueChange();
        }
    }
};

/**
 * Finding best input.
 * Not implemented.
 * Maybe not need.
 */
spiral.Autocomplete.prototype.findBestHint = function () {

};

/**
 * Process changing input's value.
 */
spiral.Autocomplete.prototype.onValueChange = function () {
    this.currentValue = this.els.input.value;
    if (this.options.availableTags && !this.options.URL) {
        this.getSuggestions(this.currentValue);
    } else {
        clearTimeout(this.onChangeTimeout);
        this.selectedIndex = -1;
        (this.currentValue.length < this.options.minChars) ? this.hide() : this.getSuggestions(this.currentValue);
    }
};

/**
 * Gets suggestions from availableTags or from server.
 * @param {String} q Query
 */
spiral.Autocomplete.prototype.getSuggestions = function (q) {
    var that = this;

    if (this.options.availableTags && !this.options.URL) {
        if (q.trim() != "") {
            var suggestions = {};
            for (var key in this.options.availableTags) {
                if (this.options.availableTags[key].toLowerCase().indexOf(q.toLowerCase()) != -1) {
                    suggestions[key] = this.options.availableTags[key];
                }
            }
            that.processResponse(suggestions);
        } else {
            that.processResponse(this.options.availableTags);
        }
    } else {
        if (q.trim() != "") {
            if (this.currentRequest != null) this.currentRequest.abort();
            this.currentRequest = spiral.ajax({
                url: that.options.URL + "?" + that.options.query + "=" + q,
                processAnswer: function () {
                    if (that.currentValue && !that.filled) that.processResponse(arguments[0].response.suggestions);
                }
            });
            this.changeAddon("glyphicon gif-loading", true);
        } else {
            this.hide();
        }
    }
};

/**
 * Sets suggestions and call suggest function.
 * @param {Array|Object} suggestions Suggestions from response.
 */
spiral.Autocomplete.prototype.processResponse = function (suggestions) {
    this.suggestions = suggestions;
    this.suggest();
};

/**
 * Prepare suggestions or alert.
 * @returns {string}
 */
spiral.Autocomplete.prototype.prepareSuggestions = function () {
    var that = this,
        value = this.currentValue,//that.getQuery(that.currentValue),
        html = '';

    if (this.suggestions && ((!Array.isArray(this.suggestions) && Object.getOwnPropertyNames(this.suggestions).length > 0) || (Array.isArray(this.suggestions) && this.suggestions.length > 0))) {
        if (!Array.isArray(this.suggestions)) {
            for (var key in this.suggestions) {
                if (this.suggestions.hasOwnProperty(key)) {
                    html += '<div class="' + that.options.suggestionsClassName + '" data-key="' + key + '">' + that.formatResult(this.suggestions[key], value) + '</div>';
                }
            }
        } else {
            this.suggestions.forEach(function (suggestion, index) {
                html += '<div class="' + that.options.suggestionsClassName + '" data-key="' + index + '">' + that.formatResult(suggestion, value) + '</div>';
            });
        }
    } else {
        html = '<div class="alert alert-info" style="text-align: center; margin: 0;">There are no suggestions for this query.</div>';
    }

    return html;
};

/**
 * Shows dropdown with suggestions.
 */
spiral.Autocomplete.prototype.suggest = function () {
    this.els.suggestions.innerHTML = this.prepareSuggestions();
    this.show();
};

/**
 * Escape.
 * @param {String} value String to escape.
 * @returns {String} Escaped string.
 */
spiral.Autocomplete.prototype.escapeRegExChars = function (value) {
    return value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

/**
 * Highlight query in suggestion.
 * @param {String} suggestion String to be formatted
 * @param {String} currentValue Query to highlight from suggestion string
 * @returns {String} Highlighted result
 */
spiral.Autocomplete.prototype.formatResult = function (suggestion, currentValue) {
    var pattern = '(' + this.escapeRegExChars(currentValue) + ')';
    return suggestion.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>');
};

/**
 * Process suggestion select.
 * @param {String} key Key that was written in "data-key" attribute in selected suggestion
 */
spiral.Autocomplete.prototype.select = function (key) {
    this.hide();
    this.onSelect(key);
};

/**
 * Process onSelect.
 * @param {String} key Key that was written in "data-key" attribute in selected suggestion
 */
spiral.Autocomplete.prototype.onSelect = function (key) {
    this.addTag(key, this.suggestions[key]);
};

//Methods for delimiter
//spiral.Autocomplete.prototype.getValue = function (value) {
//    var that = this,
//        currentValue,
//        parts;
//
//    if (!this.options.delimiter) return value;
//    currentValue = that.currentValue;
//    parts = currentValue.split(this.options.delimiter);
//    if (parts.length === 1) return value;
//    return currentValue.substr(0, currentValue.length - parts[parts.length - 1].length) + value;
//};

//spiral.Autocomplete.prototype.getQuery = function (value) {
//    if (!this.options.delimiter) return value.trim();
//    var parts = value.split(this.options.delimiter);
//    return parts[parts.length - 1].trim();
//};

/**
 * Process focus on input. Only if availableTags are present.
 */
spiral.Autocomplete.prototype.onFocus = function () {
    this.getSuggestions("");
};

/**
 * Processes keyPress
 * @param {Object} e Event that fires on key down.
 */
spiral.Autocomplete.prototype.onKeyPress = function (e) {
    var that = this;

// If suggestions are hidden and user presses arrow down, display suggestions:
    if (!this.disabled && !this.visible && e.which === this.keys.DOWN && this.currentValue) {
        this.onValueChange();
        return;
    }

    switch (e.which) {
//        case that.keys.BACKSPACE:
//            that.onValueChange();
//            return;
//            break;
        case that.keys.RETURN:
            e.stopImmediatePropagation();
            e.preventDefault();
            if (that.selectedIndex === -1) {
                if (!this.options.allowNew && this.currentValue == this.els.input.value) {
                    that.onValueChange();
                } else {
                    that.addTag(false, that.els.input.value);
                }
                return;
            }

            that.select(that.getKeyByIndex(that.selectedIndex));
//            if (e.which === that.keys.TAB && that.options.tabDisabled === false) {
//                return;
//            }
            break;
        case that.keys.UP:
            if (!that.visible) return;
            that.moveUp();
            break;
        case that.keys.DOWN:
            if (!that.visible) return;
            that.moveDown();
            break;
        default:
            return;
    }

// Cancel event if function did not return:
    e.stopImmediatePropagation();
    e.preventDefault();
};

/**
 * Move up highlight of current suggestion.
 */
spiral.Autocomplete.prototype.moveUp = function () {
    var that = this;

    if (this.selectedIndex === -1) return;

    if (this.selectedIndex === 0) {
        [].forEach.call(this.els.suggestions.children, function (child) {
            child.classList.remove(that.options.selectedClassName);
        });
        that.selectedIndex = -1;
        return;
    }

    this.adjustScroll(this.selectedIndex - 1);
};

/**
 * Move down highlight of current suggestion.
 */
spiral.Autocomplete.prototype.moveDown = function () {
    if (this.selectedIndex === (this.els.suggestions.children.length - 1)) return;
    this.adjustScroll(this.selectedIndex + 1);
};

/**
 * Function to adjust scrolling if many suggestions.
 * Not implemented now. Just transit.
 * @param {Number} index Index of current suggestion.
 */
spiral.Autocomplete.prototype.adjustScroll = function (index) {
    this.activate(index);
};

/**
 * Highlight active suggestion.
 * @param {Number} index Index of current suggestion.
 * @returns {null}
 */
spiral.Autocomplete.prototype.activate = function (index) {
    var that = this;
    [].forEach.call(this.els.suggestions.children, function (child) {
        child.classList.remove(that.options.selectedClassName);
    });
    this.els.suggestions.children[index].classList.add(that.options.selectedClassName);
    this.selectedIndex = index;
    return null;
};
spiral.Autocomplete.prototype.die = function () {
    console.error("TODO DIE");//TODO DIE
};

spiral.instancesController.addInstanceType("autocomplete", "js-spiral-autocomplete", spiral.Autocomplete);