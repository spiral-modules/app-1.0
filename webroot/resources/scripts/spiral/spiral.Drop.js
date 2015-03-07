"use strict";
/**
 * This a constructor (class) for files upload.
 * @param {Object} node dom node
 * @param {Object} options all options to override default
 * @constructor
 * @extends spiral.BaseDOMConstructor
 */
spiral.Drop = function (node, options) {
    this.init(node);//call parent

    if (options) {//if we pass options extend all options by passed options
        this.options = spiral.tools.extend(this.options, options);
    }

    //elements
    this.els = {
        node: node
    };
    Dropzone.autoDiscover = false;
    this.dropzone = new Dropzone(".js-spiral-drop", {
        url: this.options.url,
        acceptedFiles: this.options.acceptedFiles,
        addRemoveLinks: false
    });
//    this.reset();
    this.addEventListeners();
};

/**
 *
 * @type {spiral.BaseDOMConstructor.prototype}
 * @lends spiral.Drop.prototype
 */
spiral.Drop.prototype = Object.create(spiral.BaseDOMConstructor.prototype);

/**
 * @override
 * @inheritDoc
 * @enum {string}
 */
spiral.Drop.prototype.attributesToGrab = {
    /**
     *  Name for formData <b>Default: "file"</b>
     */
    "data-name": {
        "value": "file",
        "key": "name"
    },
    /**
     *  URL <b>Default: "/uploads/"</b>
     */
    "data-url": {
        "value": "/uploads/",
        "key": "url"
    },
    /**
     *
     */
    "data-acceptedFiles": {
        "value": "",
        "key": "acceptedFiles"
    }
};
spiral.Drop.prototype.reset = function () {
};

/**
 * Adds events listeners.
 */
spiral.Drop.prototype.addEventListeners = function () {
    var that = this;
};

spiral.Drop.prototype.die = function () {
    console.error("TODO DIE");//TODO DIE
};

spiral.instancesController.addInstanceType("drop", "js-spiral-drop", spiral.Drop);