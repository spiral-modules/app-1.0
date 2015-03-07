"use strict";
/**
 * This a constructor (class) for facebook.
 * @param {Object} node dom node
 * @param {Object} options all options to override default
 * @constructor
 * @extends spiral.BaseDOMConstructor
 */
spiral.Facebook = function (node, options) {

    this.node=node;
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

    spiral.facebookAPI.ready(this.apiIsReady.bind(this));


};


/**
 *
 * @type {spiral.BaseDOMConstructor.prototype}
 * @lends spiral.Drop.prototype
 */
spiral.Facebook.prototype = Object.create(spiral.BaseDOMConstructor.prototype);


/**
 * @override
 * @inheritDoc
 * @enum {string}
 */
spiral.Facebook.prototype.attributesToGrab = {
    /**
     * Url to connect with spiral server side
     */
    "data-url": {
        "value": null,
        "key": "url"
    },
    /**
     * Invite for invite dialog
     */
    "data-invitetext": {
        "value": "join me",
        "key": "inviteText"
    },
    /**
     * is invite dialog
     */
    "data-isinvite": {
        "value": false,
        "key": "isInvite"
    }
};



/**
 * Adds events listeners.
 */
spiral.Facebook.prototype.addEventListeners = function () {
    var that = this;
    this.DOMEvents.add([
        {
            DOMNode: this.node,
            eventType: "click",
            eventFunction: function (e) {
                FB.login(that.afterFBLogin.bind(that), {
                    scope: spiral.facebookAPI.options.scope,
                    return_scopes: true
                });
            }
        }
    ]);
};
spiral.Facebook.prototype.apiIsReady = function(status){
    //elements
    this.addEventListeners();
};
/**
 * Perform after login to facebook
 */
spiral.Facebook.prototype.afterFBLogin = function(response){
    var that = this;
    if (response.status === 'connected' && this.options.isInvite) {
        FB.ui(
            {
                method: 'apprequests',
                message: this.options.inviteText
            },
            function(response) {
                //TODO ?
            }
        );
        return;
    }

    if (response.authResponse.grantedScopes && response.authResponse.grantedScopes.indexOf("email") === -1) {
        FB.login(that.afterFBLogin.bind(that), {
            scope: spiral.facebookAPI.options.requiredScope,
            //return_scopes: true,
            auth_type: "rerequest"
        });
    } else {
        if (response.status === 'connected') {
            spiral.ajax({
                url: that.options.url,
                data: {accessToken: response.authResponse.accessToken},
                processAnswer: function (ans) {
                    console.log(ans);
                    var resp = ans.response,
                        usr = resp.userData;

                    if (resp.cleanCookies && resp.status >= 400 && resp.status < 500) {
                        FB.logout(function(response) {});


                        //    console.log(response);
                        //var url = $('#logout').attr('redirect_url');
                        //$.ajax({
                        //    url: url,
                        //    type: 'DELETE',
                        //    success: function(msg) {
                        //        window.location = '/';
                        //    }
                        //});

                    }
                }
            });
        }
    }
};

spiral.Facebook.prototype.die = function () {
    this.DOMEvents.removeAll();
};

spiral.instancesController.addInstanceType("facebook", "js-spiral-facebook", spiral.Facebook);