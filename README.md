# Object pool

[![Build Status](https://travis-ci.org/vaalentin/object-pool.svg?branch=master)](https://travis-ci.org/vaalentin/object-pool)

Simple [object pool](https://en.wikipedia.org/wiki/Object_pool_pattern) implementation.

## Installation

```sh
$ npm install --save @vaalentin/object-pool
```

## Usage

```js
import ObjectPool from '@vaalentin/object-pool';

class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const pool = new ObjectPool({
  create: (x, y) => new Vec2(x, y),
  reset: (vec, x, y) => {
    vec.x = x;
    vec.y = y;
    return vec;
  }
});

const vec = pool.get(1, 3);

pool.free(vec);
```

## API

#### `pool = new ObjectPool(opts)`

Create a new pool, with the possible following `opts`:

| Property    | Type       | Description                                | Default      |
| ----------- | ---------- | ------------------------------------------ | ------------ |
| maxSize     | `int`      | max pool size                              | `0`          |
| collectFreq | `float`    | how often to remove excess objects (in ms) | `-1`         |
| create      | `() => T`  | function to create object                  | `() => {}`   |
| reset       | `(T) => T` | function to reset object                   | `obj => obj` |

#### `obj = pool.get([, args])`

Get an object from the pool by calling the `reset` options with the given `args`.

#### `pool.free(obj)`

Release an object when not needed anymore.

#### `pool.collect()`

Remove availabe objects excess.

#### `pool.dispose()`

## Licence

MIT, see [LICENSE.md](https://github.com/vaalentin/object-pool/blob/master/LICENSE.md) for more details.
