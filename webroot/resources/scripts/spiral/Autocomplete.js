"use strict";
if (!window.spiral) window.spiral = spiralFrontend;//todo temporary
(function (spiral) {

    /**
     * This a constructor (class) for text input with suggestions.
     * Suggestions can be received from server or from php.
     * @param {Object} spiral
     * @param {Object} node dom node
     * @param {Object} options all options to override default
     * @constructor
     * @extends spiral.BaseDOMConstructor
     */
    var Autocomplete = function (spiral, node, options) {
        this.init(node);//call parent

        var defaults = {
            /*NOT REQUIRED OPTIONS*/
            query: "query",
            suggestionsClassName: 'autocomplete-hint',
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
         * @default -1
         * */
        this.selectedIndex = -1;

        this.els = {
            node: node,
            input: node,
            wrapper: spiral.tools.closest(node, '.item-form'),
            group: node.parentNode,
            hidden: document.createElement('input'),
            hints: null,
            addon: document.createElement("button")
        };

        this.els.wrapper.appendChild(this.els.hidden);
        this.els.hidden.setAttribute('type', 'hidden');
        this.els.hidden.name = this.els.input.dataset.name;
        this.els.addon.className = "btn-icon";
        this.els.addon.setAttribute("type", "button");
        this.els.group.appendChild(this.els.addon);

        if (this.options.URL[this.options.URL.length - 1] === "/") {
            this.options.URL = this.options.URL.substring(0, this.options.URL.length - 1);
        }

        this.value = this.els.input.value;
        this.key = this.els.input.dataset.key;

        if (this.key && this.value) {
            this.setState("filled");
        } else {
            this.setState("search");
        }

        if (this.options.availableTags && !this.options.URL) {
            this.options.deferRequestBy = 0;
        }

        this.addEventListeners();
    };

    /**
     *
     * @type {spiral.BaseDOMConstructor.prototype}
     * @lends Autocomplete.prototype
     */
    Autocomplete.prototype = Object.create(spiral.BaseDOMConstructor.prototype);

    /**
     * @override
     * @inheritDoc
     * @enum {string}
     */
    Autocomplete.prototype.attributesToGrab = {
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
    Autocomplete.prototype.optionsToProcess = {
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
    Autocomplete.prototype.addEventListeners = function () {
        var that = this;

        function wrap(e) {
            if (e.type === 'keydown') that.onKeyPress(e);
            if (e.type === 'input' || e.type === 'change') that.onKeyUp(e);
            if (e.type === 'click') that.wrap(e);
        }

        function listen() {
            that.els.input.addEventListener("keydown", wrap);
            that.els.input.addEventListener("change", wrap);
            that.els.input.addEventListener("input", wrap);
            that.els.input.addEventListener("blur", function () {
                that.els.input.removeEventListener("keydown", wrap);
                that.els.input.removeEventListener("change", wrap);
                that.els.input.removeEventListener("input", wrap);
                that.els.input.removeEventListener("blur", listen);
            }, false);
        }

        this.els.input.addEventListener("focus", listen);

        this.els.addon.addEventListener("click", function () {
            switch (that.state) {
                case "search":
                    that.onValueChange();
                    break;
                case "filled":
                    that.clear();
                    break;
                case "add":
                    that.addTag(false, that.els.input.value);
                    break;
                case "select":

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
    };

    /**
     * Key codes.
     * @enum {Number}
     */
    Autocomplete.prototype.keys = {
        ESC: 27, TAB: 9, RETURN: 13, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, BACKSPACE: 8
    };


    /**
     * Gets key from data-key from element.
     * @param {Number} index Index of current suggestion.
     * @return {String} Key that written in "data-key" attribute
     */
    Autocomplete.prototype.getKeyByIndex = function (index) {
        return this.els.hints.children[index].getAttribute("data-key");
    };

    /**
     * Hides hints. Changes state.
     */
    Autocomplete.prototype.hide = function () {
        if (!this.els.hints) return;
        this.els.group.removeChild(this.els.hints);
        this.els.hints = null;
        this.visible = false;
        this.selectedIndex = -1;
        if (this.value !== "" && this.value !== this.els.input.value) {
            this.setState(this.options.allowNew ? "add" : "search");
        }
    };

    /**
     * Clears input, suggestions, variables.
     */
    Autocomplete.prototype.clear = function () {
        this.value = "";
        this.els.input.value = "";
        this.els.hidden.value = "";
        this.suggestions = {};
        this.filled = false;
        this.hide();
        this.setState("search");
    };

    /**
     * Trim string.
     * @param {String} str String that will be trimmed
     * @return {String} Trimmed string
     */
    Autocomplete.prototype.trim = function (str) {
        return str.trim().replace(/\s+/g, '_')
    };

    /**
     * Changes item-state- class on wrapper.
     * @param {String} state
     */
    Autocomplete.prototype.setState = function (state) {
        if (this.state === state) return;
        this.els.wrapper.classList.remove("item-state-" + this.state);
        this.els.wrapper.classList.add("item-state-" + state);
        this.state = state;
        if (state === "filled") {
            this.hide();
            this.els.input.readOnly = true;
        } else {
            this.els.input.readOnly = false;
        }
    };

    /**
     * Change value for visible input and for invisible inputs.
     * @param {String | Boolean} key Key to add to hidden input and than send to server.
     * @param {String} value Value just to show to users.
     */
    Autocomplete.prototype.addTag = function (key, value) {
        if (this.options.allowNew || key !== true) {
            this.els.hidden.value = this.options.allowNew ? value : key;
            this.value = value;
            this.els.input.value = this.value;
            this.suggestions = {};
            this.filled = true;
            this.setState("filled");
        }
    };

    /**
     * Process key up.
     * @param e Event that fires on key up.
     */
    Autocomplete.prototype.onKeyUp = function (e) {
        var that = this;
        if (this.disabled) return;

//    switch (e.which) {
//        case this.keys.UP:
//        case this.keys.DOWN:
//            return;
//    }

        clearTimeout(this.onChangeTimeout);

        if (this.value !== this.els.input.value) {
            this.findBestHint();
            if (this.options.deferRequestBy > 0) {
                if (this.options.allowNew)
                    this.setState("add");
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
    Autocomplete.prototype.findBestHint = function () {

    };

    /**
     * Process changing input's value.
     */
    Autocomplete.prototype.onValueChange = function () {
        this.value = this.els.input.value;
        if (this.options.availableTags && !this.options.URL) {
            this.getSuggestions(this.value);
        } else {
            clearTimeout(this.onChangeTimeout);
            this.selectedIndex = -1;
            this.value.length < this.options.minChars ? this.hide() : this.getSuggestions(this.value);
        }
    };

    /**
     * Gets suggestions from availableTags or from server.
     * @param {String} q Query
     */
    Autocomplete.prototype.getSuggestions = function (q) {
        var that = this;

        if (this.options.disable) {
            this.setState("add");
            return;
        }

        if (this.options.availableTags && !this.options.URL) {
            if (q.trim() != "") {
                var suggestions = {};
                for (var key in this.options.availableTags) {
                    if (this.options.availableTags.hasOwnProperty(key) &&
                        this.options.availableTags[key].toLowerCase().indexOf(q.toLowerCase()) != -1) {
                        suggestions[key] = this.options.availableTags[key];
                    }
                }
                that.suggest(suggestions);
            } else {
                that.suggest(this.options.availableTags);
            }
        } else {
            if (q.trim() != "") {
                if (this.ajax != null) this.ajax[1].abort();
                var data = {};
                data[that.options.query] = q;
                this.ajax = spiral.ajax.send({
                    url: that.options.URL,
                    data: that.options.query,
                    isReturnXHRToo:true
                });
                this.ajax[0].then(
                    function (answer) {
                        if (that.value && !that.filled) that.suggest(answer.suggestions);
                    },
                    function (error) {

                    });
                this.setState("loading");
            } else {
                this.hide();
            }
        }
    };

    /**
     * Prepare suggestions or alert.
     * @returns {string}
     */
    Autocomplete.prototype.prepareSuggestions = function () {//todo create nodes (not innerHtml)
        var that = this,
            value = this.value,//that.getQuery(that.value),
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
     * Shows dropdown with the hints.
     */
    Autocomplete.prototype.suggest = function (hints) {
        var that = this;
        this.hide();
        this.suggestions = hints;
        this.els.hints = document.createElement('div');
        this.els.hints.className = 'autocomplete-hints';
        this.els.hints.style.position = 'absolute';
        this.els.hints.innerHTML = this.prepareSuggestions();
        this.els.group.insertBefore(this.els.hints, this.els.input.nextSibling);
        this.visible = true;

        this.els.hints.addEventListener("click", function (e) {//todo implement with removeEventListener
            var div = (e.target.nodeName === "DIV") ? e.target : e.target.parentNode;
            if (div.getAttribute("data-key")) {
                that.select(div.getAttribute("data-key"));
            }
        });

        this.setState(this.options.allowNew ? "add" : "select");
    };

    /**
     * Escape.
     * @param {String} value String to escape.
     * @returns {String} Escaped string.
     */
    Autocomplete.prototype.escapeRegExChars = function (value) {
        return value.replace(/[\-\[\]\/\{}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };

    /**
     * Highlight query in suggestion.
     * @param {String} suggestion String to be formatted
     * @param {String} value Query to highlight from suggestion string
     * @returns {String} Highlighted result
     */
    Autocomplete.prototype.formatResult = function (suggestion, value) {
        var pattern = '(' + this.escapeRegExChars(value) + ')';
        return suggestion.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>');
    };

    /**
     * Process suggestion select.
     * @param {String} key Key that was written in "data-key" attribute in selected suggestion
     */
    Autocomplete.prototype.select = function (key) {
        this.addTag(key, this.suggestions[key]);
    };

//Methods for delimiter
//Autocomplete.prototype.getValue = function (value) {
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

//Autocomplete.prototype.getQuery = function (value) {
//    if (!this.options.delimiter) return value.trim();
//    var parts = value.split(this.options.delimiter);
//    return parts[parts.length - 1].trim();
//};

    /**
     * Process focus on input. Only if availableTags are present.
     */
    Autocomplete.prototype.onFocus = function () {
        this.getSuggestions("");
    };

    /**
     * Processes keyPress
     * @param {Object} e Event that fires on key down.
     */
    Autocomplete.prototype.onKeyPress = function (e) {
        var that = this;

        // If suggestions are hidden and user presses arrow down -> display suggestions
        if (!this.disabled && !this.visible && e.which === this.keys.DOWN && this.value) {
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
                    if (!this.options.allowNew && this.value == this.els.input.value) {
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
    Autocomplete.prototype.moveUp = function () {
        var that = this;

        if (this.selectedIndex === -1) return;

        if (this.selectedIndex === 0) {
            [].forEach.call(this.els.hints.children, function (child) {
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
    Autocomplete.prototype.moveDown = function () {
        if (this.selectedIndex === (this.els.hints.children.length - 1)) return;
        this.adjustScroll(this.selectedIndex + 1);
    };

    /**
     * Function to adjust scrolling if many suggestions.
     * Not implemented now. Just transit.
     * @param {Number} index Index of current suggestion.
     */
    Autocomplete.prototype.adjustScroll = function (index) {
        this.highlight(index);

        var item = this.els.hints.children[this.selectedIndex],
            hintsHeight = this.els.hints.clientHeight,
            hintTop = item.offsetTop,
            hintHeight = item.offsetHeight;

        if (hintTop < this.els.hints.scrollTop) {
            this.els.hints.scrollTop = hintTop;
        } else if (hintTop > this.els.hints.scrollTop + hintsHeight - hintHeight) {
            this.els.hints.scrollTop = hintTop - hintsHeight + hintHeight;
        }
    };

    /**
     * Highlight active suggestion.
     * @param {Number} index Index of current suggestion.
     * @returns {null}
     */
    Autocomplete.prototype.highlight = function (index) {
        var that = this;
        [].forEach.call(this.els.hints.children, function (child) {
            child.classList.remove(that.options.selectedClassName);
        });
        this.els.hints.children[index].classList.add(that.options.selectedClassName);
        this.selectedIndex = index;
        return null;
    };

    Autocomplete.prototype.die = function () {
        console.error("TODO DIE");//TODO DIE
    };

    spiral.instancesController.addInstanceType("autocomplete", "js-spiral-autocomplete", Autocomplete);
})(spiral);