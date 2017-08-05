var Memoize = require("../src/index");
var expect = require("chai").expect;
describe("Memoize", () => {
  var cache = null;
  it("Constructor test", () => {
    cache = new Memoize();
    var expected = Memoize;
    expect(cache).to.be.instanceOf(expected);
  });
  it("Execute test", () => {
    var execute = cache.execute("Execute test", () => {
      return new Promise(resolve => {
      });
    });
    expect(execute).to.be.instanceOf(Promise);
  });
  it("Hit test", done => {
    // 1, - update
    cache.execute("hitTest", () => {
      return new Promise(resolve => {
        resolve(1);
      });
    }).then(v => {
      expect(v).to.be.equal(1);
    });
    // 2, - hit
    setTimeout(() => {
      cache.execute("hitTest", () => {
        return new Promise(resolve => {
          resolve(1);
        });
      }).then(v => {
        expect(v).to.be.equal(1);
      });
    }, 1000);
    // 3, - update
    setTimeout(() => {
      cache.execute("hitTest", () => {
        return new Promise(resolve => {
          resolve(2);
        });
      }).then(v => {
        expect(v).to.be.equal(2);
        done();
      });
    }, 4000);
  }).timeout(5000 * 10);
  it("Graceful test", done => {
    cache = new Memoize({
      graceful: true,
      expiredTime: 1000
    });
    // 1, - update
    cache.execute("gracefulTest", () => {
      return new Promise(resolve => {
        resolve(1);
      });
    }).then(v => {
      expect(v).to.be.equal(1);
    });
    // 2, - hit
    setTimeout(() => {
      cache.execute("gracefulTest", () => {
        return new Promise(resolve => {
          resolve(1);
        });
      }).then(v => {
        expect(v).to.be.equal(1);
      });
    }, 1500);
    // 3, - gracefully update
    setTimeout(() => {
      cache.execute("gracefulTest", () => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(2);
          }, 100);
        });
      }).then(v => {
        expect(v).to.be.equal(1);
        done();
      });
    }, 3500);
    // 4, - update
    setTimeout(() => {
      cache.execute("gracefulTest", () => {
        return new Promise(resolve => {
          resolve(2);
        });
      }).then(v => {
        expect(v).to.be.equal(2);
        done();
      });
    }, 4000);
  }).timeout(5000 * 10);
});
