"use strict";
/**
 * Helper to manipulate DOM Events. This method help us to remove all added events. It's very helpful for die() method of instances
 * @constructor
 */
spiral.DOMEvents = function(){
    /**
     * Internal storage for events
     * @property {Array.<Object>} DOMEvents - dom events array
     * @property {Object} DOMEvents.DOMNode -   DOM node
     * @property {String} DOMEvents.eventType -   Event type
     * @property {Function} DOMEvents.eventFunction -   Function
     * @property {Boolean} DOMEvents.useCapture=false -   useCapture
     * @property {Object} ... -   another object
     * @private
     */
    this._DOMEventsStorage = [];
};
/**
 * Add events
 * @param {Array.<Object>} eventArray - event array
 * @param {Object} eventArray.DOMNode -   DOM node
 * @param {String} eventArray.eventType -   Event type
 * @param {Function} eventArray.eventFunction -   Function
 * @param {Boolean} [eventArray.useCapture=false] -   useCapture
 */
spiral.DOMEvents.prototype.add = function(eventArray){
    eventArray.forEach(function(val){
        val.useCapture=!!(val.useCapture);
        val.DOMNode.addEventListener(val.eventType,val.eventFunction,val.useCapture);
        this._DOMEventsStorage.push(val);
    },this)
};
/**
 * Remove events
 * @param {Array.<Object>} eventArray - event array
 * @param {Object} eventArray.DOMNode -   DOM node
 * @param {String} eventArray.eventType -   Event type
 * @param {Function} eventArray.eventFunction -   Function
 * @param {Boolean} [eventArray.useCapture=false] -   useCapture
 */
spiral.DOMEvents.prototype.remove = function(eventArray){
//TODO IMPLEMENT
    // TODO не уверен что этот метод необходим. если надо часто убирать какието обработчики, то лучше поставить обработчки на родителя
    console.warn("TODO IMPLEMENT");

};
/**
 * Remove all dom events
 */
spiral.DOMEvents.prototype.removeAll = function(){
    this._DOMEventsStorage.forEach(function(val){
        val.DOMNode.removeEventListener(val.eventType,val.eventFunction,val.useCapture);
    });
    this._DOMEventsStorage=[];
};