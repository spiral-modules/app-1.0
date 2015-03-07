"use strict";
/**
 * This a constructor (class) for file (only images) input with ability to crop it.
 * @param {Object} node dom node
 * @param {Object} options all options to override default
 * @constructor
 * @extends spiral.BaseDOMConstructor
 */
spiral.Crop = function (node, options) {
    this.init(node);

    var defaults = {
        dynamic: false
    };

    if (options) {
        options = spiral.tools.extend(defaults, options);
        this.options = spiral.tools.extend(this.options, options);
    } else {
        this.options = spiral.tools.extend(this.options, defaults);
    }

    if (typeof this.options.showInfo == "string")
        this.options.showInfo = this.options.showInfo.split(",");

    if (this.options.aspectRatio)
        this.options.aspectRatio = parseFloat(this.options.aspectRatio);

    //elements
    this.els = {
        node: node,
        preview: document.getElementById(this.options.previewID),
        input: node.getElementsByClassName("js-spiral-crop-input")[0],
        modal: node.getElementsByClassName("modal")[0],
        container: node.getElementsByClassName("crop-container")[0],
        previewInternal: node.getElementsByClassName("js-spiral-crop-preview-internal")[0],
        adjust: node.getElementsByClassName("js-spiral-crop-preview-adjust")[0],
        cropWrapper: node.getElementsByClassName("crop-wrapper")[0],
        imageOriginal: node.getElementsByClassName("image-original")[0],
        cropElements: node.getElementsByClassName("crop-elements")[0],
        cropSave: node.getElementsByClassName("crop-save")[0]
    };

    this.els.cropInfo = {
        ratio: node.getElementsByClassName("crop-ratio")[0]
    };

    this.els.handlers = {
        n: this.els.container.getElementsByClassName("handler-N")[0],
        ne: this.els.container.getElementsByClassName("handler-NE")[0],
        e: this.els.container.getElementsByClassName("handler-E")[0],
        se: this.els.container.getElementsByClassName("handler-SE")[0],
        s: this.els.container.getElementsByClassName("handler-S")[0],
        sw: this.els.container.getElementsByClassName("handler-SW")[0],
        w: this.els.container.getElementsByClassName("handler-W")[0],
        nw: this.els.container.getElementsByClassName("handler-NW")[0],
        current: null
    };

    this.els.dimmers = {
        el: this.els.container.getElementsByClassName("dimmers")[0],
        n: this.els.container.getElementsByClassName("dimmer-N")[0],
        e: this.els.container.getElementsByClassName("dimmer-E")[0],
        s: this.els.container.getElementsByClassName("dimmer-S")[0],
        w: this.els.container.getElementsByClassName("dimmer-W")[0]
    };

    this.reset();

    if (!this.options.dynamic) {
        this.els.form = this.els.input.querySelector("input").form;
        this.options.sForm = spiral.instancesController.getInstance("form", this.els.form);
        this.addEventListeners();
    }
    this.addCropperEventListeners();

    //IE10 click goes through cropper to background picture
    if (navigator.appVersion.indexOf("MSIE 10") != -1)
        this.els.cropElements.style.backgroundColor = "rgba(255,255,255,0.01";
};

/**
 *
 * @type {spiral.BaseDOMConstructor.prototype}
 * @lends spiral.Crop.prototype
 */
spiral.Crop.prototype = Object.create(spiral.BaseDOMConstructor.prototype);

/**
 * @override
 * @inheritDoc
 * @enum {string}
 */
spiral.Crop.prototype.attributesToGrab = {
    /**
     *  How to send: cropped or full size with coordinates to crop on server <b>Default: "cropped"</b> <i>Optional: "full"</i>
     */
    "data-sendFormat": {
        "value": "cropped",
        "key": "sendFormat"
    },
    /**
     *  Locked aspect ratio <b>Default: false</b>
     */
    "data-aspectRatio": {
        "value": false,
        "key": "aspectRatio"
    },
    /**
     *  What info to show <b>Default: []</b></br>
     *  <b>Example: </b>data-showInfo="ratio,origSize,croppedSIze"</br>
     *  <b>Note: </b>done only ratio
     */
    "data-showInfo": {
        "value": [],
        "key": "showInfo"
    },
    /**
     *  ID of preview element <b>Default: ""</b>
     */
    "data-previewID": {
        "value": "",
        "key": "previewID"
    },
    /**
     *  Name for formData <b>Default: "cropped"</b>
     */
    "data-name": {
        "value": "cropped",
        "key": "name"
    }
    //todo option immediate-show
};
spiral.Crop.prototype.reset = function () {
    this.v = {//V for Variables
        cursor: {x: 0, y: 0},
        crop: {x: 0, y: 0, x2: 0, y2: 0, w: 0, h: 0},
        toSave: {x: 0, y: 0, w: 0, h: 0},
        image: {w: 0, h: 0},
        old: {
            cursor: {x: 0, y: 0}
        },
        start: {
            crop: {x: 0, y: 0, w: 0, h: 0}
        },
        canvas: {w: 0, h: 0},
        orig: {},
        preview: {w: 0,h: 0},
        scale: 1
    };
    this.toUpdateOnCrop = true;
    this.setTop(0);
    this.setLeft(0);
    this.setWidth(0);
    this.setHeight(0);

    if (this.els.imageOriginal.lastChild)
        this.els.imageOriginal.removeChild(this.els.imageOriginal.lastChild);
};
/**
 * Changes crop info if need.
 * @param type {string}
 * @param value {string|number}
 */
spiral.Crop.prototype.changeInfo = function (type, value) {
    switch (type){
        case "ratio":
            this.els.cropInfo.ratio.innerHTML = "Aspect ratio: " + value;
            break;
        default:
            break;
    }
};
/**
 * Shows modal with cropper
 */
spiral.Crop.prototype.showPopup = function () {
    if ($)
        $(this.els.modal).modal('show');
};
/**
 * Hides modal with cropper
 */
spiral.Crop.prototype.hidePopup = function () {
    if ($)
        $(this.els.modal).modal('hide');
};

/**
 * Adds events listeners.
 */
spiral.Crop.prototype.addEventListeners = function () {
    var that = this;

    this.els.input.addEventListener('change', function (e) {
        //IE9 doesn't support File API
        var file = e.target.files[0];
        if (!file.type.match(/image/)) {
            alert("Please select an image.");
            return;
        }
        that.handleFileSelect(file);
        that.els.adjust.style.display = 'inline-block';
    }, false);

    if (this.els.preview) {
        this.els.preview.addEventListener('click', function () {
            if (that.readyToPrepare)
                that.prepare();
            that.showPopup();
        }, false);
    } else {
        this.els.adjust.addEventListener('mouseenter', function () {
            that.els.previewInternal.parentNode.style.display = 'block';
        }, false);

        this.els.adjust.addEventListener('mouseleave', function () {
            that.els.previewInternal.parentNode.style.display = 'none';
        }, false);
    }

    this.els.adjust.addEventListener('click', function () {
        if (that.readyToPrepare)
            that.prepare();
        that.showPopup();
    }, false);
};

/**
 * Adds cropper events listeners.
 */
spiral.Crop.prototype.addCropperEventListeners = function () {
    var that = this;

    this.els.cropSave.addEventListener("click", function () {
        that.save();
        that.hidePopup();
    });

    this.els.cropWrapper.addEventListener("mousedown", function (e) {
        that.onCropStart(e);
        that.inCropping = true;
    });
    document.addEventListener("mousemove", function (e) {
        if (that.inCropping) {
            e.preventDefault(); //prevent selecting background elements
            that.onCrop(e);
        }
    });
    this.els.cropWrapper.addEventListener("mouseup", function () {
        that.onCropEnd();
        that.inCropping = false;
    });
    document.addEventListener("mouseup", function () {
        that.onCropEnd();
        that.inCropping = false;
    });
};

/**
 * Sets preview
 * @param img
 */
spiral.Crop.prototype.setPreviewImage = function (img) {
    this.setExternalPreviewImage(img);
    if (this.els.previewInternal) {
        if (this.els.previewInternal.lastChild)
            this.els.previewInternal.removeChild(this.els.previewInternal.lastChild);
        this.els.previewInternal.appendChild(img);
    }
};

/**
 * Sets external preview
 * @param img
 */
spiral.Crop.prototype.setExternalPreviewImage = function (img) {
    if (this.els.preview) {
        while (this.els.preview.firstChild) {
            this.els.preview.removeChild(this.els.preview.firstChild);
        }
        var newImg = img.cloneNode(true);
        newImg.style.maxWidth = "100%";
        this.els.preview.appendChild(newImg);
    }
};

/**
 * Reads file, selected by user
 * @param file
 */
spiral.Crop.prototype.handleFileSelect = function (file) {
    var that = this;
    this.reader = new FileReader();
    this.reset();
    this.reader.onload = (function (theFile) {
        return function (e) {
            that.file = {
                file: theFile,
                blob: theFile,
                name: encodeURIComponent(theFile.name),
                base64: e.target.result
            };
            that.img = new Image();
            that.img.src = that.file.base64;
            that.img.onload = function () {
                that.setPreviewImage(that.img);
                that.v.preview.h = that.img.clientHeight;
                that.v.preview.w = that.img.clientWidth;
                that.v.orig.h = that.img.naturalHeight;
                that.v.orig.w = that.img.naturalWidth;
                that.v.orig.ratio = that.v.orig.w / that.v.orig.h;
                that.v.scale = that.v.orig.w / that.v.canvas.w;
                that.v.toSave.w = that.v.orig.w;
                that.v.toSave.h = that.v.orig.h;
                that.attachData();

                if (that.els.imageOriginal.lastChild)
                    that.els.imageOriginal.removeChild(that.els.imageOriginal.lastChild);
                that.readyToPrepare = true;
                if (that.options.aspectRatio) {
                    that.prepare();
                    that.showPopup();
                }
            };
        };
    })(file);

    this.reader.readAsDataURL(file);
};

/**
 * Prepares canvas, calculates coordinates
 */
spiral.Crop.prototype.prepare = function () {
    var that = this;
    //var c = document.createElement("canvas");//TODO think about this (now switched to img)
    //c.width = that.v.canvas.w;
    //c.height = that.v.canvas.w / that.v.orig.ratio;
    //var ctx = c.getContext("2d");
    //function drawImageOnCanvas() {//fix to NS_ERROR_NOT_AVAILABLE in firefox with ctx.drawImage
    //    try {
    //        ctx.drawImage(that.img, 0, 0, that.v.canvas.w, that.v.canvas.w / that.v.orig.ratio);
    //    } catch (e) {
    //        if (e.name == "NS_ERROR_NOT_AVAILABLE") {
    //            setTimeout(drawImageOnCanvas, 0);
    //        } else {
    //            throw e;
    //        }
    //    }
    //}
    //drawImageOnCanvas();
    that.els.imageOriginal.appendChild(this.img);
    setTimeout(function () {
        that.v.image.w = that.els.imageOriginal.lastChild.clientWidth;
        that.v.image.h = that.els.imageOriginal.lastChild.clientHeight;
        that.v.canvas.w = that.v.image.w;
        that.v.scale = that.v.orig.w / that.v.canvas.w;
        that.v.start.crop.w = that.v.image.w;
        that.v.start.crop.h = that.v.image.h;
        that.setWidth(that.v.image.w);
        that.setHeight(that.v.image.h);
        that.v.crop.x2 = that.v.image.w;
        that.v.crop.y2 = that.v.image.h;

        if (that.options.aspectRatio) {
            if (that.v.orig.ratio > that.options.aspectRatio) {
                var w = that.v.crop.w;
                that.setWidth(Math.round(that.v.start.crop.h * that.options.aspectRatio));
                that.v.start.crop.w = that.v.crop.w;
                that.setLeft(Math.round((w - that.v.crop.w) / 2));
                that.v.crop.x2 = that.v.crop.x + that.v.crop.w;
            } else {
                var h = that.v.crop.h;
                that.setHeight(Math.round(that.v.start.crop.w / that.options.aspectRatio));
                that.v.start.crop.h = that.v.crop.h;
                that.setTop(Math.round((h - that.v.crop.h) / 2));
                that.v.crop.y2 = that.v.crop.y + that.v.crop.h;
            }

            if (that.options.showInfo.length > 0) {
                that.options.showInfo.forEach(function(info){
                    if (info == "ratio") {
                        that.changeInfo("ratio", that.options.aspectRatio);
                    }
                });
            }

            that.save();
        }

        that.readyToPrepare = false;
    }, 50);
};

/**
 * Converts dataURI to Blob.
 * http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
 * @param dataURI
 * @returns {Blob}
 */
spiral.Crop.prototype.dataURItoBlob = function (dataURI) {

    var content = [],
        byteString,
        mimeString;

    if (dataURI.split(',')[0].indexOf('base64') !== -1) {
        byteString = atob(dataURI.split(',')[1])
    } else {
        byteString = decodeURI(dataURI.split(',')[1])
    }

    mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    for (var i = 0; i < byteString.length; i++) {
        content[i] = byteString.charCodeAt(i)
    }

    return new Blob([new Uint8Array(content)], {type: mimeString});
};

/**
 * Saves results to preview.
 */
spiral.Crop.prototype.save = function () {
    var that = this;
    var c = document.createElement("canvas"),
        ctx = c.getContext("2d"),
        img;
    this.v.toSave = {//CoordinateS
        w: Math.round(this.v.crop.w * this.v.scale),
        h: Math.round(this.v.crop.h * this.v.scale),
        x: Math.round(this.v.crop.x * this.v.scale),
        y: Math.round(this.v.crop.y * this.v.scale)
    };

    c.width = this.v.toSave.w;
    c.height = this.v.toSave.h;

    function drawImageOnCanvas() {
        try {
            ctx.drawImage(that.img, that.v.toSave.x, that.v.toSave.y, that.v.toSave.w, that.v.toSave.h, 0, 0, that.v.toSave.w, that.v.toSave.h);
        } catch (e) {
            if (e.name == "NS_ERROR_NOT_AVAILABLE") {
                setTimeout(drawImageOnCanvas, 0);
            } else {
                throw e;
            }
        }
    }
    drawImageOnCanvas();
    this.strDataURI = c.toDataURL("image/jpeg", 0.95);

    img = new Image();
    img.src = this.strDataURI;

    this.setPreviewImage(img);
    this.file.blob = this.dataURItoBlob(this.strDataURI);
};

/**
 * Attaches data to formData
 */
spiral.Crop.prototype.attachData = function () {
    var that = this;

    if (this.options.sForm) {
        if (this.options.sendFormat == "cropped") {
            this.options.sForm.events.registerAction("beforeSubmit", function (options) {
                options.data.append(that.options.name, that.file.blob, that.file.name);
            });
        } else {
            this.options.sForm.events.registerAction("beforeSubmit", function (options) {
                options.data.append(that.options.name, that.file.file);
                options.data.append("cropWidth", that.v.toSave.w);
                options.data.append("cropHeight", that.v.toSave.h);
                options.data.append("cropX", that.v.toSave.x);
                options.data.append("cropY", that.v.toSave.y);
            });
        }
    }
};

/**
 * Processes crop start.
 * @param {Event} e
 */
spiral.Crop.prototype.onCropStart = function (e) {
    this.els.handlers.current = e.target;
    this.v.offset = this.els.cropWrapper.getBoundingClientRect();
    this.v.cursor.x = Math.round(e.clientX - this.v.offset.left);
    this.v.cursor.y = Math.round(e.clientY - this.v.offset.top);
    this.v.cursor.offsetX = e.offsetX === undefined ? Math.round(e.layerX) : Math.round(e.offsetX);
    this.v.cursor.offsetY = e.offsetY === undefined ? Math.round(e.layerY) : Math.round(e.offsetY);
    if (this.toUpdateOnCrop) {
        this.v.canvas.w = this.els.imageOriginal.lastChild.clientWidth;
        this.v.scale = this.v.orig.w / this.v.canvas.w;
        this.toUpdateOnCrop = false;
    }
};

/**
 * Processes cropping (mouse move)
 * @param  {Event} e
 */
spiral.Crop.prototype.onCrop = function (e) {
    if (!this.els.handlers.current) return;
    this.v.cursor.x = Math.round(e.clientX - this.v.offset.left);
    this.v.cursor.y = Math.round(e.clientY - this.v.offset.top);
    switch (this.els.handlers.current) {
        case this.els.handlers.n:
            this.setN();
            break;
        case this.els.handlers.ne:
            this.setNE();
            break;
        case this.els.handlers.e:
            this.setE();
            break;
        case this.els.handlers.se:
            this.setSE();
            break;
        case this.els.handlers.s:
            this.setS();
            break;
        case this.els.handlers.sw:
            this.setSW();
            break;
        case this.els.handlers.w:
            this.setW();
            break;
        case this.els.handlers.nw:
            this.setNW();
            break;
        case this.els.cropElements:
            this.move();
            break;
    }
};

/**
 * Process crop end.
 */
spiral.Crop.prototype.onCropEnd = function () {
    this.els.handlers.current = null;
};
/**
 * Sets left side of cropper
 * @param x {number}
 */
spiral.Crop.prototype.setLeft = function (x) {
    this.v.crop.x = x;
    this.els.cropElements.style.left = x + "px";
    this.els.dimmers.el.style.left = x + "px";
};
/**
 * Sets top side of cropper
 * @param y {number}
 */
spiral.Crop.prototype.setTop = function (y) {
    this.v.crop.y = y;
    this.els.cropElements.style.top = y + "px";
    this.els.dimmers.el.style.top = y + "px";
};
/**
 * Sets width of cropper
 * @param w {number}
 */
spiral.Crop.prototype.setWidth = function (w) {
    this.v.crop.w = w;
    this.els.cropElements.style.width = w + "px";
    this.els.dimmers.el.style.width = w + "px";
};
/**
 * Sets height of cropper
 * @param h {number}
 */
spiral.Crop.prototype.setHeight = function (h) {
    this.v.crop.h = h;
    this.els.cropElements.style.height = h + "px";
    this.els.dimmers.el.style.height = h + "px";
};

/**
 * Adjusts coordinates.
 * @param {boolean|undefined} notDefaultSide
 * @param {number} y
 */
spiral.Crop.prototype.adjustN = function (notDefaultSide, y) {
    if (notDefaultSide) {
        if ((this.v.crop.y2 - y) * this.options.aspectRatio <= this.v.crop.x2) {
            this.setTop(y);
            this.setHeight(this.v.crop.y2 - y);
            this.setWidth(Math.round(this.v.crop.h * this.options.aspectRatio));
            this.setLeft(this.v.crop.x2 - this.v.crop.w);
        } else {
            this.setLeft(0);
            this.setWidth(this.v.crop.x2);
            this.setTop(this.v.crop.y2 - Math.round(this.v.crop.w / this.options.aspectRatio));
        }
    } else {
        if ((this.v.crop.y2 - y) * this.options.aspectRatio + this.v.crop.x <= this.v.image.w) {
            this.setTop(y);
            this.setHeight(this.v.crop.y2 - y);
            this.setWidth(Math.round(this.v.crop.h * this.options.aspectRatio));
            this.v.crop.x2 = this.v.crop.x + this.v.crop.w;
        } else {
            this.setWidth(this.v.image.w - this.v.crop.x);
            this.setTop(this.v.crop.y2 - Math.round(this.v.crop.w / this.options.aspectRatio));
            this.setHeight(this.v.crop.y2 - this.v.crop.y);
            this.v.crop.x2 = this.v.image.w;
        }
    }
};

/**
 * Sets top coordinates and border.
 * @param {Boolean} [notDefaultSide]
 */
spiral.Crop.prototype.setN = function (notDefaultSide) {
    if (this.options.aspectRatio) {
        if (this.v.cursor.y > 0) {
            if (this.v.cursor.y < this.v.crop.y2) {
                this.adjustN(notDefaultSide, this.v.cursor.y);
            } else {
                this.setHeight(1);
                this.setWidth(Math.round(this.v.crop.h * this.options.aspectRatio));
                if (notDefaultSide) {
                    this.setLeft(this.v.crop.x2 - 1);
                } else {
                    this.v.crop.x2 = this.v.crop.x + this.v.crop.w;
                }
                this.setTop(this.v.crop.y2 - 1);
            }
        } else {
            this.adjustN(notDefaultSide, 0);
        }
    } else {
        if (this.v.cursor.y > 0) {
            if (this.v.cursor.y < this.v.crop.y2) {
                this.setTop(this.v.cursor.y);
                this.setHeight(this.v.crop.y2 - this.v.crop.y);
            } else {
                this.setTop(this.v.crop.y2 - 1);
                this.setHeight(1);
            }
        } else {
            this.setTop(0);
            this.setHeight(this.v.crop.y2);
        }
    }
};

/**
 * Adjusts coordinates.
 * @param {boolean|undefined} notDefaultSide
 * @param {number} y2
 */
spiral.Crop.prototype.adjustS = function (notDefaultSide, y2) {
    if (notDefaultSide) {
        if ((y2 - this.v.crop.y) * this.options.aspectRatio <= this.v.crop.x2) {
            this.setHeight(y2 - this.v.crop.y);
            this.setWidth(Math.round(this.v.crop.h * this.options.aspectRatio));
            this.setLeft(this.v.crop.x2 - this.v.crop.w);
            this.v.crop.y2 = y2;
        } else {
            this.setLeft(0);
            this.setWidth(this.v.crop.x2);
            this.setHeight(Math.round(this.v.crop.w / this.options.aspectRatio));
            this.v.crop.y2 = this.v.crop.y + this.v.crop.h;
        }
    } else {
        if ((y2 - this.v.crop.y) * this.options.aspectRatio + this.v.crop.x <= this.v.image.w) {
            this.setHeight(y2 - this.v.crop.y);
            this.setWidth(Math.round(this.v.crop.h * this.options.aspectRatio));
            this.v.crop.y2 = y2;
            this.v.crop.x2 = this.v.crop.x + this.v.crop.w;
        } else {
            this.setWidth(this.v.image.w - this.v.crop.x);
            this.setHeight(Math.round(this.v.crop.w / this.options.aspectRatio));
            this.v.crop.x2 = this.v.image.w;
            this.v.crop.y2 = this.v.crop.y + this.v.crop.h;
        }
    }
};

/**
 * Sets bottom coordinates and border.
 * @param {Boolean} [notDefaultSide]
 */
spiral.Crop.prototype.setS = function (notDefaultSide) {
    if (this.options.aspectRatio) {
        if (this.v.cursor.y < this.v.image.h) {
            if (this.v.cursor.y > this.v.crop.y) {
                this.adjustS(notDefaultSide, this.v.cursor.y);
            } else {
                this.setHeight(1);
                this.setWidth(Math.round(this.v.crop.h * this.options.aspectRatio));
                if (notDefaultSide) {
                    this.setLeft(this.v.crop.x2 - 1);
                } else {
                    this.v.crop.x2 = this.v.crop.x + this.v.crop.w;
                }
                this.v.crop.y2 = this.v.crop.y + 1;
            }
        } else {
            this.adjustS(notDefaultSide, this.v.image.h);
        }
    } else {
        if (this.v.cursor.y < this.v.image.h) {
            if (this.v.cursor.y > this.v.crop.y) {
                this.setHeight(this.v.cursor.y - this.v.crop.y);
                this.v.crop.y2 = this.v.cursor.y;
            } else {
                this.setHeight(1);
                this.v.crop.y2 = this.v.crop.y + 1;
            }
        } else {
            this.setHeight(this.v.image.h - this.v.crop.y);
            this.v.crop.y2 = this.v.image.h;
        }
    }
};

/**
 * Adjusts coordinates.
 * @param {boolean|undefined} notDefaultSide
 * @param {number} x
 */
spiral.Crop.prototype.adjustW = function (notDefaultSide, x) {
    if (notDefaultSide) {
        if (this.v.crop.y2 - (this.v.crop.x2 - x) / this.options.aspectRatio >= 0) {
            this.setLeft(x);
            this.setWidth(this.v.crop.x2 - x);
            this.setHeight(Math.round(this.v.crop.w / this.options.aspectRatio));
            this.setTop(this.v.crop.y2 - this.v.crop.h);
        } else {
            this.setTop(0);
            this.setHeight(this.v.crop.y2);
            this.setWidth(Math.round(this.v.crop.h * this.options.aspectRatio));
            this.setLeft(this.v.crop.x2 - this.v.crop.w);
        }
    } else {
        if ((this.v.crop.x2 - x) / this.options.aspectRatio + this.v.crop.y <= this.v.image.h) {
            this.setLeft(x);
            this.setWidth(this.v.crop.x2 - x);
            this.setHeight(Math.round(this.v.crop.w / this.options.aspectRatio));
            this.v.crop.y2 = this.v.crop.y + this.v.crop.h;
        } else {
            this.setHeight(this.v.image.h - this.v.crop.y);
            this.setWidth(Math.round(this.v.crop.h * this.options.aspectRatio));
            this.setLeft(this.v.crop.x2 - this.v.crop.w);
            this.v.crop.y2 = this.v.image.h;
        }
    }
};

/**
 * Sets left coordinates and border.
 * @param {Boolean} [notDefaultSide]
 */
spiral.Crop.prototype.setW = function (notDefaultSide) {
    if (this.options.aspectRatio) {
        if (this.v.cursor.x > 0) {
            if (this.v.cursor.x < this.v.crop.x2) {
                this.adjustW(notDefaultSide, this.v.cursor.x);
            } else {
                this.setWidth(1);
                this.setHeight(Math.round(this.v.crop.w / this.options.aspectRatio));
                if (notDefaultSide) {
                    this.setTop(this.v.crop.y2 - 1);
                } else {
                    this.v.crop.y2 = this.v.crop.y + this.v.crop.h;
                }
            }
        } else {
            this.adjustW(notDefaultSide, 0);
        }
    } else {
        if (this.v.cursor.x > 0) {
            if (this.v.cursor.x < this.v.crop.x2) {
                this.setLeft(this.v.cursor.x);
                this.setWidth(this.v.crop.x2 - this.v.crop.x);
            } else {
                this.setLeft(this.v.crop.x2 - 1);
                this.setWidth(1);
            }
        } else {
            this.setLeft(0);
            this.setWidth(this.v.crop.x2);
        }
    }
};

/**
 * Adjusts coordinates.
 * @param {boolean|undefined} notDefaultSide
 * @param {number} x
 */
spiral.Crop.prototype.adjustE = function (notDefaultSide, x) {
    if (notDefaultSide) {
        if (this.v.crop.y2 - (x - this.v.crop.x) / this.options.aspectRatio >= 0) {
            this.setWidth(x - this.v.crop.x);
            this.setHeight(Math.round(this.v.crop.w / this.options.aspectRatio));
            this.setTop(this.v.crop.y2 - this.v.crop.h);
            this.v.crop.x2 = x;
        } else {
            this.setTop(0);
            this.setHeight(this.v.crop.y2);
            this.setWidth(Math.round(this.v.crop.h * this.options.aspectRatio));
            this.v.crop.x2 = this.v.crop.x + this.v.crop.w;
        }
    } else {
        if ((x - this.v.crop.x) / this.options.aspectRatio + this.v.crop.y <= this.v.image.h) {
            this.setWidth(x - this.v.crop.x);
            this.setHeight(Math.round(this.v.crop.w / this.options.aspectRatio));
            this.v.crop.x2 = x;
            this.v.crop.y2 = this.v.crop.y + this.v.crop.h;
        } else {
            this.setHeight(this.v.image.h - this.v.crop.y);
            this.setWidth(Math.round(this.v.crop.h * this.options.aspectRatio));
            this.v.crop.y2 = this.v.image.h;
            this.v.crop.x2 = this.v.crop.x + this.v.crop.w;
        }
    }
};

/**
 * Sets right coordinates and border.
 * @param {Boolean} [notDefaultSide]
 */
spiral.Crop.prototype.setE = function (notDefaultSide) {
    if (this.options.aspectRatio) {
        if (this.v.cursor.x < this.v.image.w) {
            if (this.v.cursor.x > this.v.crop.x) {
                this.adjustE(notDefaultSide, this.v.cursor.x);
            } else {
                this.setWidth(1);
                this.setHeight(Math.round(this.v.crop.w / this.options.aspectRatio));
                if (notDefaultSide) {
                    this.setTop(this.v.crop.y2 - 1);
                } else {
                    this.v.crop.y2 = this.v.crop.y + this.v.crop.h;
                }
                this.v.crop.x2 = this.v.crop.x + 1;
            }
        } else {
            this.adjustE(notDefaultSide, this.v.image.w);
        }
    } else {
        if (this.v.cursor.x < this.v.image.w) {
            if (this.v.cursor.x > this.v.crop.x) {
                this.setWidth(this.v.cursor.x - this.v.crop.x);
                this.v.crop.x2 = this.v.cursor.x;
            } else {
                this.setWidth(1);
                this.v.crop.x2 = this.v.crop.x + 1;
            }
        } else {
            this.setWidth(this.v.image.w - this.v.crop.x);
            this.v.crop.x2 = this.v.image.w;
        }
    }
};

/**
 * Sets top-right corner.
 */
spiral.Crop.prototype.setNE = function () {
    if (this.options.aspectRatio) {
        if (Math.abs(this.v.cursor.x - this.v.crop.x2) > Math.abs(this.v.cursor.y - this.v.crop.y) && this.v.cursor.x <= this.v.crop.x2) {
            this.setN();
        } else {
            (this.v.cursor.y >= this.v.crop.y) ? this.setE(true) : this.setN();
        }
    } else {
        this.setN();
        this.setE();
    }
};

/**
 * Sets bottom-right corner.
 */
spiral.Crop.prototype.setSE = function () {
    if (this.options.aspectRatio) {
        if (Math.abs(this.v.cursor.x - this.v.crop.x2) > Math.abs(this.v.cursor.y - this.v.crop.y - this.v.crop.h) && this.v.cursor.x <= this.v.crop.x2) {
            this.setS();
        } else {
            (this.v.cursor.y <= this.v.crop.y + this.v.crop.h) ? this.setE() : this.setS();
        }
    } else {
        this.setS();
        this.setE();
    }
};

/**
 * Sets bottom-left corner.
 */
spiral.Crop.prototype.setSW = function () {
    if (this.options.aspectRatio) {
        if (Math.abs(this.v.cursor.x - this.v.crop.x) > Math.abs(this.v.cursor.y - this.v.crop.y - this.v.crop.h) && this.v.cursor.x >= this.v.crop.x) {
            this.setS(true);
        } else {
            (this.v.cursor.y <= this.v.crop.y + this.v.crop.h) ? this.setW() : this.setS(true);
        }
    } else {
        this.setS();
        this.setW();
    }
};

/**
 * Sets top-left corner.
 */
spiral.Crop.prototype.setNW = function () {
    if (this.options.aspectRatio) {
        if (Math.abs(this.v.cursor.x - this.v.crop.x) > Math.abs(this.v.cursor.y - this.v.crop.y) && this.v.cursor.x >= this.v.crop.x) {
            this.setN(true);
        } else {
            (this.v.cursor.y >= this.v.crop.y) ? this.setW(true) : this.setN(true);
        }
    } else {
        this.setN();
        this.setW();
    }
};

/**
 * Processes move crop selection.
 */
spiral.Crop.prototype.move = function () {
    var left = this.v.cursor.x - this.v.cursor.offsetX;
    var top = this.v.cursor.y - this.v.cursor.offsetY;
    if (left > 0) {
        if (left + this.v.crop.w < this.v.image.w) {
            this.setLeft(left);
        } else {
            this.setLeft(this.v.image.w - this.v.crop.w);
        }
    } else {
        this.setLeft(0);
    }

    if (top > 0) {
        if (top + this.v.crop.h < this.v.image.h) {
            this.setTop(top);
        } else {
            this.setTop(this.v.image.h - this.v.crop.h);
        }
    } else {
        this.setTop(0);
    }

    this.v.crop.x2 = this.v.crop.x + this.v.crop.w;
    this.v.crop.y2 = this.v.crop.y + this.v.crop.h;
};

spiral.Crop.prototype.die = function () {
    console.error("TODO DIE");//TODO DIE
};

spiral.instancesController.addInstanceType("crop", "js-spiral-crop", spiral.Crop);