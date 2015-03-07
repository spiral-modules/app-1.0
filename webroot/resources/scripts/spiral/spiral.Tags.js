"use strict";
/**
 * This a constructor (class) for tags input with suggestions.
 * Suggestions can be received from server or from php.
 * @param {Object} options
 * @param {Object} node
 * @constructor
 * @extends spiral.Autocomplete
 */
spiral.Tags = function (node, options) {
    this.init(node);//call parent

    var that = this;

    if (options) //if we pass options extend all options by passed options
        this.options = spiral.tools.extend(this.options, options);

    if (this.options.allowNew == "false")
        this.options.allowNew = false;

    /*INITIAL VARIABLES*/
    this.filled = false;
    this.tags = {};
    this.currentValue = "";
    this.selectedIndex = -1;
    this.addonState = "search";

    this.els = {
        node: node,
        input: node.getElementsByClassName("js-spiral-tags-el")[0],
        suggestions: node.getElementsByClassName("js-spiral-tags-suggestions")[0],
        addon: node.getElementsByClassName("js-spiral-tags-addon")[0],
        tags: node.getElementsByClassName("js-spiral-tags-tags")[0],
        inputs: node.getElementsByClassName("js-spiral-tags-inputs")[0]
    };

    if (this.options.format !== "array") {
        this.els.singleInput = document.createElement("input");
        this.els.singleInput.type = "hidden";
        this.els.singleInput.name = this.options.name;
        this.els.inputs.appendChild(this.els.singleInput);
    } else {
        this.els.singleInput = null;
    }

    if (this.options.URL[this.options.URL.length - 1] === "/")
        this.options.URL = this.options.URL.substring(0, this.options.URL.length - 1);

    if (this.options.selectedTags) {
        for (var key in that.options.selectedTags) {
            if (that.options.selectedTags.hasOwnProperty(key)) {
                that.options.selectedTags = this.prepare(that.options.selectedTags);
                that.addTag(key, that.options.selectedTags[key]);
            }
        }
    }

    if (this.options.availableTags && !this.options.URL)
        this.options.deferRequestBy = 0;

    this.addEventListeners();

    /*Additional event listener for deleting tags*/
    this.els.tags.addEventListener("click", function (e) {
        if (e.target.getAttribute('data-tag')) {//TODO possible bug .Check <div data-tag=""> ffff <strong> dddd </strong></div>
            that.removeTag(e.target.getAttribute('data-tag'));
        } else {
            if (e.target.parentNode.getAttribute('data-tag')) {
                that.removeTag(e.target.parentNode.getAttribute('data-tag'));
            }
        }
    });
};

/**
 *
 * @type {spiral.Autocomplete.prototype}
 */
spiral.Tags.prototype = Object.create(spiral.Autocomplete.prototype);

/**
 * @override
 * @inheritDoc
 * @enum {string}
 */
spiral.Tags.prototype.attributesToGrab = {
    /**
     * URL to get suggestions form <b>Default: "/"</b>
     */
    "data-url": {
        "value": "/",
        "key": "URL"
    },
    /**
     * Name to send <b>Default: "tags"</b>
     */
    "data-name": {
        "value": "tags",
        "key": "name"
    },
    /**
     *  Accept or not values that not present in suggestions <b>Default: "false"</b>
     */
    "data-allowNew": {
        "value": false,
        "key": "allowNew"
    },
    /**
     *  In which format send data to server.</br>
     *  "array" - tags[K1]=V1, tags[K2]=V2</br>
     *  "string" - tags[]=V1,V2,V3</br>
     *  <b>Default: "array"</b>
     */
    "data-format": {
        "value": "array",
        "key": "format"
    },
    /**
     * Defer time before AJAX in milliseconds. <b>Default: "500"</b>
     */
    "data-deferRequestBy": {
        "value": 500,
        "key": "deferRequestBy"
    },
    /**
     * Query symbols for AJAX <b>Default: "query"</b>
     */
    "data-query": {
        "value": "query",
        "key": "query"
    },
    /**
     * Class for suggestions <b>Default: "autocomplete-suggestion"</b>
     */
    "data-suggestionsClassName": {
        "value": "autocomplete-suggestion",
        "key": "suggestionsClassName"
    },
    /**
     * Class for selected suggestions <b>Default: "autocomplete-selected"</b>
     */
    "data-selectedClassName": {
        "value": "autocomplete-selected",
        "key": "selectedClassName"
    },
    /**
     * Minimum entered chars before sending AJAX <b>Default: "1"</b>
     */
    "data-minChars": {
        "value": 1,
        "key": "minChars"
    }
};

/**
 * @override
 * @inheritDoc
 * @enum {Object}
 */
spiral.Tags.prototype.optionsToProcess = {
    /**
     * Tags that prefilled from PHP.
     */
    "selectedTags": {
        "processor": function (node) { //processor
            var JSONNode = node.getElementsByClassName("js-spiral-tags-selected-tags")[0];
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
    },
    /**
     * Tags that available from PHP.
     */
    "availableTags": {
        "processor": function (node) { //processor
            var JSONNode = node.getElementsByClassName("js-spiral-tags-available-tags")[0];
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
 * Hides autocomplete suggestions. Changes bootsrap addon.
 */
spiral.Tags.prototype.hide = function () {
    this.els.suggestions.style.visibility = "hidden";
    this.visible = false;
    this.selectedIndex = -1;

    if (!this.options.allowNew && this.currentValue != "" && this.currentValue != this.els.input.value)
        this.changeAddon("search");
};

/**
 * Clears input, suggestions, variables.
 */
spiral.Tags.prototype.clear = function () {
    this.els.input.readOnly = false;
    this.currentValue = "";
    this.els.input.value = "";
    this.suggestions = {};
    this.filled = false;
    this.hide();
    this.changeAddon("search");
};

/**
 * Sets suggestions and call suggest function.
 * @param {Array|Object} suggestions Suggestions from response.
 */
spiral.Tags.prototype.processResponse = function (suggestions) {
    this.suggestions = this.prepare(suggestions);
    this.suggest();
};

spiral.Tags.prototype.prepare = function (suggestions) {
    if (!this.fullSuggestions)
        this.fullSuggestions = suggestions;
    var short = {};
    for (var i in suggestions) {
        if (suggestions.hasOwnProperty(i)) {
            if (!this.fullSuggestions[i])
                this.fullSuggestions[i] = suggestions[i];
            short[i] = (typeof suggestions[i] == "object") ? suggestions[i].info.title : suggestions[i];
        }
    }
    return short;
};

/**
 * Creates visible tag.
 * @param value Value that shows to user in tag
 * @param data Almost always it's just key. But can be trimmed value.
 * It's more like an id by which then we can delete hidden input.
 * @returns {HTMLElement}
 */
spiral.Tags.prototype.makeVisibleTag = function (value, data) {
    var tag = document.createElement("div");

    if (this.fullSuggestions && typeof this.fullSuggestions[data] == 'object') {
        value = [];
        var info = typeof this.fullSuggestions[data]['info'] == 'object' ? this.fullSuggestions[data]['info'] : [];
        var links = typeof this.fullSuggestions[data]['links'] == 'object' ? this.fullSuggestions[data]['links'] : [];

        for (var type in info) {
            if (info.hasOwnProperty(type)) {
                value.push('<span>' + info[type] + '</span>');
            }
        }

        for (var i = 0; i < links.length; i++) {
            value.push('<span><a target="_blank" href="' + links[i]['href'] + '">' + links[i]['title'] + '</a></span>');
        }
    }
    if (typeof value == 'object') {
        tag.className = "btn-group btn-group-xs tag-extended";
        tag.innerHTML = '<button type="button" class="btn btn-default tag-extended-info">' + value.join(' | ') + '</button>' +
        '<button type="button" class="btn btn-default" data-tag="' + data + '"><i class="glyphicon glyphicon-remove"></i></button>';
    } else {
        tag.className = "btn-group btn-group-xs tag-default";
        tag.innerHTML = '<button type="button" class="btn btn-default" disabled>' + value + '</button>' +
        '<button type="button" class="btn btn-default" data-tag="' + data + '"><i class="glyphicon glyphicon-remove"></i></button>';
    }

    return tag;
};

/**
 * Makes invisible input to then sent to server.
 * @param value Tag's value.
 * @param key Tag's key.
 * @returns {HTMLElement}
 */
spiral.Tags.prototype.makeInvisibleInput = function (key, value) {
    var invisibleInput = document.createElement("input");
    invisibleInput.type = "hidden";
    if (key) {
        invisibleInput.value = value;
        invisibleInput.name = this.options.name + '[' + key + ']';
    } else {
        invisibleInput.value = value;
        invisibleInput.name = this.options.name + '[' + value + ']';
    }

    return invisibleInput;
};

/**
 * Removes visible tag.
 * @param {String} tag Given from "data-tag"
 */
spiral.Tags.prototype.removeTag = function (tag) {
    //TODO priority - low. Fix potential bug when you can write then delete new tag value that matches some old key.
    this.els.tags.removeChild(this.tags[tag].tagVisible);
    if (this.options.format == "array") {
        this.els.inputs.removeChild(this.tags[tag].tagInvisible);
    } else {
        this.els.singleInput.value = this.els.singleInput.value.replace(this.tags[tag].value, "");
        this.els.singleInput.value = this.els.singleInput.value.replace(",,", ",")
    }
    delete this.tags[tag];
};

/**
 * Adds visible tags and invisible inputs.
 * @param {String | Boolean} key Key can be false if there are no keys.
 * @param {String} value
 */
spiral.Tags.prototype.addTag = function (key, value) {
    if (value.trim().length > 0 && ( key || this.options.allowNew)) {
        /**Check if user entered something, excluding spaces**/
        var tagVisible, tagInvisible;
        if (this.options.format == "array") {
            /**Different logic for different data formats**/
            var dataTag = "";
            if (this.options.allowNew) {
                tagInvisible = this.makeInvisibleInput(key, value);
                dataTag = this.trim(value);
            } else {
                tagInvisible = this.makeInvisibleInput(key, value);
                dataTag = key;
            }
            if (this.tags[dataTag]) return;
            this.els.inputs.appendChild(tagInvisible);
            tagVisible = this.makeVisibleTag(value, dataTag);
            this.tags[dataTag] = {
                tagInvisible: tagInvisible,
                tagVisible: tagVisible
            };
        } else {
            var tags = [];
            if (this.options.allowNew) {
                /**Write values if new tags are allowed*/
                var valueTrimmed = this.trim(value);
                if (this.tags[valueTrimmed]) return;
                tagVisible = this.makeVisibleTag(value, valueTrimmed);
                this.tags[valueTrimmed] = {
                    key: key,
                    value: value,
                    trimmedValue: valueTrimmed,
                    tagVisible: tagVisible
                };
                tags = [];
                for (var k in this.tags) {
                    if (this.tags.hasOwnProperty(k)) {
                        tags.push(this.tags[k].value);
                    }
                }
                this.els.singleInput.value = tags.join();
            } else {
                /**Write keys if new tags aren't allowed*/
                if (this.tags[key]) return;
                tagVisible = this.makeVisibleTag(value, key);
                this.tags[key] = {
                    value: value,
                    tagVisible: tagVisible
                };
                tags = [];
                for (var k2 in this.tags) {
                    if (this.tags.hasOwnProperty(k2)) {
                        tags.push(k2);
                    }
                }
                this.els.singleInput.value = tags.join();
            }
        }
        this.els.tags.appendChild(tagVisible);
        this.clear();
    }
};

spiral.Tags.prototype.die = function () {
    console.error("TODO DIE");//TODO DIE
};

spiral.instancesController.addInstanceType("tags", "js-spiral-tags", spiral.Tags);