var Events = require("events");
/**
 * @class Memoize
 * @param {Object} settings Global settings.
 * */
var Memoize = function (settings) {
  var cache = {};
  var eventEmitter = new Events();
  var eventList = [
    "hit",
    "cached",
    "refresh"
  ];
  var _settings = settings || {};
  _settings.expiredTime = Number(_settings.expiredTime) || 3 * 1000;
  _settings.graceful = typeof _settings.graceful === "boolean" ? _settings.graceful : false;
  /**
   * @memberOf Memoize
   * @param {String} key
   * @param {Function} yourFunction
   * @param {Number} [expiredTime]
   * @param {Boolean} [graceful]
   * @return {Promise}
   * */
  this.execute = (key, yourFunction, expiredTime, graceful) => {
    var _expiredTime = Number(expiredTime) || _settings.expiredTime;
    var _graceful = graceful === true ? graceful : _settings.graceful;
    var ret = null;
    if (_isHit(key)) {
      ret = cache[key].data;
      ret.then((value) => {
        eventEmitter.emit("hit", value);
      });
    } else {
      var executedFunc = yourFunction();
      if (!(executedFunc instanceof Promise)) {
        throw new TypeError("The result of executing the function must be Promise.");
      }
      if (_graceful && key in cache && cache[key].data) {
        ret = cache[key].data;
        cache[key] = _genCacheItem(executedFunc, _expiredTime);
        eventEmitter.emit("refresh", ret);
      } else {
        ret = executedFunc;
        if (key in cache) {
          eventEmitter.emit("refresh", ret);
        } else {
          eventEmitter.emit("cached", ret);
        }
        cache[key] = _genCacheItem(executedFunc, _expiredTime);
      }
    }
    return ret;
  };

  /**
   * @memberOf Memoize
   * @param {String} eventName
   * @param {Function} callbackFunction
   * */
  this.on = (eventName, callbackFunction) => {
    var ret = false;
    if (eventList.includes(eventName)) {
      eventEmitter.on(eventName, callbackFunction);
      ret = true;
    }
    return ret;
  };

  /**
   * @memberOf Memoize
   * @param {String} eventName
   * @param {Function} callbackFunction
   * */
  this.off = (eventName, callbackFunction) => {
    var ret = false;
    if (ret = eventList.includes(eventName)) {
      eventEmitter.removeEventListener(eventName, callbackFunction);
      ret = true;
    }
    return ret;
  };

  /**
   * @memberOf Memoize
   * @private
   * @param {String} key
   * @return {Boolean}
   * */
  function _isHit(key) {
    var ret = false;
    if (key in cache) {
      var cached = cache[key];
      if (cached.expiredTime > Date.now()) {
        ret = true;
      }
    }
    return ret;
  }

  /**
   * @memberOf Memoize
   * @private
   * @param {Promise} executedFunc
   * @param {Number} expiredTime
   * @return {Object}
   * */
  function _genCacheItem(executedFunc, expiredTime) {
    return {
      data: executedFunc,
      expiredTime: Date.now() + expiredTime,
    };
  }
};

module.exports = Memoize;
