export const defaultOpts = {
  initialSize: 0,
  maxSize: 100,
  create: () => {},
  reset: obj => obj,
  collectFreq: -1
}

/**
 * @class ObjectPool
 */
export default class ObjectPool {
  /**
   * @constructs ObjectPool
   * @param {ObjectPoolOpts} [opts = {}]
   */
  constructor(opts = {}) {
    this._opts = Object.assign(defaultOpts, opts);

    this._active = [];
    this._available = [];

    for(let i = 0; i < this._opts.initialSize; ++i) {
      this._available.push(this._opts.create());
    }

    this._collect;
    this._collectInterval;

    if(this._opts.collectFreq !== -1) {
      this._collect = this.collect.bind(this);
      this._collectInterval = setInterval(this._collect, this._opts.collectFreq); 
    }
  }

  /**
   * @method collect
   * @private
   */
  collect() {
    this._available.length = Math.min(this._available.length, this._opts.maxSize);
  }

  /**
   * @method get
   * @public
   * @param {any[]} args
   * @returns {any}
   */
  get(...args) {
    const obj = this._available.length
      ? this._opts.reset(this._available.pop(), ...args)
      : this._opts.create(...args);

    this._active.push(obj);

    return obj;
  }

  /**
   * @method free
   * @public
   * @param {any} obj
   */
  free(obj) {
    const i = this._active.indexOf(obj);

    if(i === -1) {
      return;
    }

    this._active.splice(i, 1);
    this._available.push(obj);
  }

  /**
   * @method dispose
   * @public
   */
  dispose() {
    clearInterval(this._collectInterval);
    this._active = null;
    this._available = null;
  }
}

