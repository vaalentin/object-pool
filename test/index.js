import test from 'tape';
import ObjectPool from '../src/';

test('should be instanciable', t => {
  t.plan(1);

  const pool = new ObjectPool();
  
  t.ok(pool instanceof ObjectPool, 'pool instance of ObjectPool ok');
});

test('should get an object', t => {
  t.plan(1);

  const obj = { x: 0, y: 2 };

  const pool = new ObjectPool({
    create: () => obj
  });

  t.equal(pool.get(), obj, 'correct obj returned');
});

test('should free an object', t => {
  t.plan(3);

  const obj = { x: 0, y: 2 };

  const pool = new ObjectPool({
    create: () => obj
  });

  const a = pool.get();

  t.equal(pool._active.length, 1, '1 obj is active');

  pool.free(a);

  t.equal(pool._active.length, 0, '0 obj is active');
  t.equal(pool._available.length, 1, '1 obj is available');
});

test('should accept custom create and reset methods', t => {
  class Vec2 {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }

  const pool = new ObjectPool({
    create: (x, y) => {
      t.equal(x, 2, 'create x value ok');
      t.equal(y, 3, 'create y value ok');

      return new Vec2(x, y);
    },
    reset: (vec, x, y) => {
      t.equal(vec.x, 2, 'previous x value ok');
      t.equal(vec.y, 3, 'previous y value ok');

      t.equal(x, 4, 'reset x value ok');
      t.equal(y, 5, 'reset y value ok');

      vec.x = x;
      vec.y = y;

      return vec;
    }
  });

  const vecA = pool.get(2, 3);

  t.equal(vecA.x, 2, 'first x value ok');
  t.equal(vecA.y, 3, 'first y value ok');

  pool.free(vecA);

  const vecB = pool.get(4, 5);

  t.equal(vecB.x, 4, 'second x value ok');
  t.equal(vecB.y, 5, 'second y value ok');

  t.end();
});

test('should be able to clear the pool', t => {
  t.plan(3);

  const pool = new ObjectPool({
    create: () => new Date(),
    maxSize: 10
  });

  const objs = [];

  for(let i = 0; i < 100; i++) {
    objs.push(pool.get());
  }

  t.equal(pool._active.length, 100, 'pool active length ok');

  for(let obj of objs) {
    pool.free(obj);
  }

  t.equal(pool._available.length, 100, 'pool avaible length ok');

  pool.collect();

  t.equal(pool._available.length, 10, 'pool available after collect ok');
});

test('should clear the pool if a collectFreq is given', t => {
  t.plan(2);

  const poolB = new ObjectPool({
    create: () => new Date(),
    collectFreq: 100,
    maxSize: 0
  });

  const objs = [];

  for(let i = 0; i < 100; i++) {
    objs.push(poolB.get());
  }

  for(let obj of objs) {
    poolB.free(obj);
  }

  t.equal(poolB._available.length, 100, 'pool available ok');

  setTimeout(() => {
    t.equal(poolB._available.length, 0, 'pool available after collect ok');
    poolB.dispose();
  }, 200);
});
