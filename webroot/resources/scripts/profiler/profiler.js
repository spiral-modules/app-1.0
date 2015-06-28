getElementsByClassName = function (cl, tag, container) {
    var tag = (typeof(tag) === 'undefined') ? '*' : tag;
    var container = (typeof(container) === 'undefined') ? document : container;
    var retnode = [];
    var myclass = new RegExp('\\b' + cl + '\\b');
    var elem = container.getElementsByTagName(tag);
    for (var i = 0; i < elem.length; i++) {
        var classes = elem[i].className;
        if (myclass.test(classes)) retnode.push(elem[i]);
    }
    return retnode;
};

function profilerPanels() {
    try {
        var showProfiler = JSON.parse(localStorage.getItem('showProfiler')) == true
    } catch (e) {
        var showProfiler = false
    }

    var options = getElementsByClassName("option", "div", document.getElementById("dbg-prf-options"));
    for (var i in options) {
        var option = options[i];

        option.onclick = function () {

            var id = this.id;
            var contentId = id.substring(4);
            var pluginDiv = document.getElementById(contentId);


            if (pluginDiv != null) {

                var contentDiv = document.getElementById("dbg-prf-content");
                contentDiv.style.display = 'block';
                var plugins = getElementsByClassName("plugin", "div", contentDiv);
                for (var j in plugins) {
                    plugins[j].style.display = 'none';
                }

                var link = document.getElementsByClassName("option");

                for (var i = 0; i < link.length; i++) {
                    link[i].classList.remove("active")
                }
                this.className = this.className + " active";

                var shadowDiv = document.getElementById("dbg-prf-shadow");
                shadowDiv.style.display = 'block';

                pluginDiv.style.display = 'block';
            }
        }
    }

    if (!showProfiler) {
        document.getElementById("dbg-prf").className = document.getElementById("dbg-prf").className + " hide";
    }

    var shadowDiv = document.getElementById("dbg-prf-shadow");
    var pluginCloseDiv = document.getElementById("dbg-prf-content-option-close");
    shadowDiv.onclick = function () {
        var contentDiv = document.getElementById("dbg-prf-content");
        contentDiv.style.display = 'none';

        var shadowDiv = document.getElementById("dbg-prf-shadow");
        shadowDiv.style.display = 'none';
        var plugins = getElementsByClassName("plugin", "div", contentDiv);
        for (var j in plugins) {
            plugins[j].style.display = 'none';
        }
        var link = document.getElementsByClassName("option");

        for (var i = 0; i < link.length; i++) {
            link[i].classList.remove("active")
        }
    };

    pluginCloseDiv.onclick = shadowDiv.onclick;
    var profilerCloseDiv = document.getElementById("dbg-prf-options-option-close");
    profilerCloseDiv.onclick = function () {
        localStorage.setItem('showProfiler', false);
        document.getElementById("dbg-prf").className = document.getElementById("dbg-prf").className + " hide";
    }

    document.getElementById("dbg-prf-link").onclick = function () {
        localStorage.setItem('showProfiler', true);
        document.getElementById("dbg-prf").className = " ";
        document.getElementById("dbg-prf").className = "profiler";
    }
}

function init() {
    if (arguments.callee.done) return;
    arguments.callee.done = true;
    profilerPanels();
    otherActions();
}

function otherActions() {
    var t = new Array();
    t[""] = "ALL MESSAGERS&nbsp;&nbsp;&nbsp;";

    for (var n = 0, mess = document.querySelectorAll('#debug-messages-table b'), l = mess.length; n < l; n++) {
        if (typeof(t[mess[n].innerHTML]) === 'undefined') {
            t[mess[n].innerHTML] = mess[n].innerHTML;
        }
    }

    var o = "";
    for (var key in t) {
        o += "<option value='" + key + "'>" + t[key] + "</option>";
    }

    var debugMessages = document.getElementById("debug-messages");
    debugMessages.innerHTML = o;

    var allMessages = document.querySelectorAll('#debug-messages-table tbody tr'),
        allMessagesLength = allMessages.length;

    debugMessages.onchange = function () {

        if (this.value != '') {
            for (var n = 0; n < allMessagesLength; n++) {
                if (allMessages[n].className.indexOf("caller-" + this.value) !== -1) {
                    allMessages[n].style.display = '';
                } else {
                    allMessages[n].style.display = 'none';
                }
            }
        } else {
            for (var n = 0; n < allMessagesLength; n++) {
                allMessages[n].style.display = '';
            }
        }
    };
}

// ff, opera
if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", init, false);
}

// ie
/*@cc_on @*/
/*@if (@_win32)
 document.write("<script id=__ie_onload defer src=javascript:void(0)>");
 document.write("<\/script>");
 var script = document.getElementById("__ie_onload");
 script.onreadystatechange = function() {
 if (this.readyState == "complete") {
 init();
 }
 };
 /*@end @*/

// safari
if (/WebKit/i.test(navigator.userAgent)) {
    var _timer = setInterval(function () {
        if (/loaded|complete/.test(document.readyState)) {
            clearInterval(_timer);
            delete _timer;
            init();
        }
    }, 10);
}

// others
window.onload = init;