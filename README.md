# object-pool

Simple object pool.

## Installation

```
$ npm i -S @vaalentin/object-pool
```

## Usage

```js
import ObjectPool from '@vaalentin/object-pool';

// our object
class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// create a new pool
const pool = new ObjectPool({
  create: (x, y) => new Vec2(x, y),
  reset: (vec, x, y) => {
    vec.x = x;
    vec.y = y;
    return vec;
  }
});

// get an item
const vec = pool.get(1, 3);

// release when not needed anymore
pool.free(vec);
```

## API

### `const pool = new ObjectPool([opts])`

### opts

| Property | Type | Description | Default |
| - | - | - | - |
| maxSize | `int` | max pool size | `0` |
| collectFreq | `float` | how often to remove excess objects (in ms) | `-1` |
| create | `() => T` | function to create object | `() => {}` |
| reset | `(T) => T` | function to reset object | `obj => obj` |

### `pool.get(any) => T`
### `pool.free(T) => void`
### `pool.destruct() => void`

## Licence

MIT
