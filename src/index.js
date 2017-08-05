/**
 * @class Memoize
 * @param {Object} settings Global settings.
 * */
var Memoize = function (settings) {
  var cache = {};
  var _settings = settings || {};
  _settings.expiredTime = Number(_settings.expiredTime) || 3 * 1000;
  _settings.graceful = typeof _settings.graceful === "boolean" ? _settings.graceful : false;
  /**
   * executor
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
    } else {
      var executedFunc = yourFunction();
      if (!(executedFunc instanceof Promise)) {
        throw new TypeError("The result of executing the function must be Promise.");
      }
      if (_graceful && cache[key] && cache[key].data) {
        ret = cache[key].data;
        cache[key] = _genCacheItem(executedFunc, _expiredTime);
      } else {
        ret = executedFunc;
        cache[key] = _genCacheItem(ret, _expiredTime);
      }
    }
    return ret;
  };
  /**
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
