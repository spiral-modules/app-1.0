(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
//https://github.com/spiral/sf.js

//Add console shim for old IE
require("./lib/shim/console");

var sf = {//Describe all modules to use it in plugins too.
    modules: {
        core: {
            Ajax: require("./lib/core/Ajax"),
            BaseDOMConstructor: require("./lib/core/BaseDOMConstructor"),
            DomMutations:require("./lib/core/DomMutations"),
            Events: require("./lib/core/Events"),
            InstancesController: require("./lib/core/InstancesController")
        },
        helpers: {
            DOMEvents:require("./lib/helpers/DOMEvents"),
            domTools:require("./lib/helpers/domTools"),
            LikeFormData: require("./lib/helpers/LikeFormData"),
            tools: require("./lib/helpers/tools")
        }
    }
};

sf.instancesController = new sf.modules.core.InstancesController(sf);
sf.domMutation = new sf.modules.core.DomMutations(sf.instancesController);

//create global ajax
sf.ajax = new sf.modules.core.Ajax(window.csrfToken ? {//TODO move to spiral bindings
    headers: {
        "X-CSRF-Token": window.csrfToken
    }
} : null);

window.spiral = sf; //TODO remove?


window.spiralFrontend = sf;

if (!window.hasOwnProperty("sf")){//bind only if  window.sf is empty to avoid conflicts with other libs
    window.sf = sf;
}

require("./lib/helpers/tools/iterateInputs.js"); //plugin is used in formMessages addon to iterate form inputs
require("./lib/core/ajax/actions.js"); //plugin to perform actions from the server
require("./lib/vendor/formToObject"); //formToObject  for form
require("./lib/instances/form/Form.js"); //add form
require("./lib/instances/form/addons/formMessages/spiral"); //add form addon

require("./lib/instances/lock/Lock.js"); //add lock
},{"./lib/core/Ajax":2,"./lib/core/BaseDOMConstructor":3,"./lib/core/DomMutations":4,"./lib/core/Events":5,"./lib/core/InstancesController":6,"./lib/core/ajax/actions.js":7,"./lib/helpers/DOMEvents":8,"./lib/helpers/LikeFormData":9,"./lib/helpers/domTools":10,"./lib/helpers/tools":11,"./lib/helpers/tools/iterateInputs.js":12,"./lib/instances/form/Form.js":13,"./lib/instances/form/addons/formMessages/spiral":14,"./lib/instances/lock/Lock.js":15,"./lib/shim/console":16,"./lib/vendor/formToObject":17}],2:[function(require,module,exports){
"use strict";

var tools = require("../helpers/tools");
var Events = require("../core/Events");
var LikeFormData = require("../helpers/LikeFormData");
/**
 * This is an Ajax transport.
 * Supports  XDomainRequest for old IE
 * @param {Object} [options]
 * @param {Object} [options.headers] Headers to add to the instance
 * @fires beforeSend event that will be performed before request is send. Event called with one parameter "options", that contains all variables for Ajax
 * @constructor
 */
var Ajax = function (options) {
    this.currentRequests = 0;
    this.events = new Events(["beforeSend", 'load']);

    if (options && options.headers) {
        this.headers = tools.extend(this.headers, options.headers);
    }
};

/**
 * Default headers. You can overwrite it. Look at the event beforeSend
 * Please note that on XDomainRequest  we can't send any headers.
 * @type Object
 */
Ajax.prototype.headers = {
    'X-Requested-With': 'XMLHttpRequest'
};

/**
 * Send ajax request to server
 * @since 3.0.0
 * @param {Object} options object with options
 * @param {String} options.url url to send data
 * @param {Object|String} [options.data] data to send
 * @param {String} [options.method]
 * @param {Object} [options.headers] headers to add to the request
 * @param {Function} [options.onProgress] callback function on progress. Two callback options: current bytes sent,totalBytes
 * @param {Function} [options.isReturnXHRToo===false] should method return array instead of Promise. Some times is needed to control ajax (abort, etc). If tree then  [window.Promise,XMLHttpRequest ] will be returned
 * @returns {window.Promise|[window.Promise,XMLHttpRequest]}
 */
Ajax.prototype.send = function (options) {
    var that = this;

    //TODO why we check here if data === null then reassign to null again?
    if (options.data === null || options.data === void 0 || options.data === 'undefined') {
        options.data = null;
    }
    if (!options.method) {
        options.method = "POST"
    }

    options.headers = options.headers ? tools.extend(this.headers, options.headers) : this.headers;
    var xhr;
    var ajaxPromise =  new Promise(function (resolve, reject) {    // Return a new promise.
        if (!options.url) {
            console.error("You should provide url");
            reject("You should provide url");
        }
        that.currentRequests++;

        var oldIE = false;

        if ((typeof window !== 'undefined') && window.XDomainRequest && (window.XMLHttpRequest && new XMLHttpRequest().responseType === undefined) && (url.indexOf("http") === 0)) {//old IE CORS
            //TODO maybe we should use XDomainRequest only for cross domain requests? But  Spiral for now works great with XDomainRequest (based on IEJSON)
            xhr = new XDomainRequest();
            //http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
            oldIE = true;
            //http://social.msdn.microsoft.com/Forums/ie/en-US/30ef3add-767c-4436-b8a9-f1ca19b4812e/ie9-rtm-xdomainrequest-issued-requests-may-abort-if-all-event-handlers-not-specified?forum=iewebdevelopment
            xhr.onprogress = function (e) {
                //TODO adjust options
                options.onProgress && options.onProgress(e);
            };
        } else {
            xhr = new XMLHttpRequest();
            if (options.onProgress) {
                xhr.upload.addEventListener("progress", function (event) {
                    if (event.lengthComputable) {
                        options.onProgress(event.loaded, event.total);
                    }
                }, false);
            }

        }


        xhr.open(options.method, options.url);

        xhr.onload = function () {//On loaded
            that.currentRequests--;
            var ans = that._parseJSON(xhr);
            if (ans.status) {
                if (ans.status > 199 && ans.status < 300) {//200-299
                    resolve(ans);
                } else if (ans.status > 399 && ans.status < 600) {//400-599
                    reject(ans);
                } else {
                    console.error("unknown status %d. Rejecting", ans.status);
                    reject(ans);
                }

            } else if (oldIE) {
                resolve(ans);//OLD IE + downloading file is producing  no status.
            } else {
                reject(ans);//reject with the status text
            }
            options.response = ans;
            that.events.trigger("load", options);//for example - used to handle actions
        };
        xhr.onerror = function () {// Handle network errors
            that.currentRequests--;
            reject(Error("Network Error"), xhr);
        };

        that.events.trigger("beforeSend", options);//you can modify "options" object inside event (like adding you headers,data,etc)

        var dataToSend;
        if (options.data !== null) {//if data to send is not empty
            if (!oldIE) {
                if (options.data.toString().indexOf("FormData") !== -1) {//if form data
                    dataToSend = options.data;
                } else {
                    dataToSend = new LikeFormData(options.data);
                    options.headers["content-type"] = dataToSend.getContentTypeHeader();
                }
                that._setHeaders(xhr, options.headers);

            } else {
                dataToSend = "IEJSON" + JSON.stringify(options.data);
            }
        } else {//else send empty data
            dataToSend = null;
        }


//        if (!oldIE) {
//            //xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
//            dataToSend = new spiral.LikeFormData(data, xhr, oldIE);
//        } else {
//            if (data !==null && data !== void 0 && data !== 'undefined'){
//                dataToSend = "IEJSON"+JSON.stringify(data);
//            } else {
//                 dataToSend =data;
//            }
//
//        }


        try {//working around FF bug
            xhr.send(dataToSend);// Make the request
        } catch (e) {
            //console.error("error sending trying another method");
            xhr.send(dataToSend.toString());
        }

        return xhr;
    });

    if (options.isReturnXHRToo){//return xhr too
        return [ajaxPromise,xhr]
    }
    return ajaxPromise;
};


/**
 * Please use send instead of sendRequest
 * @deprecated 3.0.0
 * @remove 3.1.0
 * //TODO remove in ver 3.1.0
 */
Ajax.prototype.sendRequest = Ajax.prototype.send;


/**
 * Iterate over headers object and call xhr.setRequestHeader
 * @param {XMLHttpRequest} xhr
 * @param {Object} headers object with headers to set
 */
Ajax.prototype._setHeaders = function (xhr, headers) {
    for (var header in headers) {
        xhr.setRequestHeader(header, headers[header]);
    }

};
/**
 * Try to parse and normalize answer
 * @param xhr
 * @returns {*}
 * @private
 */
Ajax.prototype._parseJSON = function (xhr) {
    if (!xhr.response) {
        xhr.response = xhr.responseText;
    }
    var ret = {};
    var contentType = false;
    if (xhr.getResponseHeader) {
        contentType = xhr.getResponseHeader("Content-Type");
    }

    if (!contentType || contentType.toLowerCase() === 'application/json' || contentType.toLowerCase() === 'text/json' || contentType.toLowerCase() === 'inode/symlink') {//application/json or inode/symlink  (AmazonS3 bug? )
        try {
            ret = JSON.parse(xhr.response);
        } catch (e) {
            console.error("Not a JSON!", xhr.response);
            ret = {data: xhr.response};
        }
    } else {
        ret = {data: xhr.response};
    }

    if (!ret.status) {
        ret.status = xhr.status;
    }
    //Some servers can answer status in JSON as "HTTP/1.1 200 OK"  but we need a status number
    if (typeof ret.status === 'string' && ret.status.indexOf("HTTP/") === 0 && ret.status.match( / (\d\d\d)/ )) {
        ret.status = parseInt(ret.status.match( / (\d\d\d)/ )[1]);//TODO check this code
    }


    if (!ret.statusText) {
        ret.statusText = xhr.statusText;
    }
    if (xhr.status && xhr.status != ret.status) {
        console.warn("Status from request %d, but response contains status %d", xhr.status, ret.status)
    }

    return ret;

};


module.exports = Ajax;

},{"../core/Events":5,"../helpers/LikeFormData":9,"../helpers/tools":11}],3:[function(require,module,exports){
"use strict";
var tools = require("../helpers/tools");
/**
 * This a base constructor (class) for any DOM based instance.
 * This constructor just grab all node attributes and generates options. All processed options stored at this.options
 * @example
 * We have html like this:
 * <div data-test="testValue" data-value="value123">.....</div>
 * this.options will be:
 * {
 *  test:"testValue",
 *  value:"value"
 * }
 * Note: data-test and data-value should be described in attributesToGrab
 * @constructor
 */
var BaseDOMConstructor = function () {
};
/**
 * Init method. Call after construct instance
 * @param {Object} spiral
 * @param {Object} node  DomNode of form
 * @param {Object} [options] all options to override default
 */
BaseDOMConstructor.prototype.init = function (spiral,node,options) {
    //TODO data-spiral-JSON
    this.options = tools.extend(this.getProcessedAttributes(node), this.getProcessedOptions(node));
    if (options) {//if we pass options extend all options by passed options
        this.options = tools.extend(this.options, options);
    }
    this.spiral = spiral;
    this.node = node;
};


/**
 * This is a attributes to grab from node. All child should have own list of attributesToGrab.
 * All options are optional. But recommended to provide value or processor to avoid error when dom node have no this attribute
 * @type {Object}
 * @property {Object} propertyKey - object of one attribute name
 * @property {String} propertyKey.value - default value (if attribute not provided this value will be returned
 * @property {String} propertyKey.key - key to return. If not provided will be use attribute of node ("propertyKey" in this case)
 * @property {Function} propertyKey.processor -  processor to process data before return
 * @property {Object}  ... - Another object of one property
 * @example
 * "data-some-attribute": {// attribute of node
 *      value: true,
 *      key: "someAttribute",
 *      processor: function (val, node, instance) {
 *          //some calculations
 *      return someValue;
 *      }
 *  },
 *  "data-another-attribute":{...},
 *  "..."
 *
 * @example
 * //Grab attribute "data-attribute" as "MyAttribute" if attribute not provided return "DefaultValue"
 * // Dom node <div data-attribute="someValue"></div>
 * "data-attribute": {
 *      value: "DefaultValue",
 *      key: "MyAttribute"
 *  }
 *  //after processing we should have
 *  {"MyAttribute":"someValue"}
 * @example
 * //Grab attribute "data-attribute" as "MyAttribute" and return some value instead
 * //Dom node  <div data-attribute="someValue"></div>
 * "data-attribute": {
 *      key: "MyAttribute"
 *      processor: function (val, node, instance) {
 *          return val+"SomeCalculation";
 *      }
 *  }
 *  //after processing we should have
 *  {"MyAttribute":"someValueSomeCalculation"}
 */
BaseDOMConstructor.prototype.attributesToGrab = {};
/**
 * This is a options to generate.
 * You should provide processor or value.
 * Key difference between attributesToGrab that optionsToProcess can generate some values (like init time, this reference, etc)
 * and this option is not depending on dom.
 * @type {Object}
 * @property {Object} propertyKey - object of property
 * @property {String} propertyKey.value - default value to return
 * @property {Function} propertyKey.processor -  processor to process data before return
 * @property {Object}  ... - Another object of one property
 * @example
 *  "context": {
 *      "processor": function (form) { //processor
 *          return form;
 *      }
 *  },
 *  "Another-key":{...},
 *  "..."
 *
 * @example
 * processAnswer: {
 *      "value": function (options) {
 *         return "someVal";
 *      }
 *  //after processing we should have
 *  {"processAnswer":function (options) {
 *         return "someVal";
 *      }
 *   }
 *
 * @example
 * initTime: {
 *      "processor": function (options) {
 *         return new Date().getTime;
 *      }
 *  //after processing we should have
 *  {"initTime":1429808977404}
 * @example
 * processAnswer: {
 *      "processor": function (options) {
 *         return "someVal";
 *      }
 *  //after processing we should have
 *  {"processAnswer":"someVal"}
 */
BaseDOMConstructor.prototype.optionsToProcess = {};

/**
 * Iterate over this.attributesToGrab and get processed attributes from node
 * @param {Object} node dom node to grab attributes
 * @returns {Object}
 */
BaseDOMConstructor.prototype.getProcessedAttributes = function (node) {
    var options = {},
        index,
        key,
        val;
    for (index in this.attributesToGrab) {// loop over attributesToGrab
        if (this.attributesToGrab.hasOwnProperty(index)) {//if this is own option
            key = (this.attributesToGrab[index].key) ? this.attributesToGrab[index].key : index; //detect key to object
            if (node.attributes.hasOwnProperty(index)) {// if node have this attribute
                val = node.attributes[index].value
            } else {// if node have NO this attribute
                val = null;
            }
            if (this.attributesToGrab[index].processor) {//if processor is available
                options[key] = this.attributesToGrab[index].processor(val, node, this);//call processor
            } else {
                options[key] = (val) ? val : this.attributesToGrab[index].value;//set value
            }
        }
    }
    return options;
};

/**
 * Iterate over this.optionsToProcess and get processed options
 * Process options and return results
 * @param {Object} node dom node
 */
BaseDOMConstructor.prototype.getProcessedOptions = function (node) {
    var options = {},
        index;
    for (index in this.optionsToProcess) {// loop over this.optionsToProcess
        if (this.optionsToProcess.hasOwnProperty(index)) {//if this is own option
            if (this.optionsToProcess[index].processor) {//if processor is available
                options[index] = this.optionsToProcess[index].processor.call(this, node);//call processor
            } else {
                options[index] = this.optionsToProcess[index].value;//set value
            }
        }
    }
    return options;
};
/**
 * Get addon for instance
 * @param {String} addonType type of addon (message,fill,etc)
 * @param {String} addonName name of addon
 */
BaseDOMConstructor.prototype.getAddon = function(addonType, addonName){
    return this.spiral.instancesController.getInstanceAddon(this.name, addonType, addonName);
};

module.exports = BaseDOMConstructor;

},{"../helpers/tools":11}],4:[function(require,module,exports){
"use strict";
/**
 * Dom mutation. Listening to the DOM and add or remove instances based on classes.
 * @param {Object} instancesController  spiral instancesController.
 * @param {Function} instancesController.getClasses  get all registered modules classes.
 * @param {Function} instancesController.addInstance  add instance method.
 * @param {Function} instancesController.removeInstance  remove instance method
 * @constructor
 */
var DomMutations = function (instancesController) {
    if (!instancesController){
        console.error("You should provide instancesController  for DOM Mutation. Because DOM Mutation  should known all classes and");
        return;
    }
    if (!this.constructor){
        console.error("Please call DomMutations with new  - 'new DomMutations()' ");
        return;
    }
    this.instancesController = instancesController;
    var config = {//config for MutationObserver
            attributes: true,
            childList: true,
            characterData: true,
            characterDataOldValue: true,
            subtree: true,
            attributeOldValue: true,
            attributeFilter: ["class"]
        },
        that = this;
    this.observer = new MutationObserver(function () {//call function when dom mutated.
        that.onDomMutate.apply(that, arguments)
    });
    this.observer.observe(document, config);//start observer

};
/**
 * When dom mutated this function id executed.
 * @param {Array} mutations array of mutations
 * @returns {boolean}
 */
DomMutations.prototype.onDomMutate = function (mutations) {
    var classArray = this.instancesController.getClasses();//get all registered classes
    var classSelector = "." + classArray.join(",.");//convert for querySelectorAll()
    if (classSelector.length === 1) {//if not registered any instanceTypes
        return false;
    }
    mutations.forEach(function (mutation) {//loop over mutation array
        switch (mutation.type) {
            case "attributes":
                this.processMutationAttributes(mutation, classArray);
                break;

            case "characterData":

                break;

            case "childList":
                this.processMutationChildList(mutation.addedNodes, "addInstance", classSelector, classArray);
                this.processMutationChildList(mutation.removedNodes, "removeInstance", classSelector, classArray);
                break;

            case "default":
                console.error("Something wrong. Contact tech support");
        }
    }, this);
    return true;
};



DomMutations.prototype.processMutationAttributes = function (mutation, classArray) {
    var that = this;
    var currentClasses = mutation.target.className.split(" "),
        oldClasses = (mutation.oldValue)?mutation.oldValue.split(" "):[],
        addedClasses = currentClasses.filter(function (val) {
            return (oldClasses.indexOf(val) === -1);
        }),
        removedClasses = oldClasses.filter(function (val) {
            return (currentClasses.indexOf(val) === -1);
        }),
        addedRegisteredClasses = addedClasses.filter(function (val) {
            return (classArray.indexOf(val) !== -1);
        }),
        removedRegisteredClasses = removedClasses.filter(function (val) {
            return (classArray.indexOf(val) !== -1);
        });
    removedRegisteredClasses.forEach(function (val) {
        that.instancesController.removeInstance(that.instancesController.getInstanceNameByCssClass(val), mutation.target);
    });
    addedRegisteredClasses.forEach(function (val) {
        that.instancesController.addInstance(that.instancesController.getInstanceNameByCssClass(val), mutation.target);
    });

};
/**
 * Process mutation on ChildList
 * @param {NodeList} nodesList array with nodes
 * @param {String} action action to call (add or remove nodes)
 * @param {String} classSelector - string selector for querySelectorAll
 * @param {Array} classArray - array of all registered classes
 */
DomMutations.prototype.processMutationChildList = function (nodesList, action, classSelector, classArray) {
    var that =this;
    /**
     * Internal function for checking node class
     * @param {Object} node dom node
     */
    function checkNode(node) {
        classArray.forEach(function (className) {//loop over registered classes
            if (node.classList.contains(className)) {//if class match try to add or remove instance for this node
                that.instancesController[action](that.instancesController.getInstanceNameByCssClass(className), node);
            }
        });
    }

    [].forEach.call(nodesList, function (val) {//loop over mutation nodes
        if (val.nodeType !== 1 || val.nodeName === "SCRIPT" || val.nodeName === "LINK") {//do not process other nodes then ELEMENT_NODE https://developer.mozilla.org/en-US/docs/Web/API/Node.nodeType also ignore SCRIPT and LINK tag
            return false;
        }
        checkNode(val);//check mutation node
        [].forEach.call(val.querySelectorAll(classSelector), checkNode);//query all nodes with required classes and check it
        return true;
    });

};

/**
 * Stop listening the dom changes
 */
DomMutations.prototype.stopObserve = function () {
    this.observer.disconnect();
};

module.exports = DomMutations;



},{}],5:[function(require,module,exports){
"use strict";

/**
 * Events system.
 * @param {Array} allowedEvents array of allowed events.
 * @constructs Events
 * @example
 * //allow to work with all events
 * var events = new Events();
 * events.on("myBestEvent",function(e){console.log(e)});
 * @example
 * //Allow to serve only limited events
 *  var events = new Events(["beforeSubmit","onDataReady"]);
 *  events.on("myBestEvent",function(e){console.log(e)});//will not works
 *  events.on("beforeSubmit",function(e){console.log(e)});//will work
 */
var Events = function (allowedEvents) {
    this._storage = {};
    this._allowedEvents = allowedEvents;
};

/**
 * Add event(s)
 * @param {String} events event or space separated event list
 * @param {Function} callback callback function
 * @example
 * var events = new Events();
 * events.on("myBestEvent myBestEvent2 myBestEvent3",function(e){console.log(e)});
 * events.on("myBestEvent",function(e){console.log(e)});
 */
Events.prototype.on = function (events, callback) {
    var eventArr = events.replace(/\s{2,}/g, " ").split(" ");
    eventArr.forEach(function(event){
        if (this._allowedEvents  && this._allowedEvents.indexOf(event) === -1){// event not inside allowed events
            console.warn("Events. Try to register event %s, but event is not allowed",event);
            return;
        }
        if (!this._storage.hasOwnProperty(events)) {
            this._storage[event] = [];
        }
        this._storage[event].push(callback);
    },this)

};
/**
 * Add action
 * @param {String} action
 * @param {Function} func
 * @deprecated  use "on" instead
 */
Events.prototype.registerAction = Events.prototype.on;


/**
 * remove event
 * @param {String} event
 * @param {Function} callback
 */
Events.prototype.off = function (event, callback) {
    alert("You try to remove action. This part is incomplete");
    //TODO
};

/**
 * Trigger event.
 * @param {String} event event name
 * @param {Object} [options] options to pass to the callback
 * @example
 * var events = new Events();
 * events.on("myBestEvent",function(e){console.log(e.bestKey)});
 * events.trigger("myBestEvent",{bestKey:42}); //will show in log
 */
Events.prototype.trigger = function (event, options) {
    if (this._allowedEvents  && this._allowedEvents.indexOf(event) === -1){// event not inside allowed events
        console.warn("Events. Try to trigger event %s, but event is not allowed",event);
        return;
    }
    if (this._storage.hasOwnProperty(event)) {
        for (var n = 0, l = this._storage[event].length; n < l; n++) {
            this._storage[event][n](options);
        }
    }
};

/**
 * Perform action
 * @param {String} action
 * @param {Object} [actionParams] object with all action data from server
 * @param {Object} [options] ajax options
 * @deprecated use "trigger" instead
 */
Events.prototype.performAction = Events.prototype.trigger;

module.exports = Events;
},{}],6:[function(require,module,exports){
"use strict";

/**
 * Instance controller
 * @param spiral
 * @constructor
 */
var InstancesController = function (spiral) {
    this.spiral = spiral;
    if (!this.constructor){
        console.error("Please call InstancesController with new  - 'new InstancesController()' ");
        return;
    }
    this._storage = {
        instancesConstructors: {
            cssClasses:{},
            jsConstructors:{}
        },
        addons: {},
        instances: {}
    };

    //todo decide if we need this
    //["onAddInstance", "onRemoveInstance"]
    //this.events = new spiral.modules.core.Events();
};
/**
 * Register new instance type
 * @param {Function} constructorFunction - constructor function of instance
 * @param {String} [cssClassName] - css class name of instance. If class not provided that it can't be automatically controlled by DomMutation. But you still can use it from JS.
 * @param {Boolean} [isSkipInitialization=false]  - skip component initialization, just adding, no init nodes.
 */
InstancesController.prototype.registerInstanceType = function (constructorFunction, cssClassName, isSkipInitialization) {
    var instanceName = constructorFunction.prototype.name;

    if (!instanceName){
        console.error("Instance constructor should have name inside it");
    }

    if (this._storage.instancesConstructors.jsConstructors.hasOwnProperty(instanceName)){
        console.error("Instance Constructor for type '%s' already added. Skipping",instanceName);
        return;
    }

    if (cssClassName){//add link (cssClassName->instanceName)
        this._storage.instancesConstructors.cssClasses[cssClassName] = instanceName;
    }

    this._storage.instancesConstructors.jsConstructors[instanceName] = constructorFunction;



    // if (this._storage.instancesConstructors.hasOwnProperty(className)){
    //    console.error("Instance Constructor for type %s already added. Skipping",constructorFunction.prototype.name);
    //    return;
    //}
    //this._storage.instancesConstructors[className] = {//init storage fields
    //    "typeName": constructorFunction.prototype.name,
    //    "constructor": constructorFunction
    //};
    this._storage.instances[instanceName] = [];
    if (!isSkipInitialization){
        var nodes = document.getElementsByClassName(cssClassName);//init add nodes with this class
        for (var i = 0, max = nodes.length; i < max; i++) {
            this.addInstance(instanceName, nodes[i]);
        }
    }

};

/**
 * Old method to register instance type
 * @param className
 * @param constructorFunction
 * @param isSkipInitialization
 * @deprecated
 */
InstancesController.prototype.addInstanceType =function(className,constructorFunction, isSkipInitialization){
    console.warn("addInstanceType is deprecated. Please use registerInstanceType instead");
    return this.registerInstanceType(constructorFunction, isSkipInitialization);
};


/**
 * Add instance
 * @param {String} instanceName - name of instance
 * @param {Object} node - dom node
 * @param {Object} [options] all options for send to the constructor
 * @returns {boolean}
 */
InstancesController.prototype.addInstance = function (instanceName, node, options) {
    var instanceConstructor = this._storage.instancesConstructors.jsConstructors[instanceName],
        isAlreadyAdded = this.getInstance(instanceName,node);
    if (!instanceConstructor || isAlreadyAdded) {//if not found this type  or already added - return
        return false;
    }
//    console.log("Adding instance for type -",instanceName,". Node - ",node);
    var instance = new instanceConstructor(this.spiral,node, options);
    this._storage.instances[instanceName].push({//add new instance of this type
        "node": node,
        "instance": instance
    });

    //this.events.trigger("onAddInstance", instance);

    return instance;
};
/**
 * Remove instance.
 * @param {String} instanceName - name of instance class
 * @param {Object|String} node - dom node ID
 * @returns {boolean}
 */
InstancesController.prototype.removeInstance = function (instanceName, node) {
    var instanceObj = this.getInstance(instanceName, node,true),
        key;
    if (!instanceObj) {
        return false;
    }
    instanceObj.instance.die();//avoid memory leak
    key = this._storage.instances[instanceName].indexOf(instanceObj);
    if (key !== -1){//remove key
        this._storage.instances[instanceName].splice(key, 1);
    }
    return true;
};
/**
 * Get instance. Return instance object of this dom node
 * @param {String} instanceName - name of instance
 * @param {Object|String} node - dom node o dome node ID
 * @param {boolean} [isReturnObject] - return object or instance
 * @returns {boolean}
 */
InstancesController.prototype.getInstance = function (instanceName, node, isReturnObject) {//TODO isReturnObject not needed. Refactor and remove
    var typeArr = this._storage.instances[instanceName],
        ret = false;
    if (!typeArr) {
        return false;
    }
    node = (node instanceof HTMLElement) ? node : document.getElementById(node);
    if (!node) {
        return false;
    }
    for (var key = 0, l = typeArr.length; key < l; key++) {//iterate storage and try to find instance
        if (typeArr[key].node === node) {
            ret = (isReturnObject) ? typeArr[key] : typeArr[key].instance;
            break;
        }
    }
    return ret;
};

/**
 * Register addon for instance
 * @param {Function|Object} addon
 * @param {String} instanceName name of instance to register addon
 * @param {String} addonType type of addon (message,fill,etc)
 * @param {String} addonName name of addon (spiral, bootstrap,etc)
 */
InstancesController.prototype.registerAddon = function(addon, instanceName, addonType, addonName){
    if (!this._storage.addons.hasOwnProperty(instanceName)){
        this._storage.addons[instanceName] = {};
    }
    if (!this._storage.addons[instanceName].hasOwnProperty(addonType)){
        this._storage.addons[instanceName][addonType] = {};
    }
    if (this._storage.addons[instanceName][addonType].hasOwnProperty(addonName)){
        console.error("The %s addon type %s already registered for instance %s! Skipping registration.",addonName,addonType,instanceName);
        return;
    }
    this._storage.addons[instanceName][addonType][addonName]= addon;

};

/**
 * Get registered addon
 * @param {String} instanceName name of instance to register addon
 * @param {String} addonType type of addon (message,fill,etc)
 * @param {String} addonName name of addon (spiral, bootstrap,etc)
 */
InstancesController.prototype.getInstanceAddon =function(instanceName, addonType, addonName){
    if (!this._storage.addons.hasOwnProperty(instanceName) || !this._storage.addons[instanceName].hasOwnProperty(addonType) || !this._storage.addons[instanceName][addonType].hasOwnProperty(addonName)){
        return false;
    }
    return this._storage.addons[instanceName][addonType][addonName];
};


/**
 * Get all registered classes
 * @returns {Array}
 */
InstancesController.prototype.getClasses = function (){
    return Object.keys(this._storage.instancesConstructors.cssClasses);
};

/**
 * For given cssClass return name of instance
 * @param {String} cssClass
 * @return {*}
 */
InstancesController.prototype.getInstanceNameByCssClass = function(cssClass){
    return this._storage.instancesConstructors.cssClasses[cssClass];
};

/**
 * Get constructor by name or class name
 * @returns
 */
InstancesController.prototype.getInstanceConstructors = function (name){

   //TODO
};




module.exports = InstancesController;




},{}],7:[function(require,module,exports){
"use strict";

/**
 * This plugin adds ability to perform actions from the server.
 * "action":"reload"
 * "action":{"redirect":"/account"}
 * "action":{"redirect":"/account","delay":3000}
 * "action":{"name":"redirect","url":"/account","delay":3000}
 */
(function (sfAjax) {

    sfAjax.events.on('load', function (options) {
        var response = options.response;
        if (response.hasOwnProperty('action')) {
            if (typeof response.action === 'string') {//"action":"reload"
                sfAjax.actions.trigger(response.action);
            } else if (typeof response.action === 'object') {
                var keys = Object.keys(response.action);
                if (keys.length === 1) {//"action":{"redirect":"/account"}
                    sfAjax.actions.trigger(keys[0], response.action[keys[0]], options);
                } else if (keys.length === 2 && response.action.delay) {//"action":{"redirect":"/account","delay":3000}
                    setTimeout(function () {
                        var action = keys.filter(function (value) {
                            return value !== 'delay';
                        })[0];
                        sfAjax.actions.trigger(action, response.action[action], options);
                    }, +response.action.delay);
                } else if (keys.length > 1) {//"action":{"name":"redirect","url":"/account","delay":3000}
                    setTimeout(function () {
                        sfAjax.actions.trigger(response.action.name, response.action, options);
                    }, +response.action.delay || 0);
                } else {
                    console.error("Action from server. Object doesn't have keys. ", response.action);
                }
            } else {
                console.error("Action from server. Something wrong. ", response.action);
            }
        }
    });

    sfAjax.actions = new sf.modules.core.Events();

    sfAjax.actions.on("redirect", function (action) {
        var url = Object.prototype.toString.call(action) === "[object String]" ? action : action.url;
        //http://stackoverflow.com/questions/10687099/how-to-test-if-a-url-string-is-absolute-or-relative
        window.location[/^(?:[a-z]+:)?\/\//i.test(url) ? 'href' : 'pathname'] = url;
    });

    sfAjax.actions.on('reload', function () {
        location.reload();
    });

    sfAjax.actions.on('refresh', function () {
        sfAjax.actions.trigger('reload');
    });

    sfAjax.actions.on('close', function () {
        window.close();
    });

})(sf.ajax);
},{}],8:[function(require,module,exports){
"use strict";
/**
 * Helper to manipulate DOM Events. It's a simple wrapper around "addEventListener" but it's store all functions and allow us to remove it all.
 * It's very helpful for die() method of instances
 * @TODO add to many nodes
 * @TODO new method like addEventListener  DOMEvents.on(node(s),event,callback,useCapture);
 * @constructor
 */
var DOMEvents = function(){
    /**
     * Internal storage for events
     * @property {Array.<Object>} DOMEvents - dom events array
     * @property {Object} DOMEvents.DOMNode -   DOM node
     * @property {String} DOMEvents.eventType -   Event type
     * @property {Function} DOMEvents.eventFunction -   Function
     * @property {Boolean} DOMEvents.useCapture=false -   useCapture
     * @property {Object} ... -   another object
     * @private
     */
    this._DOMEventsStorage = [];
};
/**
 * Add event(s) to node(s).
 * @TODO add to many nodes
 * @param {Array.<Object>|Object} eventArray - event array or event itself
 * @param {Object} eventArray.DOMNode -   DOM node
 * @param {String} eventArray.eventType -   Event type
 * @param {Function} eventArray.eventFunction -   Function
 * @param {Boolean} [eventArray.useCapture=false] -   useCapture
 * @example
 * var DOMEventsInstance = new DOMEvents();
 * var eventOne = {
 *      DOMNode: document.getElementById("example"),
 *      eventType: "click",
 *      eventFunction: function (e) {
 *          console.log("Hi there. Native  DOM events is:",e);
 *      }
 * }
 *  var eventTwo = {
 *      DOMNode: document.getElementById("example2"),
 *      eventType: "mousedown",
 *      eventFunction: function (e) {
 *          console.log("Hi there. mousedown event. Native  DOM events is:",e);
 *      }
 * }
 *  DOMEventsInstance.add([eventOne,eventTwo]);
 */
DOMEvents.prototype.add = function(eventArray){
    if (Object.prototype.toString.call([]) !== "[object Array]"){
        eventArray = [eventArray];
    }
    eventArray.forEach(function(val){
        val.useCapture=!!(val.useCapture);
        val.DOMNode.addEventListener(val.eventType,val.eventFunction,val.useCapture);
        this._DOMEventsStorage.push(val);
    },this)
};
/**
 * Remove events
 * @param {Array.<Object>} eventArray - event array
 * @param {Object} eventArray.DOMNode -   DOM node
 * @param {String} eventArray.eventType -   Event type
 * @param {Function} eventArray.eventFunction -   Function
 * @param {Boolean} [eventArray.useCapture=false] -   useCapture
 */
DOMEvents.prototype.remove = function(eventArray){
//TODO IMPLEMENT
    // TODO не уверен что этот метод необходим. если надо часто убирать какието обработчики, то лучше поставить обработчки на родителя
    console.warn("TODO IMPLEMENT");

};
/**
 * Remove all dom events registered with this instance (added by method add)
 * @example
 * //look at add method as first part of this code
 * DOMEventsInstance.removeAll();
 */
DOMEvents.prototype.removeAll = function(){
    this._DOMEventsStorage.forEach(function(val){
        val.DOMNode.removeEventListener(val.eventType,val.eventFunction,val.useCapture);
    });
    this._DOMEventsStorage=[];
};

module.exports = DOMEvents;
},{}],9:[function(require,module,exports){
"use strict";

/**
 * This object try to be easy as FormData.
 * Please note this is not(!) a shim for Form data, because it's impossible (you should set headers for Ajax by hands)
 * It take object and can convert it string like FormData do. Then you can send this string by Ajax or do some other staff.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FormData
 * @param {Object} [data] object with data (supports nested objects)
 * @param {String} [boundary] boundary  for Form Data
 * @constructor
 * @example
 * var formData = new LikeFormData({testKey:"testValue"},"testBoundary");
 * formData.toString();
 * // Returns:
 * //"--testBoundary
 * //Content-Disposition: form-data; name=testKey
 * //
 * // testValue
 * //--testBoundary--
 * //"
 *
 * @example
 * var formData = new LikeFormData({testKey:"testValue"});
 * formData.toString();
 * // Returns:
 * //"--SpiralFormData-4935309085994959
 * //Content-Disposition: form-data; name=testKey
 * //
 * // testValue
 * //--SpiralFormData-4935309085994959--
 * //"
 *
 * @example
 * var formData = new LikeFormData({testKey:"testValue"});
 * formData.append("key2","val2");
 * formData.toString();
 * // Returns:
 * //--SpiralFormData-988681384595111
 * //Content-Disposition: form-data; name=testKey
 * //
 * //testValue
 * //--SpiralFormData-988681384595111
 * //Content-Disposition: form-data; name=key2
 * //
 * //val2
 * //--SpiralFormData-988681384595111--
 * //"
 */
var LikeFormData = function (data, boundary) {
    this.data = {};
    if (data) {
        if (Object.prototype.toString.call(data) !== "[object Object]") {//non object/ Alert developer
            console.warn("LikeFormData can't accept non Object. Please reefer to documentation. Problem parameter is:", data);
        } else {
            this.data = data;
        }
    }
    this.boundary = (boundary) ? boundary : ("SpiralFormData-" + Math.random().toString().substr(2));


    //if (!isOldIE) {
    //    this.boundary = "SpiralAjax-" + Math.random().toString().substr(2);
    //    //xhr.setRequestHeader("content-type", "multipart/form-data; charset=utf-8; boundary=" + this.boundary);
    //} else {
    //    this.boundary = "SpiralAjax-oldIE9876gsloiHGldowu";
    //}

};
/**
 * Append data to storage. Like standart FormData do.
 * @param {String} key
 * @param {String} val
 * @example
 * var formData = new FormData();
 * formData.append("key2","val2");
 */
LikeFormData.prototype.append = function (key, val) {
    //https://developer.mozilla.org/en-US/docs/Web/API/FormData
    //TODO ***Appends a new value**** onto an existing key inside a FormData object, or adds the key if it does not already exist.
    this.data[key] = val;
};

/**
 * convert to string
 * @example
 * var formData = new LikeFormData({testKey:"testValue"});
 * formData.toString();
 * // Returns:
 * //"--SpiralFormData-4935309085994959
 * //Content-Disposition: form-data; name=testKey
 * //
 * // testValue
 * //--SpiralFormData-4935309085994959--
 * //"
 */
LikeFormData.prototype.toString = function () {
    var retString = "";
    var boundary = this.boundary;
    var iterate = function (data, partOfKey) {
        for (var key in data) {
            if (data.hasOwnProperty(key) && (typeof data[key] !== "undefined" )) {
                if (typeof data[key] === "object") {
                    iterate(data[key], ((partOfKey.length === 0) ? key : (partOfKey + "[" + key + "]")));
                } else {
                    retString += "--" + boundary
                        + "\r\nContent-Disposition: form-data; name=" + ((partOfKey.length === 0) ? key : (partOfKey + "[" + key + "]"))
                        + "\r\n\r\n" + data[key] + "\r\n";
                }
            }
        }
    };
    if (typeof this.data !== "object") {
        this.data = {
            data: this.data
        }
    }
    iterate(this.data, "");


    retString += "--" + this.boundary + "--\r\n";
    return retString;
};

/**
 * The delete() method of the FormData interface deletes a key/value pair from a FormData object.
 * @param key
 */
LikeFormData.prototype.delete = function (key) {
    return delete(this.data[key]);
};


/**
 *The get() method of the FormData interface returns the first value associated with a given key from within a FormData object.
 * @param key
 */
LikeFormData.prototype.get = function (key) {
    return this.data[key];
};
/**
 *The getAll() method of the FormData interface returns the first value associated with a given key from within a FormData object.
 */
LikeFormData.prototype.getAll = function () {
    return this.data;
};

/**
 * The has() method of the FormData interface returns a boolean stating whether a FormData object contains a certain key/value pair.
 * @param key
 */
LikeFormData.prototype.has = function(key){
    return this.data.hasOwnProperty(key);
};

/**
 * The difference between set() and FormData.append is that if the specified header does already exist, set() will overwrite the existing value with the new one, whereas FormData.append will append the new value onto the end of the set of values.
 * @param val
 */
LikeFormData.prototype.set = function(val){
    this.data[key] = val;
};

/**
 * Get content header to set for Ajax. Not a part of standart FormData object. But for sending Like FormData over Ajax you should know header.
 * @return {string}
 * @example
 * var formData = new LikeFormData();
 * formData.getContentTypeHeader(); //return "multipart/form-data; charset=utf-8; boundary=SpiralFormData-988681384595111"
 * @example
 * var formData = new LikeFormData({key:"val2"},"testBoundary");
 * formData.getContentTypeHeader(); //return "multipart/form-data; charset=utf-8; boundary=testBoundary"
 */
LikeFormData.prototype.getContentTypeHeader = function () {
    return "multipart/form-data; charset=utf-8; boundary=" + this.boundary;

};


module.exports = LikeFormData;
},{}],10:[function(require,module,exports){
/**
 This is a collection of useful DOM tools.
 */

module.exports = {

    /**
     * Found first parent node with matched selector(s)
     * @param {Object} elem - dom node
     * @param {String|Array} selectors - selector or array of selectors
     * @returns {Object| Boolean} - node or false
     */

    closest: function (elem, selectors) {
        selectors = (typeof selectors === 'string') ? [selectors] : selectors;
        var key,
            l = selectors.length,
            matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;
        while (elem && elem.parentNode) {
            for (key = 0; key < l; key++) {
                if (matchesSelector.call(elem, selectors[key])) {
                    return elem;
                }
            }
            elem = elem.parentNode;
        }
        return false;
    },
    /**
     * Found first parent node with matched className(s).
     * TODO Why this? Because old IE....
     * TODO It's not good, because it's a copy of closest @see closest. Refactor
     * @param {Object} elem - dom node
     * @param {String|Array} className - className or array of classNames
     * @returns {Object| Boolean} - node or false
     */

    closestByClassName: function (elem, className) {
        className = (typeof className === 'string') ? [className] : className;
        var key,
            l = className.length;
        //,matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;
        while (elem && elem.parentNode) {
            for (key = 0; key < l; key++) {
                var reg = new RegExp("(\\s|^)" + className[key] + "(\\s|$)");
                if (elem.className.match(reg)) {
                    return elem;
                }
            }
            elem = elem.parentNode;
        }
        return false;
    }
};
},{}],11:[function(require,module,exports){
"use strict";

/**
 * @module tools
 * @namespace
 */
var tools = {
    /**
     * Merge multiple object into one object. Method will iterate over arguments and on conflict (key already exist in object) key will be overwrite
     * @param {Array} arguments
     * @param {Object} arguments.0 first object to merge
     * @param {Object} arguments.1 second object to merge
     * @param {Object} arguments.n n object to merge
     * @returns {Object}
     * @example
     * var obj1 = {
     *      key1:1
     * }
     * var obj2 = {
     *      key2:2
     * }
     * extend(obj1,obj2);  //return object {key1:1,key2:2}
     * @example
     * var obj1 = {
     *      key:1
     * }
     * var obj2 = {
     *      key:2
     * }
     * extend(obj1,obj2);  //return object {key:2}
     * @example
     * var obj1 = {
     *      key:1
     * }
     * var obj2 = {
     *      key:2
     * }
     * var obj3 = {
     *      key3:3
     * }
     * extend(obj1,obj2,obj3);  //return object {key:2,key3:3}
     *
     */
    extend: function () {
        var retObj = {};
        var attribute;
        for (var n = 0; n < arguments.length; n++) {
            if (Object.prototype.toString.call(arguments[n]) !== "[object Object]") {
                console.warn("Merging allowed only for objects. Passed value:", arguments[n]);
                continue;
            }
            for (attribute in arguments[n]) {
                retObj[attribute] = arguments[n][attribute];
            }
        }
        return retObj;
    }

};

module.exports = tools;
},{}],12:[function(require,module,exports){
"use strict";
//todo comment all of this
//todo ask @Systerr the reason of variable 'prefix'
(function (sf) {
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

            var partOfSelector = (prefix) ? prefix + "[" + name + "]" : name,
                type = Object.prototype.toString.call(names[name]),
                selector = "[name='" + partOfSelector + "']";
            switch (type) {
                case '[object Object]':
                    findNodes(context, names[name], callback, partOfSelector);//call recursive
                    break;
                case '[object Array]':
                    names[name].forEach(function (el) {
                        "use strict";
                        //TODO refactor this should call recursive
                        var sel = "[name='" + partOfSelector + "[]']" + "[value='" + el + "']";
                        var nodes = context.querySelectorAll(sel);
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
                    var nodes = context.querySelectorAll(selector);
                    if (nodes.length === 0) {
                        console.warn(selector, " not found");
                        var obj = {};
                        obj[partOfSelector] = names[name];
                        notFound.push(obj);
                    }
                    for (var i = 0, max = nodes.length; i < max; i++) {
                        callback(nodes[i], names[name]);
                    }
                    break;

                default :
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
    sf.modules.helpers.tools.iterateInputs = function (context, names, callback, prefix) {
        notFound = [];
        findNodes(context, names, callback, prefix);
        if (notFound.length !== 0) {
            console.log("Some element not found in form", notFound);
        }
        return notFound;
    };

})(sf);
},{}],13:[function(require,module,exports){
"use strict";

(function(sf){

    /**
     * Spiral Forms
     * @param {Object} spiral
     * @param {Object} node  DomNode of form
     * @param {Object} [options] all options to override default
     * @constructor
     * @extends BaseDOMConstructor
     */
    var Form = function (spiral, node, options) {
        this._construct(spiral, node, options);
    };


    /**
     * @lends spiral.Form.prototype
     */
    Form.prototype = Object.create(sf.modules.core.BaseDOMConstructor.prototype);

    /**
     * Name to register
     * @type {string}
     */
    Form.prototype.name = "form";

    /**
     * Function that call on new instance is created.
     * @param {Object} spiral
     * @param {Object} node  DomNode of form
     * @param {Object} [options] all options to override default
     * @private
     */
    Form.prototype._construct = function(spiral, node, options){
        this.init(spiral, node, options);//call parent

        if (this.options.fillFrom) {//id required to fill form
            this.fillFieldsFrom();
        }
        /**
         * @extends DOMEvents
         * @type {DOMEvents}
         * @inheritDoc
         * */
        this.DOMEvents = new this.spiral.modules.helpers.DOMEvents();
        this.addEvents();

        this.events = new this.spiral.modules.core.Events(["onBeforeSend", "onSuccess", "onError", "onAlways"]);
    };
    /**
     * @override
     * @inheritDoc
     * @enum {Object}
     */
    Form.prototype.optionsToProcess = {
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
        }
    };

    /**
     * @override
     * @inheritDoc
     * @enum {String}
     */
    Form.prototype.attributesToGrab = {//option to grab from forms
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
         *
         */
        "data-messagesType": {
            "value": "spiral",
            "key": "messagesType"
        },
        /**
         * Position for the message. bottom || top || selector <b>Default: "bottom"</b>
         */
        "data-messagePosition": {
            "value": "bottom",
            "key": "messagePosition"
        },
        /**
         * Position of the inputs messages. bottom || top || selector <b>Default: "bottom"</b>
         */
        "data-messagesPosition": {
            "value": "bottom",
            "key": "messagesPosition"
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
        }
    };


    /**
     * Call on form submit
     * @param {Event} e submit event
     */
    Form.prototype.onSubmit = function (e) {
        if (this.spiral.instancesController.getInstance('lock',this.node)){//on lock we should'n do any actions
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        this.processMessages(true);

        this.options.data = this.getFormData();

        // We can send files only with FormData
        // If form contain files and no FormData than disable ajax
        if (!window.FormData && this.options.context.querySelectorAll("input[type='file']").length !== 0) {
            this.options.useAjax = false;
        }

        //spiral.events.performAction("beforeSubmit", this.options);
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
        if (!this.options.lockType || this.options.lockType === 'none'){
            return;
        }
        if (remove){
            if (!this.spiral.instancesController.removeInstance("lock",this.node)){
                console.warn("You try to remove 'lock' instance, but it is not available or not started");
            }
        } else {
            if (!this.spiral.instancesController.addInstance("lock",this.node,{type:this.options.lockType})){
                console.warn("You try to add 'lock' instance, but it is not available or already started");
            }
        }
    };

    /**
     * Shows or clears messages (errors).
     * @param {Object|Boolean} [answer]
     */
    Form.prototype.processMessages = function (answer) {
        if (!this.options.messagesType || !this.getAddon('formMessages', this.options.messagesType)) {
            return;
        }

        if (Object.prototype.toString.call(answer) === "[object Object]") {
            this.getAddon('formMessages', this.options.messagesType).show(this.options, answer);
        } else {
            this.getAddon('formMessages', this.options.messagesType).clear(this.options);
        }
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
            if (typeof(fn) === "function") {
                fn.call(sendOptions);
            }
        }

        sendOptions.headers = {//todo Probably we need to move this into defaults.
            Accept: "application/json"
        };

        this.spiral.ajax.send(sendOptions).then(
            function(answer){
                that.events.trigger("onSuccess", sendOptions);
                return answer;
            },
            function(error){
                that.events.trigger("onError", sendOptions);
                return error;
            }).then(function(answer){
                that.lock(true);
                that.processMessages(answer);
                that.events.trigger("onAlways", sendOptions);
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
        this.options = this.spiral.modules.tools.extend(this.options, opt);
    };

    /**
     * Add all events for forms
     */
    Form.prototype.addEvents = function () {
        var that = this;
        this.DOMEvents.add([
            {
                DOMNode: this.options.context,
                eventType: "submit",
                eventFunction: function (e) {
                    that.onSubmit.call(that, e)
                }
            }
        ]);
    };

    /**
     * Clear all variables and die
     */
    Form.prototype.die = function () {
        this.DOMEvents.removeAll();
        //todo don't we need to remove it's addons and plugins?
    };

    /**
     * Register form
     */
    sf.instancesController.registerInstanceType(Form,"js-sf-form");

})(spiralFrontend);



},{}],14:[function(require,module,exports){
"use strict";


(function (sf) {
    /**
     * Closes form's main message.
     */
    function closeMessage() {
        this.removeEventListener("click", closeMessage);
        var alert = this.parentNode;
        alert.parentNode.removeChild(alert);
    }

    /**
     * Shows individual message for the form.
     * @param {Object} formOptions
     * @param {String} formOptions.messagePosition
     * @param {Node} formOptions.context
     * @param {String} type
     * @param {String} message
     */
    function showMessage(formOptions, message, type) {
        var alert, msg, close, parent;

        alert = document.createElement("div");
        alert.className = "alert form-msg " + type;

        msg = document.createElement("div");
        msg.className = "msg";
        msg.innerHTML = message;

        close = document.createElement("button");
        close.className = "btn-close";
        close.setAttribute("type", "button");
        close.textContent = "×";

        alert.appendChild(close);
        alert.appendChild(msg);

        if (formOptions.messagePosition === "bottom") {
            parent = formOptions.context;
            parent.appendChild(alert);
        } else if (formOptions.messagePosition === "top") {
            parent = formOptions.context;
            parent.insertBefore(alert, parent.firstChild);
        } else {
            parent = document.querySelector(formOptions.messagePosition);
            parent.appendChild(alert)
        }

        close.addEventListener("click", closeMessage);
    }

    /**
     * Shows messages for inputs.
     * @param {Object} formOptions
     * @param {String} formOptions.messagesPosition
     * @param {Node} formOptions.context
     * @param {Object} messages
     * @param {String} [type]
     */
    function showMessages(formOptions, messages, type) {
        var notFound = sf.modules.helpers.tools.iterateInputs(formOptions.context, messages, function (el, msg) {
            var group = sf.modules.helpers.domTools.closest(el, ".item-form");
            if (!group) return;
            group.classList.add(type);

            var msgEl = document.createElement("span");
            msgEl.className = "msg";
            msgEl.innerHTML = msg;

            if (formOptions.messagesPosition === "bottom") {
                group.appendChild(msgEl);
            } else if (formOptions.messagesPosition === "top") {
                group.insertBefore(msgEl, group.firstChild);
            } else {
                var parent = group.querySelector(formOptions.messagesPosition);
                parent.appendChild(msgEl)
            }
        });

        //todo data-sf-message for notFound
    }


    var spiralMessages = {
        /**
         * Adds form's main message, input's messages, bootstrap-like classes has-... to form-groups.
         * @param {Object} formOptions
         * @param {Object} answer
         * @param {Object|String} [answer.message]
         * @param {String} [answer.message.type]
         * @param {String} [answer.message.text]
         * @param {String} [answer.error]
         * @param {String} [answer.warning]
         * @param {Object} [answer.messages]
         * @param {Object} [answer.errors]
         * @param {Object} [answer.warnings]
         */
        show: function (formOptions, answer) {
            if (!answer) return;
            var isMsg = false;
            //if (formOptions.context.getElementsByClassName("alert").length > 0) {
            //    this.clear(formOptions);//todo we really need to clear here? form clears onSubmit
            //}

            if (answer.message) {
                showMessage(formOptions, answer.message.text || answer.message, answer.message.type || "success");
                isMsg = true;
            }
            if (answer.error) {
                showMessage(formOptions, answer.error, "error");
                isMsg = true;
            }
            if (answer.warning) {
                showMessage(formOptions, answer.warning, "warning");
                isMsg = true;
            }
            if (answer.messages) {
                showMessages(formOptions, answer.messages, "success");
                isMsg = true;
            }
            if (answer.errors) {
                showMessages(formOptions, answer.errors, "error");
                isMsg = true;
            }
            if (answer.warnings) {
                showMessages(formOptions, answer.warnings, "warning");
                isMsg = true;
            }
            if (!isMsg) {
                var error = answer.status ? answer.status + " " : "";
                error += answer.statusText ? answer.statusText : "";
                error += answer.data && !answer.statusText ? answer.data : "";
                error += error.length === 0 ? answer : "";
                showMessage(formOptions, error, "error");
            }
        },
        /**
         * Removes form's main message, input's messages, bootstrap classes has-... from form-groups.
         * @param {Object} formOptions
         * @param {String} formOptions.messagePosition
         * @param {Node} formOptions.context
         */
        clear: function (formOptions) {
            var msg, i, l, item;
            if (formOptions.messagePosition === "bottom" || formOptions.messagePosition === "top") {
                msg = formOptions.context.getElementsByClassName("form-msg")[0];
            } else {
                msg = document.querySelector(formOptions.messagePosition + ">.form-msg");
            }
            if (msg) {
                msg.getElementsByClassName("btn-close")[0].removeEventListener("click", closeMessage);
                msg.parentNode.removeChild(msg);
            }

            var alerts = formOptions.context.querySelectorAll(".item-form>.msg");//Remove all messages
            for (i = 0, l = alerts.length; i < l; i++) {
                item = alerts[i].parentNode;
                item.removeChild(alerts[i]);
                item.classList.remove("error", "success", "warning", "info");
            }
        }
    };


    /**
     * Register addon
     */
    sf.instancesController.registerAddon(spiralMessages, "form", "formMessages", "spiral");

})(spiralFrontend);
},{}],15:[function(require,module,exports){
"use strict";

(function(sf) {
    /**
     * Spiral lock for forms
     * @constructor lock
     */

    var Lock = function(spiral, node, options){
        this._construct(spiral, node, options);
    };

    /**
     * @lends Lock.prototype
     */
    Lock.prototype = Object.create(sf.modules.core.BaseDOMConstructor.prototype);

    /**
     * Name of module
     * @type {string}
     */
    Lock.prototype.name = "lock";

    /**
     * Function that call on new instance is created.
     * @param {Object} spiral
     * @param {Object} node  DomNode of form
     * @param {Object} [options] all options to override default
     * @private
     */
    Lock.prototype._construct = function(spiral, node, options){
        this.init(spiral, node, options);//call parent
        this.add(this.options.type,this.node);
    };
    /**
     * Add lock
     * @param {String} [type] type of lock @see spiral.lock.types
     * @param {Object} context context to add lock
     * @returns {Function|*}
     */
    Lock.prototype.add =function(type, context){
        if (!this.types.hasOwnProperty(type)){
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
    Lock.prototype.remove = function(){
        this.node.classList.remove("locked");
        var spiralLock = this.node.querySelector(".js-sf-lock");//todo this.lockNode ?
        if (spiralLock) {
            this.node.removeChild(spiralLock);
        }
        return true;
    };
    /**
     * Object with lock types.
     * @enum {Object}
     */
    Lock.prototype.types  = {
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
            progress: function (current, total) {
                var progress = this.context.getElementsByClassName("progress-line")[0];
                progress.style.width = 100 * (current / total) + "%";
            }
        }
    };

    //we have to have some default locker, let it be spinner
    Lock.prototype.types.default = Lock.prototype.types.spinner;

    /**
     * Register lock
     */
    sf.instancesController.registerInstanceType(Lock);

})(spiralFrontend);

},{}],16:[function(require,module,exports){
/**
 * Avoid `console` errors in browsers that lack a console.
 */
(function () {
    var method, noop = function () {
        },
        methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ],
        length = methods.length,
        console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

},{}],17:[function(require,module,exports){
/*! github.com/serbanghita/formToObject.js 1.0.1  (c) 2013 Serban Ghita <serbanghita@gmail.com> @licence MIT */

(function(){

    // Constructor.
	var formToObject = function( formRef ){

		if( !formRef ){ return false; }

		this.formRef       = formRef;
		this.keyRegex      = /[^\[\]]+/g;
		this.$form         = null;
		this.$formElements = [];
		this.formObj       = {};

		if( !this.setForm() ){ return false; }
		if( !this.setFormElements() ){ return false; }

		return this.setFormObj();

	};

	// Set the main form object we are working on.
	formToObject.prototype.setForm = function(){

		switch( typeof this.formRef ){

			case 'string':
				this.$form = document.getElementById( this.formRef );
			break;

			case 'object':
				if( this.isDomNode(this.formRef) ){
					this.$form = this.formRef;
				}
			break;

		}

		return this.$form;

	};

	// Set the elements we need to parse.
	formToObject.prototype.setFormElements = function(){
		this.$formElements = this.$form.querySelectorAll('input, textarea, select');
		return this.$formElements.length;
	};

	// Check to see if the object is a HTML node.
	formToObject.prototype.isDomNode = function( node ){
		return typeof node === "object" && "nodeType" in node && node.nodeType === 1;
	};

	// Iteration through arrays and objects. Compatible with IE.
	formToObject.prototype.forEach = function( arr, callback ){

		if([].forEach){
			return [].forEach.call(arr, callback);
		}

		var i;
		for(i in arr){
			// Object.prototype.hasOwnProperty instead of arr.hasOwnProperty for IE8 compatibility.
			if( Object.prototype.hasOwnProperty.call(arr,i) ){
				callback.call(arr, arr[i]);
			}
		}

		return;

	}

    // Recursive method that adds keys and values of the corresponding fields.
	formToObject.prototype.addChild = function( result, domNode, keys, value ){

		// #1 - Single dimensional array.
		if(keys.length === 1){

			// We're only interested in the radio that is checked.
			if( domNode.nodeName === 'INPUT' && domNode.type === 'radio' ) {
				if( domNode.checked ){
					return result[keys] = value;
				} else {
					return;
				}
			}

			// Checkboxes are a special case. We have to grab each checked values
			// and put them into an array.
			if( domNode.nodeName === 'INPUT' && domNode.type === 'checkbox' ) {

				if( domNode.checked ){

					if( !result[keys] ){
						result[keys] = [];
					}
					return result[keys].push( value );

				} else {
					return;
				}

			}

			// Multiple select is a special case.
			// We have to grab each selected option and put them into an array.
			if( domNode.nodeName === 'SELECT' && domNode.type === 'select-multiple' ) {

				result[keys] = [];
				var DOMchilds = domNode.querySelectorAll('option[selected]');
				if( DOMchilds ){
					this.forEach(DOMchilds, function(child){
						result[keys].push( child.value );
					});
				}
				return;

			}

			// Fallback. The default one to one assign.
			result[keys] = value;

		}

		// #2 - Multi dimensional array.
		if(keys.length > 1) {

			if(!result[keys[0]]){
				result[keys[0]] = {};
			}

			return this.addChild(result[keys[0]], domNode, keys.splice(1, keys.length), value);

		}

		return result;

	};

	formToObject.prototype.setFormObj = function(){

		var test, i = 0;

		for(i = 0; i < this.$formElements.length; i++){
			// Ignore the element if the 'name' attribute is empty.
			// Ignore the 'disabled' elements.
			if( this.$formElements[i].name && !this.$formElements[i].disabled ) {
				test = this.$formElements[i].name.match( this.keyRegex );
				this.addChild( this.formObj, this.$formElements[i], test, this.$formElements[i].value );
			}
		}

		return this.formObj;

	}

	// AMD/requirejs: Define the module
	if( typeof define === 'function' && define.amd ) {
		define(function () {
			return formToObject;
		});
	}
	// Browser: Expose to window
	else {
		window.formToObject = formToObject;
	}

})();

},{}]},{},[1])
//# sourceMappingURL=sf.js.map
