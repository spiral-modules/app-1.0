"use strict";
/**
 * Spiral Forms
 * @param {Object} node  DomNode of form
 * @param {Object} [options] all options to override default
 * @constructor
 * @extends spiral.BaseDOMConstructor
 */
spiral.Form = function (node, options) {
    this.init(node);//call parent

    if (options) {//if we pass options extend all options by passed options
        this.options = spiral.tools.extend(this.options, options);
    }
    if (this.options.fillFrom) {//id required to fill form
        this.fillFieldsFrom();
    }
    /**
     * @extends spiral.DOMEvents
     * @type {spiral.DOMEvents}
     * @inheritDoc
     * */
    this.DOMEvents = new spiral.DOMEvents();
    this.addEvents();
    /**
     * @extends spiral.Events
     * @type {spiral.Events}
     * @inheritDoc
     * */
    this.events = new spiral.Events();
};
/**
 * @lends spiral.Form.prototype
 */
spiral.Form.prototype = Object.create(spiral.BaseDOMConstructor.prototype);

/**
 * Internal object of settings
 * @enum {Object}
 * @private
 */
spiral.Form.prototype._settings = {
    /**
     * Form class name
     * @type {String}
     */
    fieldClass: "form-group",
    /**
     * Class to find message
     * @type {String}
     */
    messageClass: "messages-placeholder"

};
/**
 * @override
 * @inheritDoc
 * @enum {Object}
 */
spiral.Form.prototype.optionsToProcess = {
    /**
     * Link to form
     */
    "context": {
        "processor": function (form) { //processor
            return form;
        }
    },
    /**
     * Link to 'this'
     */
    self: {
        "processor": function (form) {
            return this;
        }
    },
    /**
     * This value called after ajax completed
     */
    processAnswer: {// TODO REFACTOR
        "value": function (options) {

            if (options.response.message) {
                this.self.showMessage("success", options, options.response.message);
            } else if (options.response.errors) {
                this.self.showErrors(options, options.response.errors);
                if (options.response.error) {
                    this.self.showMessage("danger", options, options.response.error);
                }
            } else if (options.response.error) {
                this.self.showMessage("danger", options, options.response.error);
            } else if (!options.isSuccess) {
                this.self.showMessage("danger", options, options.response);
            }

            if (options.ajaxCallback) {
                var fn = eval(options.ajaxCallback);
                if (typeof(fn) === "function") {
                    fn.call(this.self, options);
                }
            }

            spiral.forms.events.performAction(options.url, options);
        }
    }
};

/**
 * @override
 * @inheritDoc
 * @enum {String}
 */
spiral.Form.prototype.attributesToGrab = {//option to grab from forms
    /**
     * URL to send form (if ajax form) <b>Default: "/"</b>
     */
    "action": {
        "key": "url",
        "value": "/"
    },
    /**
     * Method to send to send form (if ajax form) <b>Default: "POST"</b>
     */
    "method": {
        "value": "POST"
    },
    /**
     * Lock type when form sending <b>Default: "default"</b> @see spiral.lock
     */
    "data-lockType": {
        "value": "default",
        "key": "lockType"
    },
    /**
     * Use ajax to submit form <b>Default: true</b>
     */
    "data-useAjax": {// attribute of form
        "value": true, //default value
        "key": "useAjax", // key to return
        "processor": function (val, form) { // processor to process data before return
            val = (val !== void 0 && val !== null) ? val.toLowerCase() : '';
            if (val === 'false') {
                val = false;
            } else if (val === 'true') {
                val = true;
            } else {
                val = this.value;// default value available as this.value
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
    "data-callback": {// attribute of form
        "value": false, //default value
        "key": "ajaxCallback" // key to return
    },
    "data-before-submit": {// attribute of form
        "value": false, //default value
        "key": "beforeSubmitCallback" // key to return
    },
    "data-after-submit": {// attribute of form
        "value": false, //default value
        "key": "afterSubmitCallback" // key to return
    },
    /**
     * Enable form autofill <b>Default: false</b>
     */
    "data-fillFrom": {// attribute of form
        "value": false, //default value
        "key": "fillFrom" // key to return
    },
    /**
     * If autofill enabled which field use to fill form <b>Default: user</b>
     */
    "data-fillModel": {// attribute of form
        "value": 'user', //default value
        "key": "fillModel" // key to return
    },
    /**
     * Error position: before ("prepend") label or after ("append").<b>Default: append</b>
     */
    "data-errorPosition": {
        "value":"append",
        "key":"errorPosition"
    },
    /**
     * Class name  of error container for input.<b>Default: form-group</b>
     */
    "data-fieldClass":{
        "value":"form-group",
        "key":"fieldClass"
    }
};


/**
 * Call on form submit
 * @param {Event} e submit event
 */
spiral.Form.prototype.onSubmit = function (e) {
    if (this.options.context.classList.contains(("locked"))) {//if form locked return
        e.preventDefault();
        e.stopPropagation();
        return;
    }
    this.beforeSubmit();

    this.options.data = this.getFormData();

    // We can send files only with FormData
    // If form contain files and no FormData than disable ajax
    if (!window.FormData && this.options.context.querySelectorAll("input[type='file']").length !== 0) {
        this.options.useAjax = false;
    }

    spiral.events.performAction("beforeSubmit", this.options);
    this.events.performAction("beforeSubmit", this.options);

    if (this.options.useAjax) {

        this.send(this.options);

        e.preventDefault();
        e.stopPropagation();
    }
};
/**
 * Send form to server
 * @param sendOptions
 */
spiral.Form.prototype.send = function (sendOptions) {
    if (sendOptions.lockType !== 'none') {    //add lock
        sendOptions.lockProgress = spiral.lock.addLock(sendOptions.lockType, sendOptions.context);
    }
    if (sendOptions.beforeSubmitCallback) {
        var fn = eval(sendOptions.beforeSubmitCallback);
        if (typeof(fn) === "function") {
            fn.call(sendOptions);
        }
    }
    spiral.ajax(spiral.tools.extend(sendOptions, {//wrap processAnswer
        processAnswer: function (options) {
            if (options.lockType != 'none') {

              spiral.lock.removeLock(options.lockType, options.context);
            }
            sendOptions.processAnswer(options);
            if (options.afterSubmitCallback) {
                var fn = eval(options.afterSubmitCallback);
                if (typeof(fn) === "function") {
                    fn.call(options);
                }
            }
        }
    }));// TODO MAYBE REFACTOR
};


/**
 * Call before submitting form to server
 */
spiral.Form.prototype.beforeSubmit = function () {
    var alerts = this.options.context.querySelectorAll("." + this._settings.fieldClass + " .alert:not(.js-message)");//Remove all messages

    for (var i = 0, max = alerts.length; i < max; i++) {
        alerts[i].parentNode.removeChild(alerts[i]);
    }
    var errorsDiv = this.options.context.getElementsByClassName(this._settings.fieldClass);//Cleaning classes
    for (i = 0, max = errorsDiv.length; i < max; i++) {
        errorsDiv[i].classList.remove("has-error", "has-warning", "success");
    }

    this.options.context.getElementsByClassName(this._settings.messageClass)[0].classList.remove("visible");//hide messages
};

/**
 * Serialize form
 */
spiral.Form.prototype.getFormData = function () {
    if (!!window.FormData) {
        return new FormData(this.options.context);
    } else {
        console.log("Form `" + this.options.context + "` were processed without FormData.");
        return new formToObject(this.options.context);
    }
};

/**
 * Invalidates form elements and attaches validation messages.
 *
 * @param {Object} options
 * @param {Array} errors (form value name)->(message) array
 * @param {String} [prefix] if call recursive this is a previous part of selector
 */
spiral.Form.prototype.showErrors = function (options, errors, prefix) {
    var that=this;
    this.iterateForm(options, errors, prefix, function (node, message) {

        //Classes here should be adjusted and overwritten
        var error = document.createElement("div");
        error.className = 'alert alert-danger';
        error.innerHTML = message;

        //Element wrapper
        var closestField = spiral.tools.closest(node, "." + options.self._settings.fieldClass);
        if (closestField) {
            closestField.classList.add('has-error');
        }

        //Error message
        var nodeGroup =spiral.tools.closestByClassName(node,that.options.fieldClass);
        if (that.options.errorPosition ==="append"){
            nodeGroup.appendChild(error);
        } else if (that.options.errorPosition ==="prepend"){
            nodeGroup.insertBefore(error,nodeGroup.firstChild);
        }

    });
};

/**
 * Iterate form TODO make module
 * @param options
 * @param inputNames
 * @param prefix
 * @param callback
 */
spiral.Form.prototype.iterateForm = function (options, inputNames, prefix, callback) {
    var notFound = [];

    function findNodes(options, inputNames, prefix, callback) {
        "use strict";
        for (var inputName in inputNames) {
            if (inputNames.hasOwnProperty(inputName)) {
                var partOfSelector = (prefix) ? prefix + "[" + inputName + "]" : inputName,
                    type = Object.prototype.toString.call(inputNames[inputName]),
                    selector = "[name='" + partOfSelector + "']";

                switch (type) {
                    case '[object Object]':
                        findNodes(options, inputNames[inputName], partOfSelector, callback);//call recursive
                        break;

                    case '[object Array]':
                        inputNames[inputName].forEach(function (elm, key, arr) {
                            "use strict";
                            //TODO refactor this should call recursive
                            var sel = "[name='" + partOfSelector + "[]']" + "[value='" + elm + "']";
                            var nodes = options.context.querySelectorAll(sel);
                            if (nodes.length === 0) {
                                console.warn(sel, " in Array not found");
                                notFound.push(sel);
                            }
                            for (var i = 0, max = nodes.length; i < max; i++) {
                                callback(nodes[i], true);
                            }
                        });

                        break;

                    case '[object String]':
                    case '[object Number]':
                        var nodes = options.context.querySelectorAll(selector);
                        if (nodes.length === 0) {
                            nodes = options.context.querySelectorAll("[data-error-name='"+partOfSelector+"']");
                        }
                        if (nodes.length === 0) {
                            console.warn(selector, " not found");
                            var obj = {};
                            obj[partOfSelector] = inputNames[inputName];
                            notFound.push(obj);
                        }
                        for (var i = 0, max = nodes.length; i < max; i++) {
                            callback(nodes[i], inputNames[inputName]);
                        }
                        break;

                    default :

                        console.error("unknown type -", type, " and message", inputNames[inputName]);
                }

            }
        }
    }

    findNodes(options, inputNames, prefix, callback);
    if (notFound.length !== 0) {
        console.log("Some element not found in form", notFound);
    }
};
/**
 *
 * @param {String} [url] if force to load from url
 */
spiral.Form.prototype.fillFieldsFrom = function (url) {
    this.send(spiral.tools.extend(
        this.options,
        {
            url: (url) ? url : this.options.fillFrom,
            processAnswer: function (options) {
                options.self.iterateForm(options, options.response[options.fillModel], null, function (node, message) {
                    console.log(node.type);
                    switch (node.type) {
                        case "radio":
                            if (node.value != message) {
                                break;
                            }
                        case "checkbox":
                            node.checked = true;


//                            if (message==="false" || !message){
//                                node.checked = false;
//                            } else if(message==="true"  || !!message){
//                                node.checked = true;
//                            } else {
//                                console.error("something wrong. Check code");
//                            }
                            break;

                        default:
                            node.value = message;
                    }


                });
                spiral.events.performAction('afterFill', options);
            }
        })
    );
};
/**
 * Set options (overwrite current)
 * @param {Object} opt options
 */
spiral.Form.prototype.setOptions = function (opt) {
    this.options = spiral.tools.extend(this.options, opt);
};

/**
 * Show debug message
 *
 * @param {String} type warning,danger
 * @param {Object} options
 * @param {Object| String} response
 */
spiral.Form.prototype.showMessage = function (type, options, response) {
    response = (typeof response !== "object") ? response : JSON.stringify(response);

    var div = options.context.getElementsByClassName(this._settings.messageClass)[0],
        alert = div.getElementsByClassName("alert")[0];
    alert.className = "alert js-message alert-" + type;

    alert.getElementsByTagName("span")[0].innerHTML = response;
    div.classList.add("visible");
};

/**
 * Add all events for forms
 */
spiral.Form.prototype.addEvents = function () {
    var that = this;
    this.DOMEvents.add([
        {
            DOMNode: this.options.context,
            eventType: "submit",
            eventFunction: function (e) {
                that.onSubmit.call(that, e)
            }
        },
        {
            DOMNode: this.options.context.querySelector("." + this._settings.messageClass + " .alert .close"),
            eventType: "click",
            eventFunction: function (event) {
                event.currentTarget.parentNode.parentNode.parentNode.classList.remove("visible");
            }
        }
    ]);
};
/**
 * Clear all variables and die
 */
spiral.Form.prototype.die = function () {
    this.DOMEvents.removeAll();
};

/**
 * Form Event system
 * @see spiral.Events
 */
spiral.forms = {
    events: new spiral.Events()
};

spiral.forms.events.registerAction('mountID', function () {
    console.log(arguments);
});


spiral.instancesController.addInstanceType("form", "js-spiral-form", spiral.Form);
