"use strict";
/**
 * Instance controller
 * @constructor
 */
spiral.InstancesController = function () {
    this._storage = {
        settings: {},
        instances: {}
    };
};
/**
 * Add new instance type
 * @param {String} typeName - type of instance
 * @param {String} className - class name of instance
 * @param {Function} constructorFunction - constructor function of instance
 */
spiral.InstancesController.prototype.addInstanceType = function (typeName, className, constructorFunction) {
    this._storage.settings[className] = {//init storage fields
        "typeName": typeName,
        "constructor": constructorFunction
    };
    this._storage.instances[typeName] = [];
    var nodes = document.getElementsByClassName(className);//init add nodes with this class
    for (var i = 0, max = nodes.length; i < max; i++) {
        this.addInstance(className, nodes[i]);
    }
};

/**
 * Add instance
 * @param {String} className - name of inited class
 * @param {Object} node - dom node
 * @param {Object} [options] all options for send to the constructor
 * @returns {boolean}
 */
spiral.InstancesController.prototype.addInstance = function (className, node, options) {
    var setting = this._storage.settings[className],
        isAlreadyAdded = this.getInstance(setting.typeName,node);
    if (!setting || isAlreadyAdded) {//if not found this type  or already added - return
        return false;
    }
//    console.log("Adding instance for type -",setting.typeName,". Node - ",node);
    this._storage.instances[setting.typeName].push({//add new instance of this type
        "node": node,
        "instance": new setting.constructor(node, options)
    });
    return true;
};
/**
 * Remove instance.
 * @param {String} className - name of inited class
 * @param {Object|String} node - dom node o dome node ID
 * @returns {boolean}
 */
spiral.InstancesController.prototype.removeInstance = function (className, node) {
    var setting = this._storage.settings[className],
        instanceObj = this.getInstance(setting.typeName, node,true),
        key;
    if (!instanceObj) {
        return false;
    }
    instanceObj.instance.die();//avoid memory leak
    key = this._storage.instances[setting.typeName].indexOf(instanceObj);
    if (key !== -1){//remove key
        this._storage.instances[setting.typeName].splice(key, 1);
    }
    return true;
};
/**
 * Get instance. Return instance object of this dom node
 * @param {String} typeName - type of instance
 * @param {Object|String} node - dom node o dome node ID
 * @param {boolean} [isReturnObject] - return object or instance
 * @returns {boolean}
 */
spiral.InstancesController.prototype.getInstance = function (typeName, node, isReturnObject) {
    var typeArr = this._storage.instances[typeName],
        ret = false;
    if (!typeArr) {
        return false;
    }
    node = (node instanceof HTMLElement) ? node : document.getElementById(node);
    if (!node) {
        return false;
    }
    for (var key = 0, l = typeArr.length; key < l; key++) {//iterate storage and try to find instance
        if (typeArr[key].node === node) {
            ret = (isReturnObject) ? typeArr[key] : typeArr[key].instance;
            break;
        }
    }
    return ret;
};

/**
 * Get all registered classes
 * @returns {Array}
 */
spiral.InstancesController.prototype.getClasses = function (){
    return Object.keys(this._storage.settings);
};

spiral.instancesController = new spiral.InstancesController();//init controller


