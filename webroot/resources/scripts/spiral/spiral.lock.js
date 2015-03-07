"use strict";
/**
 * Spiral lock for forms
 * @constructor spiral.lock
 */
spiral.lock = {
    /**
     * Add lock
     * @param {String} type type of lock @see spiral.lock.lockTypes
     * @param {Object} context context to add lock
     * @returns {Function|*}
     */
    addLock: function (type, context) {
        if (this.lockTypes.hasOwnProperty(type)) {
            var node = document.createElement("div");
            node.className = "spiral-lock " + this.lockTypes[type].className;
            node.innerHTML = this.lockTypes[type].html;
            context.appendChild(node);
            context.classList.add("locked");
            return this.lockTypes[type].progress;
        }
        return false;
    },
    /**
     * Remove lock
     * @param {String} type type of lock
     * @param {Object} context
     */
    removeLock: function (type, context) {
        if (this.lockTypes.hasOwnProperty(type)) {
            context.classList.remove("locked");
            var spiralLock = context.querySelector(".spiral-lock");
            if (spiralLock)
                context.removeChild(spiralLock);
            return true;
        }
        return false;
    },
    /**
     * Object with lock types.
     * @enum {Object}

     */
    lockTypes: {
        /**
         * default lock type. <b>className:</b>spiral-lock-default
         * @type {Object}
         */
        "default": {
            /**
             * class name
             * @inner
             * @type String
             */
            className: "spiral-lock-default",
            /**
             * HTML
             * @inner
             * @type String
             */
            html: '<div id="circularG"><div id="circularG_1" class="circularG"></div><div id="circularG_2" class="circularG"></div><div id="circularG_3" class="circularG"></div><div id="circularG_4" class="circularG"></div><div id="circularG_5" class="circularG"></div><div id="circularG_6" class="circularG"></div><div id="circularG_7" class="circularG"></div><div id="circularG_8" class="circularG"></div></div>'
        },
        /**
         * opacity lock type.Just set opacity for node <b>className:</b>spiral-lock-opacity
         * @inner
         * @type Object
         */
        "opacity": {
            className: "spiral-lock-opacity",
            html: ''
        },
        /**
         * progress lock type. Show progress  <b>className:</b>spiral-lock-progress
         * @inner
         * @type Object
         */
        "progress": {
            className: "spiral-lock-progress",
            html: '<div class="progress progress-striped active"><div class="progress-bar"  role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"><span class="sr-only">0% Complete</span></div></div>',
            progress: function (current, total) {
                var progress = this.context.getElementsByClassName("progress-bar")[0],
                    sr = progress.getElementsByClassName("sr-only")[0],
                    percent = ''+100 * (current / total);
                progress.setAttribute("aria-valuenow", percent);
                progress.style.width = percent + "%";
                sr.innerHTML = percent + "%  Complete";
            }
        },
        /**
         * Gourmand lock type. <b>className:</b>spiral-lock-gourmand
         */

        "gourmand": {
            className: "spiral-lock-gourmand",
            html: '<div class="loader"><div class="loader-bg"><svg xmlns="http://www.w3.org/2000/svg" width="114.33" viewBox="0 0 114.334 62.5" enable-background="new 0 0 114.334 62.5"><text transform="translate(-1.331 61.58)" fill="#808080" font-family="&apos;Archer-Semibold&apos;" font-size="17" letter-spacing="1">FOUND EATS</text><path fill="#e6e6e6" d="m74.45 28.06c.879-1.074 1.659-2.232 2.324-3.459 1.73-3.175 2.716-6.812 2.716-10.674 0-.104-.009-.205-.021-.304-.173-7.142-6.02-12.899-13.184-12.899-3.557 0-6.788 1.412-9.172 3.703-2.385-2.303-5.626-3.722-9.193-3.722-7.182 0-13.04 5.783-13.187 12.946-.011.098-.018.197-.018.297 0 5.326 1.874 10.221 4.992 14.07l-.608.611c-1.028 1.026-1.028 2.69 0 3.717.511.513 1.186.771 1.856.771.675 0 1.346-.257 1.86-.771l.656-.656c3.777 2.906 8.501 4.64 13.624 4.64 5.102 0 9.811-1.72 13.58-4.607l.623.624c.514.513 1.187.77 1.858.77.673 0 1.346-.257 1.858-.77 1.027-1.026 1.027-2.692 0-3.718l-.564-.568m-17.392-9.958l9.853 9.853c-2.778 1.948-6.159 3.096-9.801 3.096-3.67 0-7.07-1.165-9.862-3.138l9.81-9.811m9.227-12.12c4.378 0 7.936 3.573 7.936 7.966 0 2.948-.751 5.725-2.066 8.15-.426.778-.911 1.518-1.447 2.219l-9.568-9.57c.006-.057.011-.113.016-.171.011-.207.013-.413.013-.622 0-1.803-.362-3.524-1.019-5.093 1.464-1.758 3.672-2.879 6.135-2.879m-18.365-.02c2.469 0 4.68 1.127 6.146 2.892-.664 1.576-1.027 3.306-1.027 5.119 0 .209.002.416.013.622.001.023.006.048.007.073l-9.594 9.593c-2.182-2.875-3.479-6.454-3.479-10.333-.002-4.392 3.558-7.966 7.934-7.966"/></svg></div><div class="loader-icon"><svg xmlns="http://www.w3.org/2000/svg" width="114.33" height="37.17" viewBox="0 0 114.334 37.167" enable-background="new 0 0 114.334 37.167"><path fill="#7f7f7f" d="m74.45 28.06c.879-1.074 1.659-2.232 2.324-3.459 1.73-3.175 2.716-6.812 2.716-10.674 0-.104-.009-.205-.021-.304-.173-7.142-6.02-12.899-13.184-12.899-3.557 0-6.788 1.412-9.172 3.703-2.385-2.303-5.626-3.722-9.193-3.722-7.182 0-13.04 5.783-13.187 12.946-.011.098-.018.197-.018.297 0 5.326 1.874 10.221 4.992 14.07l-.608.611c-1.028 1.026-1.028 2.69 0 3.717.511.513 1.186.771 1.856.771.675 0 1.346-.257 1.86-.771l.656-.656c3.777 2.906 8.501 4.64 13.624 4.64 5.102 0 9.811-1.72 13.58-4.607l.623.624c.514.513 1.187.77 1.858.77.673 0 1.346-.257 1.858-.77 1.027-1.026 1.027-2.692 0-3.718l-.564-.568m-17.392-9.958l9.853 9.853c-2.778 1.948-6.159 3.096-9.801 3.096-3.67 0-7.07-1.165-9.862-3.138l9.81-9.811m9.227-12.12c4.378 0 7.936 3.573 7.936 7.966 0 2.948-.751 5.725-2.066 8.15-.426.778-.911 1.518-1.447 2.219l-9.568-9.57c.006-.057.011-.113.016-.171.011-.207.013-.413.013-.622 0-1.803-.362-3.524-1.019-5.093 1.464-1.758 3.672-2.879 6.135-2.879m-18.365-.02c2.469 0 4.68 1.127 6.146 2.892-.664 1.576-1.027 3.306-1.027 5.119 0 .209.002.416.013.622.001.023.006.048.007.073l-9.594 9.593c-2.182-2.875-3.479-6.454-3.479-10.333-.002-4.392 3.558-7.966 7.934-7.966"/></svg></div></div>'
        },

        /**
         * Gourmand lock type. <b>className:</b>spiral-lock-gourmand
         */

        "gourmandNotFixed": {
            className: "spiral-lock-gourmand-not-fixed",
            html: '<div class="loader"><div class="loader-bg"><svg xmlns="http://www.w3.org/2000/svg" width="114.33" viewBox="0 0 114.334 62.5" enable-background="new 0 0 114.334 62.5"><text transform="translate(-1.331 61.58)" fill="#808080" font-family="&apos;Archer-Semibold&apos;" font-size="17" letter-spacing="1">FOUND EATS</text><path fill="#e6e6e6" d="m74.45 28.06c.879-1.074 1.659-2.232 2.324-3.459 1.73-3.175 2.716-6.812 2.716-10.674 0-.104-.009-.205-.021-.304-.173-7.142-6.02-12.899-13.184-12.899-3.557 0-6.788 1.412-9.172 3.703-2.385-2.303-5.626-3.722-9.193-3.722-7.182 0-13.04 5.783-13.187 12.946-.011.098-.018.197-.018.297 0 5.326 1.874 10.221 4.992 14.07l-.608.611c-1.028 1.026-1.028 2.69 0 3.717.511.513 1.186.771 1.856.771.675 0 1.346-.257 1.86-.771l.656-.656c3.777 2.906 8.501 4.64 13.624 4.64 5.102 0 9.811-1.72 13.58-4.607l.623.624c.514.513 1.187.77 1.858.77.673 0 1.346-.257 1.858-.77 1.027-1.026 1.027-2.692 0-3.718l-.564-.568m-17.392-9.958l9.853 9.853c-2.778 1.948-6.159 3.096-9.801 3.096-3.67 0-7.07-1.165-9.862-3.138l9.81-9.811m9.227-12.12c4.378 0 7.936 3.573 7.936 7.966 0 2.948-.751 5.725-2.066 8.15-.426.778-.911 1.518-1.447 2.219l-9.568-9.57c.006-.057.011-.113.016-.171.011-.207.013-.413.013-.622 0-1.803-.362-3.524-1.019-5.093 1.464-1.758 3.672-2.879 6.135-2.879m-18.365-.02c2.469 0 4.68 1.127 6.146 2.892-.664 1.576-1.027 3.306-1.027 5.119 0 .209.002.416.013.622.001.023.006.048.007.073l-9.594 9.593c-2.182-2.875-3.479-6.454-3.479-10.333-.002-4.392 3.558-7.966 7.934-7.966"/></svg></div><div class="loader-icon"><svg xmlns="http://www.w3.org/2000/svg" width="114.33" height="37.17" viewBox="0 0 114.334 37.167" enable-background="new 0 0 114.334 37.167"><path fill="#7f7f7f" d="m74.45 28.06c.879-1.074 1.659-2.232 2.324-3.459 1.73-3.175 2.716-6.812 2.716-10.674 0-.104-.009-.205-.021-.304-.173-7.142-6.02-12.899-13.184-12.899-3.557 0-6.788 1.412-9.172 3.703-2.385-2.303-5.626-3.722-9.193-3.722-7.182 0-13.04 5.783-13.187 12.946-.011.098-.018.197-.018.297 0 5.326 1.874 10.221 4.992 14.07l-.608.611c-1.028 1.026-1.028 2.69 0 3.717.511.513 1.186.771 1.856.771.675 0 1.346-.257 1.86-.771l.656-.656c3.777 2.906 8.501 4.64 13.624 4.64 5.102 0 9.811-1.72 13.58-4.607l.623.624c.514.513 1.187.77 1.858.77.673 0 1.346-.257 1.858-.77 1.027-1.026 1.027-2.692 0-3.718l-.564-.568m-17.392-9.958l9.853 9.853c-2.778 1.948-6.159 3.096-9.801 3.096-3.67 0-7.07-1.165-9.862-3.138l9.81-9.811m9.227-12.12c4.378 0 7.936 3.573 7.936 7.966 0 2.948-.751 5.725-2.066 8.15-.426.778-.911 1.518-1.447 2.219l-9.568-9.57c.006-.057.011-.113.016-.171.011-.207.013-.413.013-.622 0-1.803-.362-3.524-1.019-5.093 1.464-1.758 3.672-2.879 6.135-2.879m-18.365-.02c2.469 0 4.68 1.127 6.146 2.892-.664 1.576-1.027 3.306-1.027 5.119 0 .209.002.416.013.622.001.023.006.048.007.073l-9.594 9.593c-2.182-2.875-3.479-6.454-3.479-10.333-.002-4.392 3.558-7.966 7.934-7.966"/></svg></div></div>'
        }

    }
};