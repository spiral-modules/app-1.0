"use strict";
/**
 * This a constructor (class) for facebookAPI.
 * @param {Object} options all options to override default
 * @constructor
 */
spiral.FacebookAPI = function (options) {
    this.status = false;
    this.authResponse = null;
    this.onReadyFunctions= [];

    if (options) {//if we pass options extend all options by passed options
        this.options = spiral.tools.extend(this.defaultOptions, options);
    }
    this.initApi();

};


/**
 * Default options
 * @type {{status: boolean, xfbml: boolean, cookie: boolean, version: string, appId: null, scope: null}}
 */
spiral.FacebookAPI.prototype.defaultOptions = {
    "status": true,//Determines whether the current login status of the user is freshly retrieved on every page load. If this is disabled, that status will have to be manually retrieved using .getLoginStatus().
    "xfbml":true,//Determines whether XFBML tags used by social plugins are parsed, and therefore whether the plugins are rendered or not. Defaults to false.
    "cookie":false,//Determines whether a cookie is created for the session or not. If enabled, it can be accessed by server-side code. Defaults to false.
    "version":"v2.1",//Determines which versions of the Graph API and any API dialogs or plugins are invoked when using the .api() and .ui() functions. Valid values are determined by currently available versions, such as 'v2.0'. This is a required parameter.
    "appId" : null,//Your application ID. If you don't have one find it in the App dashboard or go there to create a new app. Defaults to null.
    "scope":"email,user_friends" //scope of permission https://developers.facebook.com/docs/reference/javascript/FB.login/v2.1
};
/**
 * Called whe API is ready
 * @param fn
 */
spiral.FacebookAPI.prototype.ready = function (fn) {
    if (this.status){
        fn(this.status)
    } else{
        this.onReadyFunctions.push(fn);
    }
};

/**
 * Init facebook API
 */
spiral.FacebookAPI.prototype.initApi = function () {
    var that = this;
    if (document.getElementById('facebook-jssdk')) {
        console.error("you shouldn't use use spiral.FacebookAPI more that one");
        return;
    }

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    window.fbAsyncInit = function () {

        FB.init({
            appId: that.options.appId,          // App ID from the app dashboard
            status: that.options.status,        // Check Facebook Login status
            xfbml: that.options.xfbml,          // Look for social plugins on the page
            version: that.options.version       //version of sdk
        });
        that.isReady = true;
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                // the user is logged in and has authenticated your
                // app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed
                // request, and the time the access token
                // and signed request each expire
                that.authResponse = response.authResponse;

            } else if (response.status === 'not_authorized') {
                // the user is logged in to Facebook,
                // but has not authenticated your app

            } else {
                // the user isn't logged in to Facebook.
            }
            that.status =response.status;
            that.onReadyFunctions.forEach(function(val,key,arr){//call function
                val(that.status);
            });
            that.onReadyFunctions = []; // empty for memory saving
        });


    };
};
spiral.facebookAPI = new spiral.FacebookAPI(facebookVariables);
