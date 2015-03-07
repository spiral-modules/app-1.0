(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

spiral.fb = {
    /**
     * Initialization
     * @param {object} options
     */
    init: function (options) {
        debugger
        var that = this,
            defaults = {
                appId: undefined,
                channelUrl: undefined,
                status: true,
                xfbml: true,
                url: undefined,
                buttonID: undefined
            };

        this.options = spiral.tools.extend(defaults, options);

        window.fbAsyncInit = function () {
            FB.init({
                appId: that.options.appId,           // App ID from the app dashboard
                channelUrl: that.options.channelUrl, // Channel file for x-domain comms
                status: that.options.status,         // Check Facebook Login status
                xfbml: that.options.xfbml            // Look for social plugins on the page
            });

            document.getElementById(that.options.buttonID).addEventListener("click", function () {
                FB.login(spiral.fb.afterFBLogin, {scope: that.options.scope});
            }, false);
            // Additional initialization code such as adding Event Listeners goes here
        };
    },
    /**
     * todo make avatar not required
     * FB's response.
     * @param response
     */
    afterFBLogin: function (response) {
//        console.log(this);
        var f1 = document.querySelector('#signUp form'),
            f2 = document.querySelector('#signUpFB form');
            //avatar = f2.querySelector('img');

        if (response.status === 'connected') {
            spiral.ajax({
                url: spiral.fb.options.url,
                data: {accessToken: response.authResponse.accessToken},
                processAnswer: function (answer) {
                    var r = answer.response,  //Response
                        d = r.userData;       //Data
                    var form = null;
                    console.log(r);
                    //todo handle different error codes 403 406 400
                    if (r.status == 400) {
                        /*if (r.avatarURL) {
                            avatar.src = r.avatarURL;
                            avatar.style.display = "block";
                        }*/
                        if (d.email)
                            f2[0].value = d.email;
                        if (d.displayName)
                            f2[1].value = d.displayName;
                        f2[2].value = d.id;

                        //TODO delete jquery
                        $('#signUp').modal('hide');
                        $('#signUpFB').modal('show');

                        if (r.errors && Object.keys(r.errors).length > 0) {
                            form = new spiral.Form(f2, null);
                            form.showErrors(form.options, r.errors);
                        }
                    } else if (r.status == 406) {
                        if (r.errors) {
                            form = new spiral.Form(f1, null);
                            form.showMessage("danger", form.options, r.errors.join("\r\n"));
                        }
                    }
                }
            });
        }
    }
};