//TODO REFACTOR
/**
 * Spiral fileBrowser
 * @constructor
 */
spiral.fileBrowser = {
    filtersValues: {
        "image": "images-only",
        "media": "video-only",
        "file": "file-only"
    },
    titles: {
        "image": "Select image",
        "media": "Select media",
        "file": "Select file"
    },

    //Pre-compiled templates
    templates: {
        notFound: null,
        nextPage: null,
        thumbnail: null
    },
    /**
     * Internal Init method
     */
    init: function () {
        //Compiled
        this.templates.notFound = spiral.template('fileBrowser-notFound', {});
        this.templates.nextPage = spiral.createElement(spiral.template('fileBrowser-nextPage', {}));

        //Next page click
        this.templates.nextPage.addEventListener("click", function (e) {
            spiral.fileBrowser.sendForm(false)
        }, false);

        //Pre-compiled
        this.templates.thumbnail = spiral.template('fileBrowser-thumbnail');
    },
    /**
     * Sow modal method.Called from tinyMCE fileBrowserCallback
     * @param {String} field_name name of input to return values
     * @param {String} url current value(?)
     * @param {String} type type (image,media.url,etc)
     * @param {Object} win window of tinymce
     */
    showModal: function (field_name, url, type, win) {
        "use strict";

        $('#fileBrowser').modal("show"); //TODO CHANGE MODAL
        $('#fileBrowser').attr('type', type);

        var modal = document.getElementById("fileBrowser");
        modal.getElementsByClassName("js-spiral-select")[0].onclick = function (e) {
            spiral.fileBrowser.selectClick(e, field_name);
        };
        modal.querySelector("input[name=filters]").value = spiral.fileBrowser.filtersValues[type];
        modal.querySelector("input[name=query]").value = '';

        var fileBrowserDiv = modal.getElementsByClassName("js-spiral-file-browser")[0];
        fileBrowserDiv.onchange = spiral.fileBrowser.processChange;
        fileBrowserDiv.onkeydown = function (e) {
            if (e.keyCode === 13) {//if enter
                e.preventDefault();
                e.stopPropagation();
                spiral.fileBrowser.sendForm(true);
            }
        }

        spiral.fileBrowser.sendForm(true);
    },
    /**
     * call on form elements change
     * @param {Event} e mouseEvent
     */
    processChange: function (e) {
        "use strict";
        if (!(e.type = "change" && e.target.nodeName === "INPUT")) {//do not process change from
            spiral.fileBrowser.sendForm(true);
        }
    },
    /**
     * Process answer from server
     * @param {Object} options all options from spiral.forms
     */
    processAnswer: function (options) {
        if (options.isSuccess) {
            var container = document.getElementById("fileBrowser-thumbnails"), nextPage = spiral.fileBrowser.templates.nextPage;
            container.appendChild(nextPage);

            if (options.response.paging.current === options.response.paging.lastPage) {
                nextPage.classList.add("hidden");
            } else {
                nextPage.classList.remove("hidden");
            }

            [].forEach.call(options.response.uploads, function (element, index, array) {

                var thumbnail = spiral.createElement(spiral.fileBrowser.templates.thumbnail(element));
                thumbnail.addEventListener("click", spiral.fileBrowser.thumbnailClick, false);

                $(thumbnail).popover({// TODO CHANGE TO ANOTHER POPOVER
                    placement: "left",
                    trigger: "hover",
                    html: "true",
                    delay: 500,
                    content: thumbnail.getElementsByClassName('popover')[0].innerHTML
                });

                container.insertBefore(thumbnail, nextPage);
            });

            var input = document.getElementById("fileBrowser").querySelector("input[name=page]");
            input.value = +input.value + 1;

            if (container.childNodes.length === 1) {
                container.appendChild(spiral.createElement(spiral.fileBrowser.templates.notFound));
            }
        }
    },
    /**
     * Process click on thumbnail
     * @param {Event} e mouse Event
     */
    thumbnailClick: function (e) {
        "use strict";
        if (e.currentTarget.classList.contains("selected")) {
            var modal = document.getElementById("fileBrowser");
            modal.getElementsByClassName("js-spiral-select")[0].onclick();
        } else {
            var nodes = document.getElementById("fileBrowser-thumbnails").getElementsByClassName("selected");
            [].forEach.call(nodes, function (el, ind, arr) {
                el.classList.remove("selected");
            });
            e.currentTarget.classList.add("selected");
        }
    },
    /**
     * Process click on select button
     * @param {Event} e mouse event
     * @param {String} name id of element
     */
    selectClick: function (e, name) {
        "use strict";
        var src = "", selected = document.getElementById("fileBrowser-thumbnails").getElementsByClassName("selected");
        if (selected.length !== 0) {
            src = selected[0].getAttribute("data-src");
        }

        document.getElementById(name).value = src;

        $('#fileBrowser').modal("hide"); //TODO CHANGE MODAL
    },
    /**
     * Send form to server
     * @param {Boolean} reset reset all  thumbnails?
     */
    sendForm: function (reset) {
        "use strict";
        var modal = document.getElementById("fileBrowser");

        if (reset) {
            modal.querySelector("input[name=page]").value = 1;
            document.getElementById("fileBrowser-thumbnails").innerHTML = ''; //empty container
        }

        var event = document.createEvent("HTMLEvents");
        event.initEvent("submit", true, true);
        modal.getElementsByClassName("js-spiral-file-browser")[0].dispatchEvent(event);

    },
    /**
     * Callback on form send
     * @param {Object} options options from spiral.form
     */
    callback: function (options) {
        "use strict";
        if (options.isSuccess) {
            spiral.fileBrowser.sendForm(true);
        }
    }
};

spiral.fileBrowser.init();