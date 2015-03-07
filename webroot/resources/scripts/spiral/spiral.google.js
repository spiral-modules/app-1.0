(function () {
    var po = document.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src = 'https://plus.google.com/js/client:plusone.js?onload=googleRender';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
})();

spiral.google = {
    /**
     * Initialization
     * @param {object} options
     */
    init: function (options) {
        var defaults = {
            url: undefined,
            clientId: undefined
        };

        this.options = spiral.tools.extend(defaults, options);
    },
    /**
     * GOOGLE's button render
     */
    render: function() {
        gapi.signin.render('googleSignInButton', {
            'callback': 'googleSignInCallback',
            'clientid': this.options.clientId,
            'cookiepolicy': 'single_host_origin',
            'scope': 'https://www.googleapis.com/auth/plus.login',
            'approvalprompt': "force",
            'requestvisibleactions': "http://schemas.google.com/AddActivity"
        });
    },
    /**
     * GOOGLE's response.
     * @param authResult
     */
    signInCallback: function (authResult) {
        var that = this;
        if (authResult['code']) {
            var f1 = document.querySelector('#signUp form'),
                f2 = document.querySelector('#signUpGoogle form'),
                avatar = f2.querySelector('img');

            spiral.ajax({
                url: that.options.url,
                data: {code: authResult['code']},
                processAnswer: function (answer) {
                    var r = answer.response,  //Response
                        d = r.userData;       //Data
                    var form = null;
                    if (r.status == 400) {
                        if (d.image.url) {
                            avatar.src = d.image.url;
                            avatar.style.display = "block";
                            f2[3].value = avatar.src;
                        }
                        if (d.email)
                            f2[0].value = d.email;
                        if (d.displayName)
                            f2[1].value = d.displayName;
                        f2[2].value = d.id;

                        //TODO delete jquery
                        $('#signUp').modal('hide');
                        $('#signUpGoogle').modal('show');

                        if (r.errors && Object.keys(r.errors).length > 0) {
                            form = new spiral.Form(f2, null);
                            form.showErrors(form.options, r.errors);
                        }
                    } else if (r.status == 406) {
                        if (r.errors) {
                            form = new spiral.Form(f1, null);
                            form.showMessage("danger", form.options, r.errors.join("\r\n"), "Error(s): ");
                        }
                    }
                }
            });
        } else if (authResult['error']) {
            // There was an error.
            // Possible error codes:
            //   "access_denied" - User denied access to your app
            //   "immediate_failed" - Could not automatially log in the user
            console.log(authResult);
        }
    }
};

/**
 * Wrap to global function.
 * Because google gets function name from callback: "googleSignInCallback" and doesn't eval it.
 * So we can't write data-callback="spiral.google.signInCallback"
 * @param e
 */
function googleSignInCallback(e) {
    spiral.google.signInCallback(e);
}
/**
 * Wrap to global function.
 */
function googleRender() {
    spiral.google.render();
}