var Memoize = require("../src/index");
var expect = require("chai").expect;

describe("Test the basic functionality", () => {
  var cache = null;
  it("constructor", () => {
    cache = new Memoize();
    var expected = Memoize;
    expect(cache).to.be.instanceOf(expected);
  });
  it("execute", (done) => {
    cache.execute("#", () => {
      return new Promise(resolve => {
        resolve("Execution result");
      });
    }).then((value) => {
      var expected = "Execution result";
      expect(value).to.be.equal(expected);
      done();
    });
  });
});

describe("Test the cache", () => {
  var cache = new Memoize({
    expiredTime: 50,
    graceful: false
  });
  it("cache hit", (done) => {
    // The cache key is `#`
    cache
      .execute("#", () => {
        return new Promise(resolve => {
          // The cache value is `1`.
          resolve(1);
        });
      });
    setTimeout(() => {
      cache
        .execute("#", () => {
          return new Promise(resolve => {
            setTimeout(() => {
              // After 50ms this value is cached and the result is notify to the Promise object.
              resolve(2);
            }, 50);
          });
        })
        .then((value) => {
          // It runs after 50ms.
          var expected = 2;
          expect(value).to.be.equal(expected);
          done();
        });
    }, 60);
  });
});

describe("Test the graceful", () => {
  var cache = new Memoize({
    expiredTime: 50,
    graceful: true
  });
  it("cache hit", (done) => {
    // The cache key is `#`
    cache
      .execute("#", () => {
        return new Promise(resolve => {
          // The cache value is `1`.
          resolve(1);
        });
      });
    setTimeout(() => {
      cache
        .execute("#", () => {
          return new Promise(resolve => {
            setTimeout(() => {
              // After 50ms this value is cached and the result is notify to the Promise object.
              resolve(2);
            }, 50);
          });
        })
        .then((value) => {
          // Execute immediately with cached values, and cache new execution results.
          var expected = 1;
          expect(value).to.be.equal(expected);
          done();
        });
    }, 60);
  });
});

describe("Test the events", () => {
  var cache = new Memoize({
    expiredTime: 50
  });
  it("Tests cached event", done => {
    cache.on("cached", (value) => {
      var expected = Promise;
      expect(value).to.be.instanceof(expected);
      done();
    });
    cache.execute("test", () => {
      return new Promise(resolve => {
        resolve(1);
      })
    });
  });
  it("Tests hit event", done => {
    cache.on("hit", (value) => {
      expect(value).to.be.equal(1);
      done();
    });
    // The previously executed result will be called.
    cache.execute("test", () => {
      return new Promise(resolve => {
        resolve(1);
      })
    });
  });
  it("Tests refresh event", done => {
    cache.on("refresh", (value) => {
      var expected = Promise;
      expect(value).to.be.instanceof(expected);
      done();
    });
    setTimeout(() => {
      cache.execute("test", () => {
        return new Promise(resolve => {
          resolve(1);
        })
      });
    }, 50);
  });
});
