/**
 * spiral.editor it\s a editor manager for spiral.
 * @constructor
 *
 */

spiral.Editor = function(buttonClass){
    "use strict";
    /**
     * storage for editors
     * @property {object}   id                   - ID of textarea
     * @property {object}   id.type              - type of editor
     * @property {function} id.type.init()       - Init() method of editor
     * @property {function} id.type.die()        - Die() method of editor
     */
    this.storage={};

    var that = this,
        nodes = document.getElementsByClassName(buttonClass);//get all buttons
    for (var i = 0, max = nodes.length; i < max; i++) {
        nodes[i].addEventListener("click", function (e) {
            that.processClick.call(that, e); // add event lisner
        }, false);
    }
};

/**
 * Process click on select editor button
 * @param {Event} e click event
 */
spiral.Editor.prototype.processClick = function (e) {
    "use strict";
    if (e.target.classList.contains("active")) { //if already active exit
        e.preventDefault();
        e.stopPropagation();
        return;
    }
    this.setEditor(e.currentTarget.getAttribute("data-id"), e.target.getAttribute("data-type"));//call set editor

    var active = e.currentTarget.getElementsByClassName("active");// remove from all button class "active"
    for (var i = 0, max = active.length; i < max; i++) {
        active[i].classList.remove("active");
    }
    e.target.classList.add("active");//add to this button class "active"

};
/**
 * Process click on select editor button
 * @param {String} id id of element
 * @param {String} name name of editor
 */
spiral.Editor.prototype.setEditor = function (id, name) {
    "use strict";
    if (this.storage.hasOwnProperty(id)) {
        for (var type in this.storage[id]) {
            this.storage[id][type].die();//remove all editors
        }
        this.storage[id][name].init();
    }
};
/**
 * Describe editors (types and options)
 * @param {String} id - id of DOM editor container
 * @param {Object} describe - object ob properties
 */
spiral.Editor.prototype.describeEditors = function(id,describe){
    "use strict";
    this.storage[id] = describe;
};

spiral.editor = new spiral.Editor("js-spiral-editor-buttons");
