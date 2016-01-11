"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultOpts = exports.defaultOpts = {
  initialSize: 0,
  maxSize: 100,
  create: function create() {},
  reset: function reset(obj) {
    return obj;
  },
  collectFreq: -1
};

/**
 * @class ObjectPool
 */

var ObjectPool = function () {
  /**
   * @constructs ObjectPool
   * @param {ObjectPoolOpts} [opts = {}]
   */

  function ObjectPool() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ObjectPool);

    this._opts = Object.assign(defaultOpts, opts);

    this._active = [];
    this._available = [];

    for (var i = 0; i < this._opts.initialSize; ++i) {
      this._available.push(this._opts.create());
    }

    this._collect;
    this._collectInterval;

    if (this._opts.collectFreq !== -1) {
      this._collect = this.collect.bind(this);
      this._collectInterval = setInterval(this._collect, this._opts.collectFreq);
    }
  }

  /**
   * @method collect
   * @private
   */

  _createClass(ObjectPool, [{
    key: "collect",
    value: function collect() {
      this._available = Math.max(0, this._opts.maxSize - this._active.length);
    }

    /**
     * @method get
     * @public
     * @param {any[]} args
     * @returns {any}
     */

  }, {
    key: "get",
    value: function get() {
      var _opts, _opts2;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var obj = this._available.length ? (_opts = this._opts).reset.apply(_opts, [arrayPop(this._available)].concat(args)) : (_opts2 = this._opts).create.apply(_opts2, args);

      this._active.push(obj);

      return obj;
    }

    /**
     * @method free
     * @public
     * @param {any} obj
     */

  }, {
    key: "free",
    value: function free(obj) {
      var i = this._active.indexOf(obj);

      if (i === -1) {
        return;
      }

      this._active.splice(i, 1);
      this._available.push(obj);
    }

    /**
     * @method destruct
     * @public
     */

  }, {
    key: "destruct",
    value: function destruct() {
      clearInterval(this._collectInterval);
    }
  }]);

  return ObjectPool;
}();

exports.default = ObjectPool;
