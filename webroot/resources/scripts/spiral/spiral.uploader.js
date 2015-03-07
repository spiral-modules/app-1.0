/**
 * TODO: OPTIMIZE, ADD TO SPIRAL AS MODULE
 */


(function uploader(element) {
    if (!element) {
        return;
    }
    "use strict";
    window.URL = window.URL || window.webkitURL;//for Safari 6-7 version;
    var images_regex = /^(?:image\/jpeg|image\/png|image\/jpg|)$/i,
        uploadedAtSameTime = 5, //TODO
        fileList = [],
        multiple = (/^true$/i).test(element.getAttribute("data-multiple")),
        externalProcessor = (/^true$/i).test(element.getAttribute("data-externalProcessor")),
        photoContainer = element.getAttribute("data-photoContainer"),
        fileInput = document.createElement("input"),
        thumbContainer = document.createElement("div"),
        xhrArray = [],
        loadedId = [],
        commonColors = [];
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    fileInput.multiple = multiple;
    element.appendChild(fileInput);
    thumbContainer.id = "uploader-thumb-container";
    element.parentNode.insertBefore(thumbContainer, element.nextSibling);


    element.addEventListener("dragover", function (e) {
        e.preventDefault();// Prevent Default to firefox
    }, false);

    element.addEventListener("dragenter", function (e) {
        element.classList.add("over");
    }, false);

    element.addEventListener("dragleave", function (e) {
        element.classList.remove("over");
    }, false);

    element.addEventListener("drop", function (e) {
        e.preventDefault();
        element.classList.remove("over");
        addFiles(e.dataTransfer.files);
    }, false);

    element.addEventListener("click", function () {
        fileInput.click();
    }, true);

    fileInput.addEventListener("change", function (e) {
        addFiles(e.target.files);

    }, false);

    var deleteAllButton = document.getElementById("js-drop-action");
    if (deleteAllButton) {
        deleteAllButton.addEventListener("click", function (e) {
            if ((xhrArray.length != 0) || (loadedId.length != 0)) {
                if (window.confirm("Delete all uploaded photos?")) {
                    for (var t = 0; t < xhrArray.length; t++) {
                        xhrArray[t].abort();
                    }
                    var xhr = new XMLHttpRequest(),
                        that = this;
                    xhr.addEventListener("loadend", function () {
                        window.location = e.target.href;
                    }, false);
                    xhr.open("POST", "/keeper/gallery/deleteAll");
                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    xhr.send("id=" + loadedId.toString());
                }
                e.preventDefault();
            }
        })
    }

    if (externalProcessor) {

        window.spiralFileUploader = function () {
            var data = getInfoFromForm();
            if (fileList.length !== 0) {
                data.append("file", fileList[fileList.length - 1].file);
            }
            return data;

        };
    }

    function addFiles(files) {
        var colorsPicker = document.getElementsByClassName('color-piker')[0];
        if (colorsPicker) {
            var colors = colorsPicker.getElementsByClassName('color');
            commonColors = [];
            [].forEach.call(colors, function (element) {
                commonColors.push(element.getAttribute('data-value'));
            });
        }
        for (var i = 0, f; f = files[i]; i++) {
            if (f.type && (images_regex.test(f.type))) {
                fileList.push(new FileController(f, getInfoFromForm()));
                fileList[fileList.length - 1].drawImage();
                if (!externalProcessor) {
                    fileList[fileList.length - 1].sendFile(fileInput.form.action)
                }
            } else {
                console.warn("Not image!", f.name);
            }
        }
    }

    function FileController(file, form) {
        this.id = FileController.prototype.nextId++;
        this.file = file;
        this.form = form;
        this.status = {"waiting": new Date().getTime()};


    }

    FileController.prototype = {
        nextId: 0,

        drawImage: function () {
            var img;
            if (photoContainer) {
                img = document.getElementById(photoContainer);
            } else {
                this.deleteBtn = document.createElement('div');
                this.deleteBtn.className = "delete-btn";
                this.deleteBtn.innerText = "x";
                img = document.createElement("img");
                img.className = "thumb";
                img.title = encodeURI(this.file.name);
                this.imageContainer = document.createElement('span');
                this.imageContainer.appendChild(img);
                this.additionalContainer = document.createElement("div");
                this.imageContainer.appendChild(this.additionalContainer);
                this.imageContainer.appendChild(this.deleteBtn);
                thumbContainer.appendChild(this.imageContainer);
//                this.changeAdditionalContainer("progress");
            }
            if (window.URL) {
                img.src = URL.createObjectURL(this.file);
                //this.changeAdditionalContainer("progress");
            } else {
                var reader = new FileReader();
                reader.addEventListener("load", function (e) {
                    img.src = e.target.result;
                });
                reader.readAsDataURL(this.file);
            }
        },

        clickDeleteBtn: function (e, url) {
            if (window.confirm("Delete photo?")) {
                var xhr = new XMLHttpRequest(),
                    that = this;
                xhr.addEventListener("load", function (e) {
                    //TODO error proscess
                    that.imageContainer.remove();
                }, false);
                xhr.open("POST", url);
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                xhr.send("");
            }
            e.stopPropagation();
        },

        sendFile: function (action) {
            var xhr = new XMLHttpRequest(),
                upload = xhr.upload,
                that = this;
            xhr.timeout = 120000;
            xhr.addEventListener("timeout", function (e) {
                that.processError("network", "Upload timeout")
            });
            this.changeAdditionalContainer("progress");
            upload.addEventListener("progress", function (event) {
                if (event.lengthComputable) {
                    that.changeMeter(event.loaded, event.total);
                }
            }, false);
            upload.addEventListener("error", function (e) {
                return that.processError("upload", e)
            }, false);
            xhr.addEventListener("load", function (e) {
                return that.processResponse(e)
            }, false);
            xhr.open("POST", action);
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            this.form.append("file", this.file);
            commonColors.forEach(function (color) {
                that.form.append("colors[]", color);
            });
            xhr.send(this.form);
            xhrArray.push(xhr);
        },

        processError: function (type, e) {
            console.error("some error happend", type, e);
            switch (type) {
                case "fail":
                    this.changeAdditionalContainer("error", e);
                    break;

                case "network":
                    //TODO
                    this.changeAdditionalContainer("error", e);
                    break;
                case "json":
                    //TODO
                    debugger
                    break;
                case "upload":
                    //TODO
                    debugger
                    break;
                default :
                    console.error("Default error switch - ", type);
                    debugger
                    break;
            }

        },
        processResponse: function (e) {
            var resp = null;
            if (e.target.status == 200) {
                try {
                    resp = JSON.parse(e.target.response);
                } catch (err) {
                    console.error("JSON error", err);
                }
                if (resp !== null) {
                    if (resp.status === "success") {
                        this.switchToUrl(resp);
                        if (resp.colors) {
                            this.changeAdditionalContainer("colors", resp.colors);
                        } else {
                            this.changeAdditionalContainer("success", "Success. Click to edit.");
                        }
                    } else if (resp.status === "warn") {
                        this.changeAdditionalContainer("warn", "Click to fill requested fields.");
                    } else if (resp.status === "fail") {
                        this.processError("fail", (resp.message) ? resp.message : resp.messages.file);
                    }
                } else {
                    this.processError("json", e);
                }
            } else {
                this.processError("network", e);
            }

        },
        switchToUrl: function (resp) {
            var that = this;
            this.imageContainer.classList.add("link");
            this.imageContainer.addEventListener("click", function (e) {
                var win = window.open(resp.editPhoto, '_blank');
                win.focus();
            }, false);
            this.deleteBtn.addEventListener("click", function (e) {
                that.clickDeleteBtn(e, resp.deletePhoto);
            });
            loadedId.push(resp.id);

        },

        changeMeter: function (send, total) {
            this.containerBloks.meterIndicator.style.width = ((100 * send / total) + "%");
        },
        changeAdditionalContainer: function (to, options) {
            this.additionalContainer.innerHTML = "";
            this.containerBloks = {};//empty blocks - free memory.
            switch (to) {
                case "progress":
                    this.additionalContainer.className = "meter";
                    this.containerBloks.meterIndicator = document.createElement('span');
                    this.containerBloks.meterIndicator.style.width = "0%";
                    this.additionalContainer.appendChild(this.containerBloks.meterIndicator);
                    break;

                case "colors":
                    this.additionalContainer.className = "colors-container";
                    var reg = /R(\d*)G(\d*)B(\d*)/,
                        that = this;
                    options.forEach(function (val, ind, arr) {
                        var match = val.match(reg),
                            colorDiv = document.createElement("div");
                        colorDiv.className = "color";
                        colorDiv.style.background = "rgb(" + match[1] + "," + match[2] + "," + match[3] + ")";
                        that.additionalContainer.appendChild(colorDiv);
                    });

                    break;
                case "warn":
                    this.additionalContainer.className = "warn";
                    this.additionalContainer.innerHTML = options;
                    break;
                case "error":
                    that = this;
                    this.tryAgainBtn = document.createElement('div');
                    this.tryAgainBtn.className = "btn";
                    this.tryAgainBtn.innerHTML = "Try again";
                    this.additionalContainer.className = "error";
                    this.additionalContainer.innerHTML = options;
                    this.additionalContainer.appendChild(this.tryAgainBtn);
                    this.tryAgainBtn.addEventListener("click", function (e) {
                        console.log("tryAgainBtn");

                        that.sendFile(fileInput.form.action);
                    });
                    break;
                case "success":
                    this.additionalContainer.className = "success";
                    this.additionalContainer.innerHTML = options;
                    break;
                default:
                    console.error("Something wrong. Switch default - ", to);
                    break;
            }


            //this.meterIndicator.parentNode.remove();
        }
    };

    function getInfoFromForm() {
        var form = new FormData(fileInput.form),
            jsHandsontable = document.getElementsByClassName("js-handsontable");
        if (jsHandsontable.length !== 0) {
            Array.prototype.forEach.call(jsHandsontable, function (element, index, array) {
                var handsontableData = $(element).handsontable('getData');
                handsontableData.pop();
                form.append(element.getAttribute("data-field"), JSON.stringify(handsontableData));
            });
        }
        return form;
    }


})(document.getElementById("uploader"));



