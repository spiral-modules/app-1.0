spiral.twitter = {
    init: function (options) {
        var that = this,
            defaults = {
                url: "/signUp/twitter",
                buttonID: undefined
            };

        this.options = spiral.tools.extend(defaults, options);

        document.getElementById(that.options.buttonID).addEventListener("click", function (e) {
            e.preventDefault();
            that.exec();
        }, false);
    },
    exec: function () {
        var that = this,
            params = 'location=0,status=0,width=800,height=600';

        this.twitter_window = window.open(this.options.url, 'twitterWindow', params);

        /*this.interval = window.setInterval((function () {
            if (that.twitter_window.closed) {
                window.clearInterval(that.interval);
                that.finish(null);
            }
        }), 1000);*/
    },
    finish: function (r) {
        console.log(r);
        var f1 = document.querySelector('#signUp form'),
            f2 = document.querySelector('#signUpTwitter form'),
            avatar = f2.querySelector('img'),
            form = null;

        if (typeof(r.status) == "string")
            r.status = parseInt(r.status, 10);

        switch (r.status) {
            case 200: {

                break;
            }
            case 400: {
                var d = r.userData;
                if (d.avatar) {
                    avatar.src = d.avatar;
                    avatar.style.display = "block";
                    f2[3].value = d.avatar;
                }
                if (d.name)
                    f2[1].value = d.name;

                f2[2].value = d.id;

                //TODO delete jquery
                $('#signUp').modal('hide');
                $('#signUpTwitter').modal('show');

                if (r.errors && Object.keys(r.errors).length > 0) {
                    form = new spiral.Form(f2, null);
                    form.showErrors(form.options, r.errors);
                }
                break;
            }
            case 406: {
                if (r.errors) {
                    form = new spiral.Form(f1, null);
                    form.showMessage("danger", form.options, r.errors.join("\r\n"), "Error(s): ");
                }
                break;
            }
            default: {
                console.log(r);
            }
        }

        if (r.action)
            spiral.actions.performAction(r.action);
    }
};


//spiral.Twitter = function (options) {
//    var that = this,
//        defaults = {
//            url: "/signUp/twitter",
//            buttonID: undefined
//        };
//
//    this.options = spiral.tools.extend(defaults, options);
//
//    document.getElementById(that.options.buttonID).addEventListener("click", function (e) {
//        e.preventDefault();
//        that.exec();
//    }, false);
//};
//
//spiral.Twitter.prototype.exec = function () {
//    var that = this,
//        params = 'location=0,status=0,width=800,height=600';
//
//    this.twitter_window = window.open(this.options.url, 'twitterWindow', params);
//
//    this.interval = window.setInterval((function () {
//        if (that.twitter_window.closed) {
//            window.clearInterval(that.interval);
//            that.finish(null);
//        }
//    }), 1000);
//
//    /*// the server will use this cookie to determine if the Twitter redirection
//    // url should window.close() or not
//    document.cookie = 'twitter_oauth_popup=1; path=/';*/
//};
//
//spiral.Twitter.prototype.finish = function (response) {
//    window.location.reload();
//
//
//    $.ajax({
//        type: 'get',
//        url: '/auth/check/twitter',
//        dataType: 'json',
//        success: function (response) {
//            if (response.authed) {
//                // the user authed on Twitter, so do something here
//            } else {
//                // the user probably just closed the window
//            }
//        }
//    });
//};
