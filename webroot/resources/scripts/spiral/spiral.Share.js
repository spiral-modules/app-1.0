"use strict";
/**
 * Spiral share
 * @param {Object} node  DomNode of form
 * @param {Object} [options] all options to override default
 * @constructor
 * @extends spiral.BaseDOMConstructor
 */
spiral.Share = function (node, options) {
    this.init(node);//call parent

    if (options) {//if we pass options extend all options by passed options
        this.options = spiral.tools.extend(this.options, options);
    }

    /**
     * @extends spiral.DOMEvents
     * @type {spiral.DOMEvents}
     * @inheritDoc
     * */
    this.DOMEvents = new spiral.DOMEvents();
    this.addEvents();
    this.addNetworks();

};
/**
 * @lends spiral.Share.prototype
 */
spiral.Share.prototype = Object.create(spiral.BaseDOMConstructor.prototype);

/**
 * @override
 * @inheritDoc
 * @enum {Object}
 */
spiral.Share.prototype.optionsToProcess = {
    /**
     * Link to node
     */
    "node": {
        "processor": function (node) { //processor
            return node;
        }
    }
};

/**
 * @override
 * @inheritDoc
 * @enum {String}
 */
spiral.Share.prototype.attributesToGrab = {//option to grab from forms
    /**
     * Networks to share <b>Default: "false"</b>
     */
    "data-networks": {
        key: "networks",
        value: false,
        processor: function (val, node) {
            var ret = false;
            if (val) {
                ret = val.split(",");
            }
            return ret;
        }
    },
    /**
     * Url to share <b>Default: current site url (location.href)</b>
     */
    "data-url": {
        key: "url",
        value: false,
        processor: function (val, node) {
            if (!val) {
                val = location.href;
            }
            if (val.indexOf("http") !== 0) {
                val = "http://" + val;
            }
            val = encodeURIComponent(val);
            return val;
        }
    },
    /**
     *Get share count <b>Default: false</b>
     */
    "data-getCount": {
        key: "getCount",
        value: false
    },
    /**
     *Callback after share <b>Default: false</b>
     */
    "data-callback": {
        key: "callback",
        value: false,
        processor: function(val,node,instance){
            var ret=this.value;
            if (val) {
                var fn = eval(val);
                if (typeof(fn) === "function") {
                    ret = fn;
                }
            }
            return ret;
        }
    },
    /**
     * Some other parameters. Like facebook app id and etc. JSON format. <b>Default: false</b>
     */
    "data-other": {
        key: "other",
        value: false,
        processor: function(val,node,instance){
            var ret=this.value;
            if (val && val.trim()) {
                try{
                    ret = JSON.parse(val);
                } catch (e){
                    console.error("JSON parse error for spiral.Share data-other.",val,e);
                    ret= this.value
                }
            }
            return ret;
        }
    }
};


/**
 * Add all events for forms
 */
spiral.Share.prototype.addEvents = function () {
    var that = this;
    this.DOMEvents.add([
        {
            DOMNode: this.options.node,
            eventType: "click",
            eventFunction: function (e) {
                that.onClick.call(that, e)
            }
        }
    ]);
};
/**
 *
 * @param {Object} e click event
 */
spiral.Share.prototype.onClick = function (e) {
    var network = e.target.dataset.network;
    if (network && spiral.shareNetworks[network] && spiral.shareNetworks[network].share) {
        spiral.shareNetworks[network].share(this.options.url,this.options.callback,this.options.other);
    }

};
/**
 * Add networks images and behavior
 */
spiral.Share.prototype.addNetworks = function () {
    var that = this;
    this.options.networks.forEach(function (val, key, arr) {
        if (!spiral.shareNetworks.hasOwnProperty(val)) {
            console.error("You should provide dom string for " + val + " network");
            return;
        }

        var divContainer = document.createElement("div");
        divContainer.innerHTML = spiral.shareNetworks[val].dom;
        var me = divContainer.firstChild;
        that.options.node.appendChild(me);

        if (spiral.shareNetworks[val].init) {
            spiral.shareNetworks[val].init();
        }

        if (that.options.getCount && spiral.shareNetworks[val].getCount) {
            spiral.shareNetworks[val].getCount(that.options.url, me);
        }
    })
};
/**
 * Set url to share. External method
 * @param {String} url
 */
spiral.Share.prototype.setUrl = function (url) {
    this.options.url = url;
};
/**
 * Clear all variables and die
 */
spiral.Share.prototype.die = function () {
    this.DOMEvents.removeAll();
};


spiral.shareNetworks = {};

spiral.shareNetworks.twitter = {
    dom: '<div data-count="-" data-network="twitter"></div>',
    share: function (url, callback) {
        if (callback) {
            window.addEventListener("message", function (event) {
                if (event.source == win && event.data != "__ready__") {
                    var eventParsed = JSON.parse(event.data);
                    if (eventParsed && eventParsed.params && eventParsed.params[0]==="tweet"){
                        callback("twitter");
                    }
                }
            });
        }
        var win = window.open("https://twitter.com/intent/tweet?url=" + url,
            'twitter-share-dialog',
            'width=626,height=260');

    },
    getCount: function (url, me) {
        spiral.ajax({
            url: "/count/twitter",
            data: {url: url},
            processAnswer: function (ans) {
                me.dataset.count = ans.response.count;
            }
        })
    }
};

spiral.shareNetworks.fb = {
    dom: '<div data-count="-" data-network="fb"></div>',
    share: function (url,callback,other) {
        var shareURL = 'https://www.facebook.com/sharer/sharer.php?s=100&u=' + url;
        if (other && other.fbAppID){
            shareURL='https://www.facebook.com/dialog/feed?app_id='+other.fbAppID+'&display=popup&link='+url+'&redirect_uri='+encodeURIComponent(window.location.href+'#fb_success');

        }
        if (callback && !(other || other.fbAppID)){
            console.error("You want to use aftershare callback, but you not provided facebookAppId. So callback want fired(FB limitation) ")
        }
        var win = window.open(
            shareURL,
            'facebook-share-dialog',
            'width=626,height=265');
        if (callback && other && other.fbAppID) {
            window.addEventListener("message", function (event) {
                if (event.data === "fbShare") {
                    callback("fb");
                }
            },false);
        }

    },
    getCount: function (url, me) {
        spiral.ajax({
            url: ["https://graph.facebook.com/fql?q=select%20%20share_count%20from%20link_stat%20where%20url=", "\"", url, "\""].join(""),
            method: "GET",
            processAnswer: function (ans) {
                me.dataset.count = ans.response.data[0].share_count;
            }
        })
    }
};


spiral.shareNetworks.email = {
    dom: '<div data-count="-" data-network="email"></div>',
    share: function (url,callback,other) {
        var userAgent = window.navigator.userAgent;
        if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
            window.location.replace(other.email);
        }
        else {
            window.open(other.email);
        }

        //var win =window.open(
        //    '/count/mailView?u=' + url,
        //    'mail-share-dialog',
        //    'width=500,height=350');
        //if (callback) {
        //    win.addEventListener("message", function (event) {
        //        if (event.data === "emailSent") {
        //            callback("email");
        //        }
        //    });
        //}
    },
    getCount: function (url, me) {
        spiral.ajax({
            url: "/count/mail",
            data: {url: url},
            processAnswer: function (ans) {
                me.dataset.count = ans.response.count;
            }
        })
    }
};

spiral.shareNetworks.pinterest = {
    dom: '<div data-count="-" data-network="pinterest"></div>',
    share: function (url,callback,other) {
        var postInfo = '';
        var imgURL = '';
        var text = '';
        if (other) {
            if (other.pinterest && other.pinterest.pinID){
                postInfo = " Pin: http://pinterest.com/pin/" + pinId + "/";
            }
            if (other.imageURL){
                imgURL = other.imageURL;
            }
            if (other.pinterest && other.pinterest.imageURL){
                imgURL = other.pinterest.imageURL;
            }
            if (other.text){
                text = other.text;
            }
            if (other.pinterest && other.pinterest.text){
                text = other.text.imageURL;
            }
        }
        text = (text) ? encodeURIComponent(text) : '';
        imgURL = (imgURL.indexOf('http') > -1) ? imgURL : location.protocol + "//" + location.host + imgURL;
        var service = "http://pinterest.com/pin/create/button/?url=" + url + "&media=" + encodeURIComponent(imgURL) + "&description=" + text + postInfo;
        window.open(service, 'share-dialog', 'width=626,height=436');

        //if (callback) {//todo check pinterest callback
        //    win.addEventListener("message", function (event) {
        //        if (event.data === "pinterestShare") {
        //            callback("pinterest");
        //        }
        //    });
        //}
    },
    getCount: function (url, me) {

    }
};

spiral.instancesController.addInstanceType("share", "js-spiral-share", spiral.Share);