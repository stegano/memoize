# Memoize
Memoize is a simple cache library that remembers the function execution results and can respond immediately.

## Installation

The easiest way to install memoize is with [`npm`][npm].

[npm]: https://www.npmjs.com/

```sh
npm i memoize
```

Alternately, download the source.

```sh
git clone https://github.com/ternjs/acorn.git
```

## Examples

```javascript
var Memoize = require("memoize");
var chace = new Memoize({
    expiredTime: 3000,
    graceful: false
});

var testFunction = () => {
    /** return type is must be Promise */
    return new Promise(resolve => {
        setTimeout(() => {
            resolve("Proecced data.");
        }, 10);
    });
};

// Run the function on the first run and cache the results in internal storage.
cache
    .execute("identity", testFunction)
    .then((data) => {
        console.log(data);
    });

// The second execution is immediately available as cached data by the first execution.
cache
    .execute("identity", testFunction)
    .then((data) => {
        console.log(data);
    });

// The third execution expires the data cached by `expiredTime` and processes it again by executing the function again.
setTimeout(() => {
    cache
        .execute("identity", testFunction)
        .then((data) => {
            console.log(data);
        });
}, 3500);

```

## API

### Memoize.execute(key, yourFunction[, expiredTime][, graceful]) : Promise

- `key`: Key to distinguish between tasks. Returns the cached data if the key values are equal and within the validity range.
- `yourFunction`: The function to execute. The return value must always be of type Promise.
- `expiredTime`: Time to cache data. Cached data is valid for the expiredTime time and the unit of value is ms.
- `graceful`: If you use the graceful option, will use the cached data until new data has been processed even if the data has expired.

## Docs

Create an API document using JSDoc.

```sh
npm install
npm run doc
```

## Tests

To run the test suite, first install the dependencies, then run npm test

```sh
npm ininstall
npm test
```
