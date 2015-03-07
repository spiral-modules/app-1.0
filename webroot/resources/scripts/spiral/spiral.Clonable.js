"use strict";
/**
 * Clonable constructor for clonable tags
 * @param {Object} node dom node
 * @constructor
 */
spiral.Clonable= function(node){
    var that=this;
    this.node=node;
    this.clickFunction = function(e){that.processClick.call(that,e)};//for next remove
    this.node.addEventListener("click",this.clickFunction,false);

};
/**
 * Processing click in clonable container
 * @param {Event} e click event
 */
spiral.Clonable.prototype.processClick = function(e){
    var stopEvent=false;
    if (e.target.classList.contains("js-spiral-clonable-delete")){//if delete button pressed
        stopEvent=this.removeLine(e);
    } else if (e.target.classList.contains("js-spiral-clonable-add-more")){//if addMore button pressed
        stopEvent=this.addMore(e);
    }

    if (stopEvent){
        e.preventDefault();
        e.stopPropagation();
    }


};
/**
 * Process click on add more button
 * @param {Event} e click event
 * @returns {boolean} stopEvent Stop and cancel event
 */
spiral.Clonable.prototype.addMore = function(e){
    var templateId= e.currentTarget.getAttribute("data-templateID"),
        template=document.getElementById("js-template-"+templateId),
        lastIndex=parseInt(template.getAttribute("data-lastIndex"),10),
        compiledTemplate= spiral.template(template.innerHTML,{index: lastIndex+1}),
        newNode =spiral.createElement(compiledTemplate);
    e.currentTarget.getElementsByClassName("js-spiral-clonable-container")[0].appendChild(newNode);
    template.setAttribute("data-lastIndex",""+(lastIndex+1));//set new index
    this.checkMessage();
    return true;
};
/**
 * Process click on delete button
 * @param {Event} e click event
 * @returns {boolean} stopEvent Stop and cancel event
 */
spiral.Clonable.prototype.removeLine = function(e){
    var container = spiral.tools.closest(e.target,".js-spiral-clonable-row");
    container.parentNode.removeChild(container);
    this.checkMessage();
    return false;

};
/**
 * Check if need to show or hide a description message
 */
spiral.Clonable.prototype.checkMessage = function(){
    var message= this.node.getElementsByClassName("js-spiral-clonable-alert");
    if (this.node.getElementsByClassName("js-spiral-clonable-row").length === 0){
        message[0].classList.remove("hidden");
    } else {
        message[0].classList.add("hidden");
    }
};
/**
 * Clear all variables and die
 */
spiral.Clonable.prototype.die = function () {
    this.node.removeEventListener("click",this.clickFunction,false);
};
/**
 * Register instance
 */
spiral.instancesController.addInstanceType("clonable", "js-spiral-clonable", spiral.Clonable);
