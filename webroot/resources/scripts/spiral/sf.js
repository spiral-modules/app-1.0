(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   3.1.2
 */

(function() {
    "use strict";
    function lib$es6$promise$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$es6$promise$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$es6$promise$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$es6$promise$utils$$_isArray;
    if (!Array.isArray) {
      lib$es6$promise$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$es6$promise$utils$$_isArray = Array.isArray;
    }

    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
    var lib$es6$promise$asap$$len = 0;
    var lib$es6$promise$asap$$vertxNext;
    var lib$es6$promise$asap$$customSchedulerFn;

    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
      lib$es6$promise$asap$$len += 2;
      if (lib$es6$promise$asap$$len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (lib$es6$promise$asap$$customSchedulerFn) {
          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
        } else {
          lib$es6$promise$asap$$scheduleFlush();
        }
      }
    }

    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
    }

    function lib$es6$promise$asap$$setAsap(asapFn) {
      lib$es6$promise$asap$$asap = asapFn;
    }

    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$es6$promise$asap$$useNextTick() {
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // see https://github.com/cujojs/when/issues/410 for details
      return function() {
        process.nextTick(lib$es6$promise$asap$$flush);
      };
    }

    // vertx
    function lib$es6$promise$asap$$useVertxTimer() {
      return function() {
        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
      };
    }

    function lib$es6$promise$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$es6$promise$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$es6$promise$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$es6$promise$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$es6$promise$asap$$flush, 1);
      };
    }

    var lib$es6$promise$asap$$queue = new Array(1000);
    function lib$es6$promise$asap$$flush() {
      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
        var callback = lib$es6$promise$asap$$queue[i];
        var arg = lib$es6$promise$asap$$queue[i+1];

        callback(arg);

        lib$es6$promise$asap$$queue[i] = undefined;
        lib$es6$promise$asap$$queue[i+1] = undefined;
      }

      lib$es6$promise$asap$$len = 0;
    }

    function lib$es6$promise$asap$$attemptVertx() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$es6$promise$asap$$useVertxTimer();
      } catch(e) {
        return lib$es6$promise$asap$$useSetTimeout();
      }
    }

    var lib$es6$promise$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$es6$promise$asap$$isNode) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
    } else if (lib$es6$promise$asap$$isWorker) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
    } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertx();
    } else {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
    }
    function lib$es6$promise$then$$then(onFulfillment, onRejection) {
      var parent = this;
      var state = parent._state;

      if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
        return this;
      }

      var child = new this.constructor(lib$es6$promise$$internal$$noop);
      var result = parent._result;

      if (state) {
        var callback = arguments[state - 1];
        lib$es6$promise$asap$$asap(function(){
          lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
        });
      } else {
        lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
      }

      return child;
    }
    var lib$es6$promise$then$$default = lib$es6$promise$then$$then;
    function lib$es6$promise$promise$resolve$$resolve(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;

    function lib$es6$promise$$internal$$noop() {}

    var lib$es6$promise$$internal$$PENDING   = void 0;
    var lib$es6$promise$$internal$$FULFILLED = 1;
    var lib$es6$promise$$internal$$REJECTED  = 2;

    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$selfFulfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function lib$es6$promise$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$es6$promise$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
        return lib$es6$promise$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
       lib$es6$promise$asap$$asap(function(promise) {
        var sealed = false;
        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$es6$promise$$internal$$resolve(promise, value);
          } else {
            lib$es6$promise$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$es6$promise$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$es6$promise$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, thenable._result);
      } else {
        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable, then) {
      if (maybeThenable.constructor === promise.constructor &&
          then === lib$es6$promise$then$$default &&
          constructor.resolve === lib$es6$promise$promise$resolve$$default) {
        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$es6$promise$utils$$isFunction(then)) {
          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$es6$promise$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFulfillment());
      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
        lib$es6$promise$$internal$$handleMaybeThenable(promise, value, lib$es6$promise$$internal$$getThen(value));
      } else {
        lib$es6$promise$$internal$$fulfill(promise, value);
      }
    }

    function lib$es6$promise$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      lib$es6$promise$$internal$$publish(promise);
    }

    function lib$es6$promise$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$es6$promise$$internal$$FULFILLED;

      if (promise._subscribers.length !== 0) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
      }
    }

    function lib$es6$promise$$internal$$reject(promise, reason) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
      promise._state = lib$es6$promise$$internal$$REJECTED;
      promise._result = reason;

      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
    }

    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
      }
    }

    function lib$es6$promise$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$es6$promise$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$es6$promise$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$es6$promise$$internal$$reject(promise, error);
      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, value);
      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, value);
      }
    }

    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$es6$promise$$internal$$reject(promise, e);
      }
    }

    function lib$es6$promise$promise$all$$all(entries) {
      return new lib$es6$promise$enumerator$$default(this, entries).promise;
    }
    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
    function lib$es6$promise$promise$race$$race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (!lib$es6$promise$utils$$isArray(entries)) {
        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$es6$promise$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$es6$promise$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
    function lib$es6$promise$promise$reject$$reject(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

    var lib$es6$promise$promise$$counter = 0;

    function lib$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise's eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function lib$es6$promise$promise$$Promise(resolver) {
      this._id = lib$es6$promise$promise$$counter++;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if (lib$es6$promise$$internal$$noop !== resolver) {
        typeof resolver !== 'function' && lib$es6$promise$promise$$needsResolver();
        this instanceof lib$es6$promise$promise$$Promise ? lib$es6$promise$$internal$$initializePromise(this, resolver) : lib$es6$promise$promise$$needsNew();
      }
    }

    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;

    lib$es6$promise$promise$$Promise.prototype = {
      constructor: lib$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
      then: lib$es6$promise$then$$default,

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };
    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;
    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (Array.isArray(input)) {
        this._input     = input;
        this.length     = input.length;
        this._remaining = input.length;

        this._result = new Array(this.length);

        if (this.length === 0) {
          lib$es6$promise$$internal$$fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate();
          if (this._remaining === 0) {
            lib$es6$promise$$internal$$fulfill(this.promise, this._result);
          }
        }
      } else {
        lib$es6$promise$$internal$$reject(this.promise, this._validationError());
      }
    }

    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
      var length  = this.length;
      var input   = this._input;

      for (var i = 0; this._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        this._eachEntry(input[i], i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var c = this._instanceConstructor;
      var resolve = c.resolve;

      if (resolve === lib$es6$promise$promise$resolve$$default) {
        var then = lib$es6$promise$$internal$$getThen(entry);

        if (then === lib$es6$promise$then$$default &&
            entry._state !== lib$es6$promise$$internal$$PENDING) {
          this._settledAt(entry._state, i, entry._result);
        } else if (typeof then !== 'function') {
          this._remaining--;
          this._result[i] = entry;
        } else if (c === lib$es6$promise$promise$$default) {
          var promise = new c(lib$es6$promise$$internal$$noop);
          lib$es6$promise$$internal$$handleMaybeThenable(promise, entry, then);
          this._willSettleAt(promise, i);
        } else {
          this._willSettleAt(new c(function(resolve) { resolve(entry); }), i);
        }
      } else {
        this._willSettleAt(resolve(entry), i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var promise = this.promise;

      if (promise._state === lib$es6$promise$$internal$$PENDING) {
        this._remaining--;

        if (state === lib$es6$promise$$internal$$REJECTED) {
          lib$es6$promise$$internal$$reject(promise, value);
        } else {
          this._result[i] = value;
        }
      }

      if (this._remaining === 0) {
        lib$es6$promise$$internal$$fulfill(promise, this._result);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
      });
    };
    function lib$es6$promise$polyfill$$polyfill() {
      var local;

      if (typeof global !== 'undefined') {
          local = global;
      } else if (typeof self !== 'undefined') {
          local = self;
      } else {
          try {
              local = Function('return this')();
          } catch (e) {
              throw new Error('polyfill failed because global object is unavailable in this environment');
          }
      }

      var P = local.Promise;

      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
        return;
      }

      local.Promise = lib$es6$promise$promise$$default;
    }
    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

    var lib$es6$promise$umd$$ES6Promise = {
      'Promise': lib$es6$promise$promise$$default,
      'polyfill': lib$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
    }

    lib$es6$promise$polyfill$$default();
}).call(this);


}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":2}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
"use strict";

var tools = require("../helpers/tools");
var Events = require("../core/Events");
var LikeFormData = require("../helpers/LikeFormData");
/**
 * This is an Ajax transport.
 * Supports  XDomainRequest for old IE
 * @param {Object} [options]
 * @param {Object} [options.headers] Headers to add to the instance
 * @fires beforeSend event that will be performed before request is send. Event called with one parameter "options", that contains all variables for Ajax
 * @constructor
 */
var Ajax = function (options) {
    this.currentRequests = 0;
    this.events = new Events(["beforeSend", 'load']);

    if (options && options.headers) {
        this.headers = Object.assign(this.headers, options.headers);
    }
};

/**
 * Default headers. You can overwrite it. Look at the event beforeSend
 * Please note that on XDomainRequest  we can't send any headers.
 * @type Object
 */
Ajax.prototype.headers = {
    'X-Requested-With': 'XMLHttpRequest'
};

/**
 * Send ajax request to server
 * Will return promise or array with promise and XMLHttpRequest : {window.Promise|[window.Promise,XMLHttpRequest]}
 * @since 0.4.0
 * @param {Object} options object with options
 * @param {String} options.url url to send data
 * @param {Object|String} [options.data] data to send
 * @param {String} [options.method]
 * @param {Object} [options.headers] headers to add to the request
 * @param {Function} [options.onProgress] callback function on progress. Two callback options: current bytes sent,totalBytes
 * @param {Function} [options.isReturnXHRToo===false] should method return array instead of Promise. Some times is needed to control ajax (abort, etc). If tree then  [window.Promise,XMLHttpRequest ] will be returned
 * @returns {Promise|Array}
 */
Ajax.prototype.send = function (options) {
    var that = this;

    //TODO why we check here if data === null then reassign to null again?
    if (options.data === null || options.data === void 0 || options.data === 'undefined') {
        options.data = null;
    }
    if (!options.method) {
        options.method = "POST"
    }

    options.headers = options.headers ? Object.assign(options.headers, this.headers, options.headers) : Object.assign({}, this.headers);
    var xhr;
    var ajaxPromise =  new Promise(function (resolve, reject) {    // Return a new promise.
        if (!options.url) {
            console.error("You should provide url");
            reject("You should provide url");
        }
        that.currentRequests++;

        var oldIE = false;

        if ((typeof window !== 'undefined') && window.XDomainRequest && (window.XMLHttpRequest && new XMLHttpRequest().responseType === undefined) && (url.indexOf("http") === 0)) {//old IE CORS
            //TODO maybe we should use XDomainRequest only for cross domain requests? But  Spiral for now works great with XDomainRequest (based on IEJSON)
            xhr = new XDomainRequest();
            //http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
            oldIE = true;
            //http://social.msdn.microsoft.com/Forums/ie/en-US/30ef3add-767c-4436-b8a9-f1ca19b4812e/ie9-rtm-xdomainrequest-issued-requests-may-abort-if-all-event-handlers-not-specified?forum=iewebdevelopment
            xhr.onprogress = function (e) {
                //TODO adjust options
                options.onProgress && options.onProgress(e);
            };
        } else {
            xhr = new XMLHttpRequest();
            if (options.onProgress) {
                xhr.upload.addEventListener("progress", function (event) {
                    if (event.lengthComputable) {
                        options.onProgress(event.loaded, event.total);
                    }
                }, false);
            }

        }


        xhr.open(options.method, options.url);

        xhr.onload = function () {//On loaded
            that.currentRequests--;
            var ans = that._parseJSON(xhr);
            if (ans.status) {
                if (ans.status > 199 && ans.status < 300) {//200-299
                    resolve(ans);
                } else if (ans.status > 399 && ans.status < 600) {//400-599
                    reject(ans);
                } else {
                    console.error("unknown status %d. Rejecting", ans.status);
                    reject(ans);
                }

            } else if (oldIE) {
                resolve(ans);//OLD IE + downloading file is producing  no status.
            } else {
                reject(ans);//reject with the status text
            }
            options.response = ans;
            that.events.trigger("load", options);//for example - used to handle actions
        };
        xhr.onerror = function () {// Handle network errors
            that.currentRequests--;
            reject(Error("Network Error"), xhr);
        };

        that.events.trigger("beforeSend", options);//you can modify "options" object inside event (like adding you headers,data,etc)

        var dataToSend;
        if (options.data !== null) {//if data to send is not empty
            if (!oldIE) {
                if (options.data.toString().indexOf("FormData") !== -1) {//if form data
                    dataToSend = options.data;
                } else {
                    dataToSend = new LikeFormData(options.data);
                    options.headers["content-type"] = dataToSend.getContentTypeHeader();
                }
                that._setHeaders(xhr, options.headers);

            } else {
                dataToSend = "IEJSON" + JSON.stringify(options.data);
            }
        } else {//else send empty data
            dataToSend = null;
        }


//        if (!oldIE) {
//            //xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
//            dataToSend = new spiral.LikeFormData(data, xhr, oldIE);
//        } else {
//            if (data !==null && data !== void 0 && data !== 'undefined'){
//                dataToSend = "IEJSON"+JSON.stringify(data);
//            } else {
//                 dataToSend =data;
//            }
//
//        }


        try {//working around FF bug
            xhr.send(dataToSend);// Make the request
        } catch (e) {
            //console.error("error sending trying another method");
            xhr.send(dataToSend.toString());
        }

        return xhr;
    });

    if (options.isReturnXHRToo){//return xhr too
        return [ajaxPromise,xhr]
    }
    return ajaxPromise;
};

/**
 * Iterate over headers object and call xhr.setRequestHeader
 * @param {XMLHttpRequest} xhr
 * @param {Object} headers object with headers to set
 */
Ajax.prototype._setHeaders = function (xhr, headers) {
    for (var header in headers) {
        xhr.setRequestHeader(header, headers[header]);
    }

};
/**
 * Try to parse and normalize answer
 * @param xhr
 * @returns {*}
 * @private
 */
Ajax.prototype._parseJSON = function (xhr) {
    if (!xhr.response) {
        xhr.response = xhr.responseText;
    }
    var ret = {};
    var contentType = false;
    if (xhr.getResponseHeader) {
        contentType = xhr.getResponseHeader("Content-Type");
    }

    if (!contentType || contentType.toLowerCase() === 'application/json' || contentType.toLowerCase() === 'text/json' || contentType.toLowerCase() === 'inode/symlink') {//application/json or inode/symlink  (AmazonS3 bug? )
        try {
            ret = JSON.parse(xhr.response);
        } catch (e) {
            console.error("Not a JSON!", xhr.response);
            ret = {data: xhr.response};
        }
    } else {
        ret = {data: xhr.response};
    }

    if (!ret.status) {
        ret.status = xhr.status;
    }
    //Some servers can answer status in JSON as "HTTP/1.1 200 OK"  but we need a status number
    if (typeof ret.status === 'string' && ret.status.indexOf("HTTP/") === 0 && ret.status.match( / (\d\d\d)/ )) {
        ret.status = parseInt(ret.status.match( / (\d\d\d)/ )[1]);//TODO check this code
    }


    if (!ret.statusText) {
        ret.statusText = xhr.statusText;
    }
    if (xhr.status && xhr.status != ret.status) {
        console.warn("Status from request %d, but response contains status %d", xhr.status, ret.status)
    }

    return ret;

};


module.exports = Ajax;

},{"../core/Events":6,"../helpers/LikeFormData":11,"../helpers/tools":13}],4:[function(require,module,exports){
"use strict";

/**
 * This a base constructor (class) for any DOM based instance.
 * This constructor just grab all node attributes and generates options. All processed options stored at this.options
 * @example
 * We have html like this:
 * <div data-test="testValue" data-value="value123">.....</div>
 * this.options will be:
 * {
 *  test:"testValue",
 *  value:"value"
 * }
 * Note: data-test and data-value should be described in attributesToGrab
 * @constructor
 */
var BaseDOMConstructor = function () {
};
/**
 * Init method. Call after construct instance
 * @param {Object} sf
 * @param {Object} node  DomNode of form
 * @param {Object} [options] all options to override default
 */
BaseDOMConstructor.prototype.init = function (sf, node, options) {
    //TODO data-spiral-JSON
    this.sf = sf;
    this.node = node;
    //if (sf.options && sf.options.instances && sf.options.instances[this.name]) {
    //    options = Object.assign(options || {}, sf.options.instances[this.name]);
    //}
    this.options = Object.assign(this.grabOptions(node), options);
};

/**
 * This is a options to generate.
 * You should provide processor or value.
 * @type {Object}
 * @property {Object} propertyKey - object of property
 * @property {String} propertyKey.value - default value to return
 * @property {String} [propertyKey.domAttr] - dom attribute to grab data
 * @property {Function} [propertyKey.processor] -  processor to process data before return
 * @property {Object}  ... - Another object of one property
 * @type {{}}
 *  @example
 * "someAttribute": {// key
 *      value: true, //default Value
 *      domAttr: "data-some-attribute", // attribute from node to grab
 *      processor: function (node,val,self) { //processor to process values before return
 *          //some calculations
 *      return someValue;
 *      }
 *  },
 *  "anotherAttribute":{...},
 *  "..."
 *
 *  @example
 *  //return node as value
 *  "context": {
 *      "processor": function (node,val,key) { //processor
 *          return node;
 *      }
 *  },
 *  "Another-key":{...},
 *  "..."
 * @example
 * //Grab attribute "data-attribute" as "MyAttribute" if attribute not provided return "DefaultValue"
 * // Dom node <div data-attribute="someValue"></div>
 * "MyAttribute": {
 *      value: "DefaultValue",
 *      domAttr: "data-attribute"
 *  }
 *  //after processing we should have
 *  {"MyAttribute":"someValue"}
 *
 *  @example
 * //Grab attribute "data-attribute" as "MyAttribute" and return some value instead
 * //Dom node  <div data-attribute="someValue"></div>
 * "MyAttribute": {
 *      domAttr: "data-attribute",
 *      processor: function (node,val,self) {
 *          return val+"SomeCalculation";
 *      }
 *  }
 *  //after processing we should have
 *  {"MyAttribute":"someValueSomeCalculation"}
 *
 * @example
 * //return function as value
 * processAnswer: {
 *      "value": function (options) {
 *         return "someVal";
 *      }
 *  //after processing we should have
 *  {"processAnswer":function (options) {
 *         return "someVal";
 *      }
 *   }
 *
 * @example
 * //return init time as value
 * initTime: {
 *      "processor": function (node,val,self) {
 *         return new Date().getTime;
 *      }
 *  //after processing we should have
 *  {"initTime":1429808977404}
 * @example
 * //return other value instead of real one
 * processAnswer: {
 *      "processor": function (node,val,self) {
 *         return "someVal";
 *      }
 *  //after processing we should have
 *  {"processAnswer":"someVal"}
 */
BaseDOMConstructor.prototype.optionsToGrab = {};

/**
 * Grab all options that described in optionsToGrab
 * @param {Object} node domNode
 * @return {Object}
 */
BaseDOMConstructor.prototype.grabOptions = function (node) {
    var options = {};
    var currentOptionValue;
    var currentOption;
    for (var option in this.optionsToGrab) {
        currentOptionValue = null;
        if (this.optionsToGrab.hasOwnProperty(option)) {//if this is own option
            currentOption = this.optionsToGrab[option];
            if (currentOption.hasOwnProperty("value")) {//we have default option. Let's grab it for first
                currentOptionValue = currentOption.value;
            }

            if (this.sf.options.instances[this.name] && this.sf.options.instances[this.name].hasOwnProperty(option)) {
                currentOptionValue = this.sf.options.instances[this.name][option]
            }

            if (currentOption.hasOwnProperty("domAttr") && node.attributes.hasOwnProperty(currentOption.domAttr)) {//we can grab the attribute of node
                currentOptionValue = node.attributes[currentOption.domAttr].value;
            }

            if (currentOption.hasOwnProperty("processor")) {//we have processor. Let's execute it
                currentOptionValue = currentOption.processor.call(this, node, currentOptionValue, currentOption);
            }

            if (currentOptionValue !== null) {
                options[option] = currentOptionValue;
            }

        }
    }
    return options;
};

/**
 * Get addon for instance
 * @param {String} addonType type of addon (message,fill,etc)
 * @param {String} addonName name of addon
 */
//depricated
//BaseDOMConstructor.prototype.getAddon = function (addonType, addonName) {
//    return this.spiral.instancesController.getInstanceAddon(this.name, addonType, addonName);
//};

module.exports = BaseDOMConstructor;

},{}],5:[function(require,module,exports){
"use strict";
/**
 * Dom mutation. Listening to the DOM and add or remove instances based on classes.
 * @param {Object} instancesController  spiral instancesController.
 * @param {Function} instancesController.getClasses  get all registered modules classes.
 * @param {Function} instancesController.addInstance  add instance method.
 * @param {Function} instancesController.removeInstance  remove instance method
 * @constructor
 */
var DomMutations = function (instancesController) {
    if (!instancesController){
        console.error("You should provide instancesController  for DOM Mutation. Because DOM Mutation  should known all classes and");
        return;
    }
    if (!this.constructor){
        console.error("Please call DomMutations with new  - 'new DomMutations()' ");
        return;
    }
    this.instancesController = instancesController;
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
DomMutations.prototype.onDomMutate = function (mutations) {
    var classArray = this.instancesController.getClasses();//get all registered classes
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



DomMutations.prototype.processMutationAttributes = function (mutation, classArray) {
    var that = this;
    var currentClasses = mutation.target.className.split(" "),
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
        that.instancesController.removeInstance(that.instancesController.getInstanceNameByCssClass(val), mutation.target);
    });
    addedRegisteredClasses.forEach(function (val) {
        that.instancesController.addInstance(that.instancesController.getInstanceNameByCssClass(val), mutation.target);
    });

};
/**
 * Process mutation on ChildList
 * @param {NodeList} nodesList array with nodes
 * @param {String} action action to call (add or remove nodes)
 * @param {String} classSelector - string selector for querySelectorAll
 * @param {Array} classArray - array of all registered classes
 */
DomMutations.prototype.processMutationChildList = function (nodesList, action, classSelector, classArray) {
    var that =this;
    /**
     * Internal function for checking node class
     * @param {Object} node dom node
     */
    function checkNode(node) {
        classArray.forEach(function (className) {//loop over registered classes
            if (node.classList.contains(className)) {//if class match try to add or remove instance for this node
                that.instancesController[action](that.instancesController.getInstanceNameByCssClass(className), node);
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
DomMutations.prototype.stopObserve = function () {
    this.observer.disconnect();
};

module.exports = DomMutations;



},{}],6:[function(require,module,exports){
"use strict";

/**
 * Events system.
 * @param {Array} allowedEvents array of allowed events.
 * @constructs Events
 * @example
 * //allow to work with all events
 * var events = new Events();
 * events.on("myBestEvent",function(e){console.log(e)});
 * @example
 * //Allow to serve only limited events
 *  var events = new Events(["beforeSubmit","onDataReady"]);
 *  events.on("myBestEvent",function(e){console.log(e)});//will not works
 *  events.on("beforeSubmit",function(e){console.log(e)});//will work
 */
var Events = function (allowedEvents) {
    this._storage = {};
    this._allowedEvents = allowedEvents;
};

/**
 * Add event(s)
 * @param {String} events event or space separated event list
 * @param {Function} callback callback function
 * @example
 * var events = new Events();
 * events.on("myBestEvent myBestEvent2 myBestEvent3",function(e){console.log(e)});
 * events.on("myBestEvent",function(e){console.log(e)});
 */
Events.prototype.on = function (events, callback) {
    var eventArr = events.replace(/\s{2,}/g, " ").split(" ");
    eventArr.forEach(function(event){
        if (this._allowedEvents  && this._allowedEvents.indexOf(event) === -1){// event not inside allowed events
            console.warn("Events. Try to register event %s, but event is not allowed",event);
            return;
        }
        if (!this._storage.hasOwnProperty(events)) {
            this._storage[event] = [];
        }
        this._storage[event].push(callback);
    },this)

};
/**
 * Add action
 * @param {String} action
 * @param {Function} func
 * @deprecated  use "on" instead
 */
Events.prototype.registerAction = Events.prototype.on;


/**
 * remove event
 * @param {String} event
 * @param {Function} callback
 */
Events.prototype.off = function (event, callback) {
    alert("You try to remove action. This part is incomplete");
    //TODO
};

/**
 * Trigger event.
 * @param {String} event event name
 * @param {Object} [options] options to pass to the callback
 * @example
 * var events = new Events();
 * events.on("myBestEvent",function(e){console.log(e.bestKey)});
 * events.trigger("myBestEvent",{bestKey:42}); //will show in log
 */
Events.prototype.trigger = function (event, options) {
    if (this._allowedEvents  && this._allowedEvents.indexOf(event) === -1){// event not inside allowed events
        console.warn("Events. Try to trigger event %s, but event is not allowed",event);
        return;
    }
    if (this._storage.hasOwnProperty(event)) {
        for (var n = 0, l = this._storage[event].length; n < l; n++) {
            this._storage[event][n](options);
        }
    }
};

/**
 * Perform action
 * @param {String} action
 * @param {Object} [actionParams] object with all action data from server
 * @param {Object} [options] ajax options
 * @deprecated use "trigger" instead
 */
Events.prototype.performAction = Events.prototype.trigger;

module.exports = Events;
},{}],7:[function(require,module,exports){
"use strict";

/**
 * Instance controller
 * @param spiral
 * @constructor
 */
var InstancesController = function (spiral) {
    this.spiral = spiral;
    if (!this.constructor){
        console.error("Please call InstancesController with new  - 'new InstancesController()' ");
        return;
    }
    this._storage = {
        instancesConstructors: {
            cssClasses:{},
            jsConstructors:{}
        },
        addons: {},
        instances: {}
    };

    //todo decide if we need this
    //["onAddInstance", "onRemoveInstance"]
    //this.events = new spiral.modules.core.Events();
};
/**
 * Register new instance type
 * @param {Function} constructorFunction - constructor function of instance
 * @param {String} [cssClassName] - css class name of instance. If class not provided that it can't be automatically controlled by DomMutation. But you still can use it from JS.
 * @param {Boolean} [isSkipInitialization=false]  - skip component initialization, just adding, no init nodes.
 */
InstancesController.prototype.registerInstanceType = function (constructorFunction, cssClassName, isSkipInitialization) {
    var instanceName = constructorFunction.prototype.name;

    if (!instanceName){
        console.error("Instance constructor should have name inside it");
    }

    if (this._storage.instancesConstructors.jsConstructors.hasOwnProperty(instanceName)){
        console.error("Instance Constructor for type '%s' already added. Skipping",instanceName);
        return;
    }

    if (cssClassName){//add link (cssClassName->instanceName)
        this._storage.instancesConstructors.cssClasses[cssClassName] = instanceName;
    }

    this._storage.instancesConstructors.jsConstructors[instanceName] = constructorFunction;



    // if (this._storage.instancesConstructors.hasOwnProperty(className)){
    //    console.error("Instance Constructor for type %s already added. Skipping",constructorFunction.prototype.name);
    //    return;
    //}
    //this._storage.instancesConstructors[className] = {//init storage fields
    //    "typeName": constructorFunction.prototype.name,
    //    "constructor": constructorFunction
    //};
    this._storage.instances[instanceName] = [];
    if (!isSkipInitialization){
        var nodes = document.getElementsByClassName(cssClassName);//init add nodes with this class
        for (var i = 0, max = nodes.length; i < max; i++) {
            this.addInstance(instanceName, nodes[i]);
        }
    }

};

/**
 * Old method to register instance type
 * @param className
 * @param constructorFunction
 * @param isSkipInitialization
 * @deprecated
 */
InstancesController.prototype.addInstanceType =function(className,constructorFunction, isSkipInitialization){
    console.warn("addInstanceType is deprecated. Please use registerInstanceType instead");
    return this.registerInstanceType(constructorFunction, isSkipInitialization);
};


/**
 * Add instance
 * @param {String} instanceName - name of instance
 * @param {Object} node - dom node
 * @param {Object} [options] all options for send to the constructor
 * @returns {boolean}
 */
InstancesController.prototype.addInstance = function (instanceName, node, options) {
    var instanceConstructor = this._storage.instancesConstructors.jsConstructors[instanceName],
        isAlreadyAdded = this.getInstance(instanceName,node);
    if (!instanceConstructor || isAlreadyAdded) {//if not found this type  or already added - return
        return false;
    }
//    console.log("Adding instance for type -",instanceName,". Node - ",node);
    var instance = new instanceConstructor(this.spiral,node, options);
    this._storage.instances[instanceName].push({//add new instance of this type
        "node": node,
        "instance": instance
    });

    //this.events.trigger("onAddInstance", instance);

    return instance;
};
/**
 * Remove instance.
 * @param {String} instanceName - name of instance class
 * @param {Object|String} node - dom node ID
 * @returns {boolean}
 */
InstancesController.prototype.removeInstance = function (instanceName, node) {
    var instanceObj = this.getInstance(instanceName, node,true),
        key;
    if (!instanceObj) {
        return false;
    }
    instanceObj.instance.die();//avoid memory leak
    key = this._storage.instances[instanceName].indexOf(instanceObj);
    if (key !== -1){//remove key
        this._storage.instances[instanceName].splice(key, 1);
    }
    return true;
};
/**
 * Get instance. Return instance object of this dom node
 * @param {String} instanceName - name of instance
 * @param {Object|String} node - dom node o dome node ID
 * @param {boolean} [isReturnObject] - return object or instance
 * @returns {boolean}
 */
InstancesController.prototype.getInstance = function (instanceName, node, isReturnObject) {//TODO isReturnObject not needed. Refactor and remove
    var typeArr = this._storage.instances[instanceName],
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
 * Get instances. Return array of instances objects
 * @param {String} instanceName - name of instance
 * @returns {array|boolean}
 */
InstancesController.prototype.getInstances = function (instanceName) {
    return this._storage.instances[instanceName] || false;
};


/**
 * Register addon for instance
 * @param {Function|Object} addon
 * @param {String} instanceName name of instance to register addon
 * @param {String} addonType type of addon (message,fill,etc)
 * @param {String} addonName name of addon (spiral, bootstrap,etc)
 */
InstancesController.prototype.registerAddon = function(addon, instanceName, addonType, addonName){
    if (!this._storage.addons.hasOwnProperty(instanceName)){
        this._storage.addons[instanceName] = {};
    }
    if (!this._storage.addons[instanceName].hasOwnProperty(addonType)){
        this._storage.addons[instanceName][addonType] = {};
    }
    if (this._storage.addons[instanceName][addonType].hasOwnProperty(addonName)){
        console.error("The %s addon type %s already registered for instance %s! Skipping registration.",addonName,addonType,instanceName);
        return;
    }
    this._storage.addons[instanceName][addonType][addonName]= addon;

};

/**
 * Get registered addon
 * @param {String} instanceName name of instance to register addon
 * @param {String} addonType type of addon (message,fill,etc)
 * @param {String} addonName name of addon (spiral, bootstrap,etc)
 */
InstancesController.prototype.getInstanceAddon =function(instanceName, addonType, addonName){
    if (!this._storage.addons.hasOwnProperty(instanceName) || !this._storage.addons[instanceName].hasOwnProperty(addonType) || !this._storage.addons[instanceName][addonType].hasOwnProperty(addonName)){
        return false;
    }
    return this._storage.addons[instanceName][addonType][addonName];
};


/**
 * Get all registered classes
 * @returns {Array}
 */
InstancesController.prototype.getClasses = function (){
    return Object.keys(this._storage.instancesConstructors.cssClasses);
};

/**
 * For given cssClass return name of instance
 * @param {String} cssClass
 * @return {*}
 */
InstancesController.prototype.getInstanceNameByCssClass = function(cssClass){
    return this._storage.instancesConstructors.cssClasses[cssClass];
};

/**
 * Get constructor by name or class name
 */
InstancesController.prototype.getInstanceConstructors = function (name){

   //TODO
};

module.exports = InstancesController;

},{}],8:[function(require,module,exports){
"use strict";

/**
 * This plugin adds ability to perform actions from the server.
 * "action":"reload"
 * "action":{"redirect":"/account"}
 * "action":{"redirect":"/account","delay":3000}
 * "action":{"name":"redirect","url":"/account","delay":3000}
 */
module.exports = function (sf) {
    sf.ajax.events.on('load', function (options) {
        var response = options.response;
        if (response.hasOwnProperty('action')) {
            if (typeof response.action === 'string') {//"action":"reload"
                sf.events.trigger(response.action);
            } else if (typeof response.action === 'object') {
                var keys = Object.keys(response.action);
                if (keys.indexOf('flash') !== -1){
                    var flash = response.action['flash'],
                        timestamp = Date.now(),
                        sfFlashMessage = {};
                    if (typeof response.action['flash'] === 'object'){
                        sfFlashMessage = flash;
                        sfFlashMessage.timestamp = timestamp;
                    } else {
                        sfFlashMessage = {
                            message: flash,
                            timestamp: timestamp
                        }
                    }
                    sessionStorage.setItem('sfFlashMessage', JSON.stringify(sfFlashMessage));
                }
                if (keys.indexOf('redirect') !== -1){
                    setTimeout(function () {
                        sf.events.trigger('redirect', response.action['redirect'], options);
                    }, +response.action.delay|0);
                } else if (keys.indexOf('name') !== -1) {
                    setTimeout(function () {
                        sf.events.trigger(response.action.name, response.action.url);
                    }, +response.action.delay || 0);
                }
                //if (keys.length === 1) {//"action":{"redirect":"/account"}
                //    sf.events.trigger(keys[0], response.action[keys[0]], options);
                //} else if (keys.length === 2 && response.action.delay) {//"action":{"redirect":"/account","delay":3000}
                //    setTimeout(function () {
                //        var action = keys.filter(function (value) {
                //            return value !== 'delay';
                //        })[0];
                //        sf.events.trigger(action, response.action[action], options);
                //    }, +response.action.delay);
                //} else if (keys.length > 1) {//"action":{"name":"redirect","url":"/account","delay":3000}
                //    setTimeout(function () {
                //        sf.events.trigger(response.action.name, response.action, options);
                //    }, +response.action.delay || 0);
                //} else {
                //    console.error("Action from server. Object doesn't have keys. ", response.action);
                //}
            } else {
                console.error("Action from server. Something wrong. ", response.action);
            }
        }
    });
    (function (sfFlashMessage) {
        if (!sfFlashMessage) return;
        var message  = JSON.parse(sfFlashMessage),
            timestamp = Date.now(),
            node,
            nodeWrapper,
            flashClass;
        if (timestamp - message.timestamp > 10000) return;
        if (message.type === 'debug' || message.type === 'success'){
            flashClass = 'debug'
        } else if (message.type === 'info' || !message.type || message.type === 'notice'){
            flashClass = 'info'
        } else {
            flashClass = 'danger'
        }
        node = document.createElement('div');
        nodeWrapper = document.createElement('div');
        nodeWrapper.classList.add('flash-wrapper');
        node.classList.add('flash', flashClass);
        node.innerHTML = message.message;
        document.body.appendChild(nodeWrapper);
        nodeWrapper.appendChild(node);
        setTimeout(function(){nodeWrapper.classList.add('show');}, 1);
        setTimeout(function(){nodeWrapper.classList.remove('show')}, message.timeout||5000);

        sessionStorage.removeItem('sfFlashMessage');
    }(sessionStorage.getItem('sfFlashMessage')))
};
},{}],9:[function(require,module,exports){
module.exports = function(events){
    events.on("redirect", function (event) {
        var url = Object.prototype.toString.call(event) === "[object String]" ? event : event.url;
        //http://stackoverflow.com/questions/10687099/how-to-test-if-a-url-string-is-absolute-or-relative
        self.location[/^(?:[a-z]+:)?\/\//i.test(url) ? 'href' : 'pathname'] = url;
    });

    events.on('reload', function () {
        location.reload();
    });

    events.on('refresh', function () {
        events.trigger('reload');
    });

    events.on('close', function () {
        self.close();
    });
};
},{}],10:[function(require,module,exports){
"use strict";
/**
 * Helper to manipulate DOM Events. It's a simple wrapper around "addEventListener" but it's store all functions and allow us to remove it all.
 * It's very helpful for die() method of instances
 * @TODO add to many nodes
 * @TODO new method like addEventListener  DOMEvents.on(node(s),event,callback,useCapture);
 * @constructor
 */
var DOMEvents = function(){
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
 * Add event(s) to node(s).
 * @TODO add to many nodes
 * @param {Array.<Object>|Object} eventArray - event array or event itself
 * @param {Object} eventArray.DOMNode -   DOM node
 * @param {String} eventArray.eventType -   Event type
 * @param {Function} eventArray.eventFunction -   Function
 * @param {Boolean} [eventArray.useCapture=false] -   useCapture
 * @example
 * var DOMEventsInstance = new DOMEvents();
 * var eventOne = {
 *      DOMNode: document.getElementById("example"),
 *      eventType: "click",
 *      eventFunction: function (e) {
 *          console.log("Hi there. Native  DOM events is:",e);
 *      }
 * }
 *  var eventTwo = {
 *      DOMNode: document.getElementById("example2"),
 *      eventType: "mousedown",
 *      eventFunction: function (e) {
 *          console.log("Hi there. mousedown event. Native  DOM events is:",e);
 *      }
 * }
 *  DOMEventsInstance.add([eventOne,eventTwo]);
 */
DOMEvents.prototype.add = function(eventArray){
    if (Object.prototype.toString.call([]) !== "[object Array]"){
        eventArray = [eventArray];
    }
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
DOMEvents.prototype.remove = function(eventArray){
//TODO IMPLEMENT
    // TODO не уверен что этот метод необходим. если надо часто убирать какието обработчики, то лучше поставить обработчки на родителя
    console.warn("TODO IMPLEMENT");

};
/**
 * Remove all dom events registered with this instance (added by method add)
 * @example
 * //look at add method as first part of this code
 * DOMEventsInstance.removeAll();
 */
DOMEvents.prototype.removeAll = function(){
    this._DOMEventsStorage.forEach(function(val){
        val.DOMNode.removeEventListener(val.eventType,val.eventFunction,val.useCapture);
    });
    this._DOMEventsStorage=[];
};

module.exports = DOMEvents;
},{}],11:[function(require,module,exports){
"use strict";

/**
 * This object try to be easy as FormData.
 * Please note this is not(!) a shim for Form data, because it's impossible (you should set headers for Ajax by hands)
 * It take object and can convert it string like FormData do. Then you can send this string by Ajax or do some other staff.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FormData
 * @param {Object} [data] object with data (supports nested objects)
 * @param {String} [boundary] boundary  for Form Data
 * @constructor
 * @example
 * var formData = new LikeFormData({testKey:"testValue"},"testBoundary");
 * formData.toString();
 * // Returns:
 * //"--testBoundary
 * //Content-Disposition: form-data; name=testKey
 * //
 * // testValue
 * //--testBoundary--
 * //"
 *
 * @example
 * var formData = new LikeFormData({testKey:"testValue"});
 * formData.toString();
 * // Returns:
 * //"--SpiralFormData-4935309085994959
 * //Content-Disposition: form-data; name=testKey
 * //
 * // testValue
 * //--SpiralFormData-4935309085994959--
 * //"
 *
 * @example
 * var formData = new LikeFormData({testKey:"testValue"});
 * formData.append("key2","val2");
 * formData.toString();
 * // Returns:
 * //--SpiralFormData-988681384595111
 * //Content-Disposition: form-data; name=testKey
 * //
 * //testValue
 * //--SpiralFormData-988681384595111
 * //Content-Disposition: form-data; name=key2
 * //
 * //val2
 * //--SpiralFormData-988681384595111--
 * //"
 */
var LikeFormData = function (data, boundary) {
    this.data = {};
    if (data) {
        if (Object.prototype.toString.call(data) !== "[object Object]") {//non object/ Alert developer
            console.warn("LikeFormData can't accept non Object. Please reefer to documentation. Problem parameter is:", data);
        } else {
            this.data = data;
        }
    }
    this.boundary = (boundary) ? boundary : ("SpiralFormData-" + Math.random().toString().substr(2));


    //if (!isOldIE) {
    //    this.boundary = "SpiralAjax-" + Math.random().toString().substr(2);
    //    //xhr.setRequestHeader("content-type", "multipart/form-data; charset=utf-8; boundary=" + this.boundary);
    //} else {
    //    this.boundary = "SpiralAjax-oldIE9876gsloiHGldowu";
    //}

};
/**
 * Append data to storage. Like standart FormData do.
 * @param {String} key
 * @param {String} val
 * @example
 * var formData = new FormData();
 * formData.append("key2","val2");
 */
LikeFormData.prototype.append = function (key, val) {
    //https://developer.mozilla.org/en-US/docs/Web/API/FormData
    //TODO ***Appends a new value**** onto an existing key inside a FormData object, or adds the key if it does not already exist.
    this.data[key] = val;
};

/**
 * convert to string
 * @example
 * var formData = new LikeFormData({testKey:"testValue"});
 * formData.toString();
 * // Returns:
 * //"--SpiralFormData-4935309085994959
 * //Content-Disposition: form-data; name=testKey
 * //
 * // testValue
 * //--SpiralFormData-4935309085994959--
 * //"
 */
LikeFormData.prototype.toString = function () {
    var retString = "";
    var boundary = this.boundary;
    var iterate = function (data, partOfKey) {
        for (var key in data) {
            if (data.hasOwnProperty(key) && (typeof data[key] !== "undefined" )) {
                if (typeof data[key] === "object") {
                    iterate(data[key], ((partOfKey.length === 0) ? key : (partOfKey + "[" + key + "]")));
                } else {
                    retString += "--" + boundary
                        + "\r\nContent-Disposition: form-data; name=" + ((partOfKey.length === 0) ? key : (partOfKey + "[" + key + "]"))
                        + "\r\n\r\n" + data[key] + "\r\n";
                }
            }
        }
    };
    if (typeof this.data !== "object") {
        this.data = {
            data: this.data
        }
    }
    iterate(this.data, "");


    retString += "--" + this.boundary + "--\r\n";
    return retString;
};

/**
 * The delete() method of the FormData interface deletes a key/value pair from a FormData object.
 * @param key
 */
LikeFormData.prototype.delete = function (key) {
    return delete(this.data[key]);
};


/**
 *The get() method of the FormData interface returns the first value associated with a given key from within a FormData object.
 * @param key
 */
LikeFormData.prototype.get = function (key) {
    return this.data[key];
};
/**
 *The getAll() method of the FormData interface returns the first value associated with a given key from within a FormData object.
 */
LikeFormData.prototype.getAll = function () {
    return this.data;
};

/**
 * The has() method of the FormData interface returns a boolean stating whether a FormData object contains a certain key/value pair.
 * @param key
 */
LikeFormData.prototype.has = function(key){
    return this.data.hasOwnProperty(key);
};

/**
 * The difference between set() and FormData.append is that if the specified header does already exist, set() will overwrite the existing value with the new one, whereas FormData.append will append the new value onto the end of the set of values.
 * @param key
 * @param val
 */
LikeFormData.prototype.set = function(key, val){
    this.data[key] = val;
};

/**
 * Get content header to set for Ajax. Not a part of standart FormData object. But for sending Like FormData over Ajax you should know header.
 * @return {string}
 * @example
 * var formData = new LikeFormData();
 * formData.getContentTypeHeader(); //return "multipart/form-data; charset=utf-8; boundary=SpiralFormData-988681384595111"
 * @example
 * var formData = new LikeFormData({key:"val2"},"testBoundary");
 * formData.getContentTypeHeader(); //return "multipart/form-data; charset=utf-8; boundary=testBoundary"
 */
LikeFormData.prototype.getContentTypeHeader = function () {
    return "multipart/form-data; charset=utf-8; boundary=" + this.boundary;

};


module.exports = LikeFormData;
},{}],12:[function(require,module,exports){
/**
 This is a collection of useful DOM tools.
 */

module.exports = {

    /**
     * Found first parent node with matched selector(s)
     * @param {Object} elem - dom node
     * @param {String|Array} selectors - selector or array of selectors
     * @returns {Object| Boolean} - node or false
     */

    closest: function (elem, selectors) {
        selectors = (typeof selectors === 'string') ? [selectors] : selectors;
        var key,
            l = selectors.length,
            matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;
        while (elem && elem.parentNode) {
            for (key = 0; key < l; key++) {
                if (matchesSelector.call(elem, selectors[key])) {
                    return elem;
                }
            }
            elem = elem.parentNode;
        }
        return false;
    },
    /**
     * Found first parent node with matched className(s).
     * TODO Why this? Because old IE....
     * TODO It's not good, because it's a copy of closest @see closest. Refactor
     * @param {Object} elem - dom node
     * @param {String|Array} className - className or array of classNames
     * @returns {Object| Boolean} - node or false
     */

    closestByClassName: function (elem, className) {
        className = (typeof className === 'string') ? [className] : className;
        var key,
            l = className.length;
        //,matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;
        while (elem && elem.parentNode) {
            for (key = 0; key < l; key++) {
                var reg = new RegExp("(\\s|^)" + className[key] + "(\\s|$)");
                if (elem.className.match(reg)) {
                    return elem;
                }
            }
            elem = elem.parentNode;
        }
        return false;
    }
};
},{}],13:[function(require,module,exports){
"use strict";

/**
 * @module tools
 * @namespace
 */
var tools = {
    resolveKeyPath : function(path, obj, safe) {
        return path.split('.').reduce(function(prev, curr) {
            return !safe ? prev[curr] : (prev ? prev[curr] : void 0)
        }, obj||self)
    }
};

module.exports = tools;
},{}],14:[function(require,module,exports){
"use strict";
//https://github.com/spiral/sf.js

//Add console shim for old IE
require("./shim/console");
require("./shim/Object.assign");
if (typeof Promise != 'function') {
    var Promise = require('es6-promise').Promise;
}

var _sf;

if (typeof sf !== 'undefined' && Object.prototype.toString.call(sf) === "[object Object]") {
    _sf = Object.assign(sf, require("./sf"));
} else {
    _sf = require("./sf");
}

if (!_sf.hasOwnProperty('options')) _sf.options = {instances:{}};
if (!_sf.options.hasOwnProperty('instances')) _sf.options.instances = {};

//todo delete this in future
if (!window.hasOwnProperty("sf")) {//bind only if  window.sf is empty to avoid conflicts with other libs
    window.sf = _sf;
}

_sf.instancesController = new _sf.core.InstancesController(sf);
_sf.domMutation = new _sf.core.DomMutations(_sf.instancesController);

//Events system
_sf.events = new _sf.core.Events();
require("./core/events/baseEvents.js")(_sf.events);

//AJAX
_sf.ajax = new _sf.core.Ajax(window.csrfToken ? {//TODO move to spiral bindings
    headers: {
        "X-CSRF-Token": window.csrfToken
    }
} : null);
require("./core/ajax/baseActions.js")(_sf);

//API
_sf.createModulePrototype = function() { return Object.create(_sf.modules.core.BaseDOMConstructor.prototype)};
_sf.registerInstanceType = _sf.instancesController.registerInstanceType.bind(_sf.instancesController);
_sf.addInstance = _sf.instancesController.addInstance.bind(_sf.instancesController);
_sf.removeInstance = _sf.instancesController.removeInstance.bind(_sf.instancesController);
_sf.getInstance = _sf.instancesController.getInstance.bind(_sf.instancesController);
_sf.getInstances = _sf.instancesController.getInstances.bind(_sf.instancesController);

_sf.closest = sf.helpers.domTools.closest;
_sf.resolveKeyPath = sf.tools.resolveKeyPath;

if (typeof exports === "object" && exports) {
    module.exports = _sf;
}
},{"./core/ajax/baseActions.js":8,"./core/events/baseEvents.js":9,"./sf":15,"./shim/Object.assign":16,"./shim/console":17,"es6-promise":1}],15:[function(require,module,exports){
var core = {
    Ajax: require("./core/Ajax"),
    BaseDOMConstructor: require("./core/BaseDOMConstructor"),
    DomMutations: require("./core/DomMutations"),
    Events: require("./core/Events"),
    InstancesController: require("./core/InstancesController")
};

var helpers = {
    DOMEvents: require("./helpers/DOMEvents"),
    domTools: require("./helpers/domTools"),
    LikeFormData: require("./helpers/LikeFormData"),
    tools: require("./helpers/tools")
};

var sf = {
    core: core,
    helpers: helpers,
    tools: helpers.tools,
    modules: {//todo remove this when removed in dependencies
        'WILL_BE_DEPRECATED': true,
        core: core,
        helpers: helpers
    }
};

module.exports = sf;
},{"./core/Ajax":3,"./core/BaseDOMConstructor":4,"./core/DomMutations":5,"./core/Events":6,"./core/InstancesController":7,"./helpers/DOMEvents":10,"./helpers/LikeFormData":11,"./helpers/domTools":12,"./helpers/tools":13}],16:[function(require,module,exports){
/**
 * Object.assign polyfill
 * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
if (typeof Object.assign != 'function') {
    (function () {
        Object.assign = function (target) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined && source !== null) {
                    for (var nextKey in source) {
                        if (source.hasOwnProperty(nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };
    })();
}
},{}],17:[function(require,module,exports){
/**
 * Avoid `console` errors in browsers that lack a console.
 */
(function () {
    var method, noop = function () {
        },
        methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ],
        length = methods.length,
        console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

},{}]},{},[14])


//# sourceMappingURL=sf.js.map
