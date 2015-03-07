"use strict";
/**
 * Spiral Dom mutation. Listening to the DOM and add or remove instances based on classes.
 * @constructor
 */
spiral.DomMutations = function () {
    var config = {//config for MutationObserver
            attributes: true,
            childList: true,
            characterData: true,
            characterDataOldValue: true,
            subtree: true,
            attributeOldValue: true,
            attributeFilter: ["class"]
        },
        that = this;
    this.observer = new MutationObserver(function () {//call function when dom mutated.
        that.onDomMutate.apply(that, arguments)
    });
    this.observer.observe(document, config);//start observer

};
/**
 * When dom mutated this function id executed.
 * @param {Array} mutations array of mutations
 * @returns {boolean}
 */
spiral.DomMutations.prototype.onDomMutate = function (mutations) {
    if (!spiral.instancesController) {//if not all loaded exit
        return false;
    }
    var classArray = spiral.instancesController.getClasses();//get all registered classes
    var classSelector = "." + classArray.join(",.");//convert for querySelectorAll()
    if (classSelector.length === 1) {//if not registered any instanceTypes
        return false;
    }
    mutations.forEach(function (mutation) {//loop over mutation array
        switch (mutation.type) {
            case "attributes":
                this.processMutationAttributes(mutation, classArray);
                break;

            case "characterData":

                break;

            case "childList":
                this.processMutationChildList(mutation.addedNodes, "addInstance", classSelector, classArray);
                this.processMutationChildList(mutation.removedNodes, "removeInstance", classSelector, classArray);
                break;

            case "default":
                console.error("Something wrong. Contact tech support");
        }
    }, this);
    return true;
};

spiral.DomMutations.prototype.processMutationAttributes = function (mutation, classArray) {
    var currentClasses = Array.prototype.slice.call(mutation.target.classList, 0),
        oldClasses = (mutation.oldValue)?mutation.oldValue.split(" "):[],
        addedClasses = currentClasses.filter(function (val) {
            return (oldClasses.indexOf(val) === -1);
        }),
        removedClasses = oldClasses.filter(function (val) {
            return (currentClasses.indexOf(val) === -1);
        }),
        addedRegisteredClasses = addedClasses.filter(function (val) {
            return (classArray.indexOf(val) !== -1);
        }),
        removedRegisteredClasses = removedClasses.filter(function (val) {
            return (classArray.indexOf(val) !== -1);
        });
    removedRegisteredClasses.forEach(function (val) {
        spiral.instancesController.removeInstance(val, mutation.target);
    });
    addedRegisteredClasses.forEach(function (val) {
        spiral.instancesController.addInstance(val, mutation.target);
    });

};
/**
 * Process mutation on ChildList
 * @param {NodeList} nodesList array with nodes
 * @param {String} action action to call (add or remove nodes)
 * @param {String} classSelector - string selector for querySelectorAll
 * @param {Array} classArray - array of all registered classes
 */
spiral.DomMutations.prototype.processMutationChildList = function (nodesList, action, classSelector, classArray) {
    /**
     * Internal function for checking node class
     * @param {Object} node dom node
     */
    function checkNode(node) {
        classArray.forEach(function (className) {//loop over registered classes
            if (node.classList.contains(className)) {//if class match try to add or remove instance for this node
                spiral.instancesController[action](className, node);
            }
        });
    }

    [].forEach.call(nodesList, function (val) {//loop over mutation nodes
        if (val.nodeType !== 1 || val.nodeName === "SCRIPT" || val.nodeName === "LINK") {//do not process other nodes then ELEMENT_NODE https://developer.mozilla.org/en-US/docs/Web/API/Node.nodeType also ignore SCRIPT and LINK tag
            return false;
        }
        checkNode(val);//check mutation node
        [].forEach.call(val.querySelectorAll(classSelector), checkNode);//query all nodes with required classes and check it
        return true;
    });

};

/**
 * Stop listening the dom changes
 */
spiral.DomMutations.prototype.stopObserve = function () {
    this.observer.disconnect();
};

spiral.domMutations = new spiral.DomMutations();