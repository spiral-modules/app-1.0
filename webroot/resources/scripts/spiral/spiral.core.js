"use strict";
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

/**
 * Spiral
 * @constructor
 */
var spiral = new function () {
    /**
     * Default ajax options.
     *
     * @type {{url: null, method: string, data: String|Object, processAnswer: Function}}
     */
    var ajaxOptions = {
        url: null,
        method: 'POST',
        data: '',
        processAnswer: function (options) {
            console.warn("You should override processAnswer method to own! Arguments", arguments);
        },
        isSuccess: true
    };

    this.processResponse = function (options, xhr) {
        var contentType = xhr.getResponseHeader("Content-Type");

        options.request = xhr;
        if (contentType && contentType.indexOf("application/json") !== -1) {
            try {
                options.response = JSON.parse(xhr.responseText);
            } catch (exception) {
                console.log("fail to parse JSON ", xhr.responseText);
                console.error(exception);
                options.response = xhr.responseText;
                options.isSuccess = false;
            }
        }

        if (xhr.status > 199 && xhr.status < 300) {//200-299
            if (options.isSuccess !== false) {
                options.isSuccess = true;
            }
            //TODO place for actions.
        } else if (xhr.status === 401) {//401
            spiral.actions.performAction("authorizationRequest");
            options.isSuccess = false;
        } else if (xhr.status > 399 && xhr.status < 600) {//400-599
            options.isSuccess = false;
        } else if (xhr.status === 0) {//abort
            return;
        }

        if (!options.response) {//404 for example
            options.response = xhr.status + " - " + xhr.statusText;
        }
        if (options.response.hasOwnProperty("action")) {
            if (typeof options.response.action === 'string') {//action:"refresh",
                spiral.actions.performAction(options.response.action);
            } else if (typeof options.response.action === 'object') {
                if (Object.keys(options.response.action).length === 1) {//"action":{"redirect":"/keeper/cms/edit/526637aae176cb40278b4568"}"
                    for (var key in options.response.action) {
                        spiral.actions.performAction(key, options.response.action[key], options);
                    }
                } else if (Object.keys(options.response.action).length > 1) {//action:{method:"redirect","href":a}
                    setTimeout(function(){
                        spiral.actions.performAction(options.response.action.method, options.response.action, options);
                    }, options.response.action.delay || 0);
                } else {
                    console.error("Action from server. Object have to keys . ", options.response.action);
                }

            } else {
                console.error("Action from server.Something wrong. ", options.response.action);
            }
        }
        options.processAnswer(options);

    };
    /**
     * Add ability to by pass some additional ajax options.
     *
     * @param {object} request
     * @returns {*}
     */
    this.ajax = function (request) {
        request = spiral.tools.extend(ajaxOptions, request);

        var xhr = new XMLHttpRequest(),//IE7+
            upload = xhr.upload,
            that = this;

        if (request.lockProgress) {
            upload.addEventListener("progress", function (event) {
                if (event.lengthComputable) {
                    request.lockProgress(event.loaded, event.total);
                }
            }, false);
        }
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4) {
                that.processResponse.call(that, request, xhr)

            }
        };
        xhr.open(request.method, request.url);

        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        var dataToSend = '';
        if (request.data.toString().indexOf("FormData") !== -1) {//if form data
            dataToSend = request.data;
        } else {
            dataToSend = new spiral.LikeFormData(request.data, xhr);
        }

//TODO лиса почемуто считает что spiral.LikeFormData это nsIInputStream О_о и хочет у него метод available().
// TODO  При этом если метод дать, то все падает еще при загрузке страницы. Разобраться с багой и залить им в баг трэкер.
//TODO dataToSend.toString() рабоает на ура, но это неправильно. Так что разобратся со всем этим.

        try {
            xhr.send(dataToSend);
        } catch (e) {
            console.error("error sending trying another method");
            xhr.send(dataToSend.toString());
        }

        return xhr;
    };

    /**
     * Templator cache.
     */
    var templateCache = {};

    /**
     * Process click on select editor button
     * @param {String} template name of template
     * @param {Array} data context data
     */
    this.template = function (template, data) {
        var fn = /^[a-z0-9\-]+$/i.test(template) ? templateCache[template] = templateCache[template] || this.template(document.getElementById('js-template-' + template).innerHTML) :
            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +

                    // Introduce the data as local variables using with(){}
                "with(obj){p.push('" +

                    // Convert the template into pure JavaScript
                template
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'")
                + "');}return p.join('');"
            );

        return data ? fn(data) : fn;
    };

    /**
     * Create element from template
     * @param {String} string template
     * @returns {Node}
     */
    this.createElement = function (string) {
        var container = document.createElement('div');
        container.innerHTML = string.replace(/^\s+|\s+$/g, '');

        return container.firstChild;
    };
    /**
     * Remember hash.
     * Example: if spiral.listing was placed into a bootstrap tab and order was changed.
     */
    this.rememberHash = function () {
        if (localStorage && window.location.hash) {
            localStorage.windowLocationHash = window.location.hash;
        }
    };
};
/**
 * Collection of useful tools
 */
spiral.tools = {
    /**
     * Merge object1 and object2 into one object
     * @param {Object} obj1
     * @param {Object} obj2
     * @returns {Object} onj3
     */
    extend: function (obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (var attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        return obj3;
    },
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

/**
 * Spiral Events system.
 * @constructs spiral.Events
 */
spiral.Events = function () {
    this._actions = {};
};
/**
 * Add action
 * @param {String} action
 * @param {Function} func
 * @lend spiral.events
 */
spiral.Events.prototype.registerAction = function (action, func) {
    if (!this._actions.hasOwnProperty(action)) {
        this._actions[action] = [];
    }
    this._actions[action].push(func);
}
/**
 * remove action
 *
 * @param {String} action
 * @param {Function} func
 * @lend spiral.events
 */
spiral.Events.prototype.removeAction = function (action, func) {
    alert("You try to remove action. This part is incomplete");
    //TODO
};

/**
 * Perform action
 * @param {String} action
 * @param {Object} [actionParams] object with all action data from server
 * @param {Object} [options] ajax options
 */
spiral.Events.prototype.performAction = function (action, actionParams, options) {
    if (this._actions.hasOwnProperty(action)) {
        for (var n = 0, l = this._actions[action].length; n < l; n++) {
            this._actions[action][n](actionParams, options);
        }
    }
};


spiral.actions = new spiral.Events();
spiral.events = new spiral.Events();

spiral.actions.registerAction("redirect", function (action) {
    if (Object.prototype.toString.call(action) === "[object String]") {
        window.location.pathname = action;
    } else {
        window.location.pathname = action.href || action.url;
    }
});

spiral.actions.registerAction('reload', function () {
    location.reload();
});

spiral.actions.registerAction('refresh', function () {
    spiral.actions.performAction('reload');
});

spiral.actions.registerAction('close', function () {
    window.close();
});

spiral.actions.registerAction('mountID', function (id, options) {
    var form = spiral.instancesController.getInstance("form", options.context);
    form.options.url = options.context.action = options.url + id;
});

/**
 * Infinity scrolling calculations
 * @param {Node|String|Window} internalContainer
 * @param {Node|String|Window} externalContainer
 * @param {Number} distance
 * @param {Function} callback
 * @constructor
 */
spiral.InfiniteScroll = function (internalContainer, externalContainer, distance, callback) {
    this.isEnabled = null;
    this.internalContainer = internalContainer;
    this.externalContainer = externalContainer;

    this.distance = (distance) ? distance : 300;
    this.callback = callback;
    this.checkScrollBinded = this.checkScroll.bind(this);
    this.enable();
};

/**
 * Enable scrolling
 */
spiral.InfiniteScroll.prototype.enable = function () {
    if (this.isEnabled === null) {
        this.externalContainer.addEventListener("scroll", this.checkScrollBinded, false);
    }
    this.isEnabled = true;


};
/**
 * Disable scrolling
 * @param {boolean}  [isPermanent]
 */
spiral.InfiniteScroll.prototype.disable = function (isPermanent) {
    if (isPermanent) {
        this.externalContainer.removeEventListener("scroll", this.checkScrollBinded, false);
    }
    this.isEnabled = false;

};

/**
 * Check scroll
 */
spiral.InfiniteScroll.prototype.checkScroll = function () {

    if (!this.isEnabled) {
        return;
    }
    var isShouldLoadMore = (this.externalContainer === window) ? this.checkScrollWindow() : this.checkScrollExternalContainer();
    if (!isShouldLoadMore) {
        isShouldLoadMore = (this.externalContainer === window) ? this.checkPositionWindow() : this.checkPositionExternalContainer();
    }

    if (isShouldLoadMore) {
        this.callback();
    }


};

/**
 * Check scroll of window
 * @returns {boolean}
 */
spiral.InfiniteScroll.prototype.checkScrollWindow = function () {
    return (window.pageYOffset >= (document.body.clientHeight - window.innerHeight - this.distance));
};

/**
 * Check scroll
 * @returns {boolean}
 */
spiral.InfiniteScroll.prototype.checkScrollExternalContainer = function () {
    //TODO тут общий случай когда инфинити лоадер идет в внутри какой либо ноды. Закодить когда будет надо
    debugger;

    //only global infinite scroll is done for a while (above)

    //if ($(window).scrollTop() >= $(document).height() - $(window).height() - distance) {
    //    callback();
    //}

};

/**
 * Check free space in container. If space available we should fill it
 * @returns {boolean}
 */
spiral.InfiniteScroll.prototype.checkPositionWindow = function () {
    return (window.outerHeight >= this.internalContainer.getBoundingClientRect().bottom);
};

/**
 * Check free space in container. If space available we should fill it
 * @returns {boolean}
 */
spiral.InfiniteScroll.prototype.checkExternalContainer = function () {
//TODO тут общий случай когда инфинити лоадер идет в внутри какой либо ноды. Закодить когда будет надо
};


/**
 * Show confirm message
 * @param {String} className class name to bind
 * @constructor
 */
function SpiralConfirm(className) {
    var that = this;
    [].forEach.call(document.getElementsByClassName(className), function (item, i, arr) {
        item.addEventListener("click", function (e) {
            that.processConfirm.call(that, e)
        }, false);
    });
}
/**
 * Perform process when user click to button with confirm
 * @param {Event} e mouse event
 */
SpiralConfirm.prototype.processConfirm = function (e) {
    var text = e.currentTarget.getAttribute("data-confirm");
    if (!window.confirm(text)) {
        e.preventDefault();
        e.stopPropagation();
    }
};

new SpiralConfirm("js-spiral-confirm");

/**
 * This object like form data
 * @param obj
 * @param xhr
 */
spiral.LikeFormData = function (obj, xhr) {
    this.data = obj;
    this.boundary = "SpiralAjax-" + Math.random().toString().substr(2);
    xhr.setRequestHeader("content-type", "multipart/form-data; charset=utf-8; boundary=" + this.boundary);
};
/**
 * Append data to storage
 * @param key
 * @param val
 */
spiral.LikeFormData.prototype.append = function (key, val) {
    this.data[key] = val;
};

/**
 * convert to object
 */
spiral.LikeFormData.prototype.toString = function () {
    var retString = "";
    var boundary = this.boundary;
    var iterate = function (data, partOfKey) {
        for (var key in data) {
            if (typeof data[key] === "object") {
                iterate(data[key], ((partOfKey.length === 0) ? key : (partOfKey + "[" + key + "]")));
            } else {
                retString += "--" + boundary
                + "\r\nContent-Disposition: form-data; name=" + ((partOfKey.length === 0) ? key : (partOfKey + "[" + key + "]"))
                + "\r\n\r\n" + data[key] + "\r\n";
            }
        }
    };
    iterate(this.data, "");

    retString += "--" + this.boundary + "--\r\n";
    return retString;
};

//spiral.LikeFormData.prototype.toString = function(){
//    var retString ="";
//    for (var key in this.data) {
//        retString += "--" + this.boundary
//            + "\r\nContent-Disposition: form-data; name=" + key
//            + "\r\n\r\n" + this.data[key] + "\r\n";
//    }
//    retString += "--" + this.boundary + "--\r\n";
//    return retString;
//};