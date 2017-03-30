'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isObject = isObject;
exports.isPlainObject = isPlainObject;
exports.isContainer = isContainer;
exports.count = count;
exports.values = values;
exports.isKeyedContainer = isKeyedContainer;
exports.keys = keys;
exports.entries = entries;
exports.get = get;
exports.forEach = forEach;
exports.map = map;
exports.reduce = reduce;
exports.toJS = toJS;
// ES6 includes iteration and iterable protocols, and new standard containers
// Influential libraries like Immutable.js provide useful containers that
// adopt these conventions.
//
// So, is it possible to write generic JavaScript code that works with any
// well-written container class? And is it possible to write generic container
// classes that work with any well-written code.
//
// Almost. But it is not trivial. Importantly the standard JavaScript `Object`s
// lack even basic iteration support and even standard JavaScript `Array`s
// differ in minor but important aspects from the new classes.
//
// The bad news is that it does not appear that these things are going to be
// solved soon, even in an actively evolving language like JavaScript. The
// reason is concerns.
//
// The good news is that it is not overly hard to "paper over" the differences
// with a set of small efficient functions. And voila, container.js.
//
// Different types of containers provide different types of access.
// A random access container
// A keyed container

var ERR_NOT_CONTAINER = 'Expected a container';
var ERR_NOT_KEYED_CONTAINER = 'Expected a "keyed" container';

/**
 * Checks if argument is an indexable object (not a primitive value, nor null)
 * @param {*} value - JavaScript value to be tested
 * @return {Boolean} - true if argument is a JavaScript object
 */
function isObject(value) {
  return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
}

/**
 * Checks if argument is a plain object (not a class or array etc)
 * @param {*} value - JavaScript value to be tested
 * @return {Boolean} - true if argument is a plain JavaScript object
 */
function isPlainObject(value) {
  return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.constructor === Object;
}

function isContainer(value) {
  return Array.isArray(value) || ArrayBuffer.isView(value) || isObject(value);
}

/**
 * Deduces numer of elements in a JavaScript container.
 * - Auto-deduction for ES6 containers that define a count() method
 * - Auto-deduction for ES6 containers that define a size member
 * - Auto-deduction for Classic Arrays via the built-in length attribute
 * - Also handles objects, although note that this an O(N) operation
 */
function count(container) {
  // Check if ES6 collection "count" function is available
  if (typeof container.count === 'function') {
    return container.count();
  }

  // Check if ES6 collection "size" attribute is set
  if (Number.isFinite(container.size)) {
    return container.size;
  }

  // Check if array length attribute is set
  // Note: checking this last since some ES6 collections (Immutable.js)
  // emit profuse warnings when trying to access `length` attribute
  if (Number.isFinite(container.length)) {
    return container.length;
  }

  // Note that getting the count of an object is O(N)
  if (isPlainObject(container)) {
    var counter = 0;
    for (var key in container) {
      // eslint-disable-line
      counter++;
    }
    return counter;
  }

  throw new Error(ERR_NOT_CONTAINER);
}

// Returns an iterator over all **values** of a container
//
// Note: Keyed containers are expected to provide an `values()` method,
// with the exception of plain objects which get special handling

function values(container) {
  // HACK - Needed to make buble compiler work
  if (Array.isArray(container)) {
    return container;
  }

  var prototype = Object.getPrototypeOf(container);
  if (typeof prototype.values === 'function') {
    return container.values();
  }

  if (typeof container.constructor.values === 'function') {
    return container.constructor.values(container);
  }

  var iterator = container[Symbol.iterator];
  if (iterator) {
    return container;
  }

  throw new Error(ERR_NOT_CONTAINER);
}

// /////////////////////////////////////////////////////////
// KEYED CONTAINERS
// Examples: objects, Map, Immutable.Map, ...

function isKeyedContainer(container) {
  if (Array.isArray(container)) {
    return false;
  }
  var prototype = Object.getPrototypeOf(container);
  // HACK to classify Immutable.List as non keyed container
  if (typeof prototype.shift === 'function') {
    return false;
  }
  var hasKeyedMethods = typeof prototype.get === 'function';
  return hasKeyedMethods || isPlainObject(container);
}

// Returns an iterator over all **entries** of a "keyed container"
// Keyed containers are expected to provide a `keys()` method,
// with the exception of plain objects.
//
function keys(keyedContainer) {
  var prototype = Object.getPrototypeOf(keyedContainer);
  if (typeof prototype.keys === 'function') {
    return keyedContainer.keys();
  }

  if (typeof keyedContainer.constructor.keys === 'function') {
    return keyedContainer.constructor.keys(keyedContainer);
  }

  throw new Error(ERR_NOT_KEYED_CONTAINER);
}

// Returns an iterator over all **entries** of a "keyed container"
//
// Keyed containers are expected to provide an `entries()` method,
// with the exception of plain objects.
//
function entries(keyedContainer) {
  var prototype = Object.getPrototypeOf(keyedContainer);
  if (typeof prototype.entries === 'function') {
    return keyedContainer.entries();
  }

  // if (typeof prototype.constructor.entries === 'function') {
  //   return prototype.constructor.entries(keyedContainer);
  // }

  if (typeof keyedContainer.constructor.entries === 'function') {
    return keyedContainer.constructor.entries(keyedContainer);
  }

  return null;
}

/**
 * Access properties of nested containers using dot-path notation
 * - Supports plain objects and arrays, as well as classes with `get` methods
 *   such as ES6 Maps, Immutable.js objects etc
 * - Returns undefined if any container is not valid, instead of throwing
 *
 * @param {Object} container - container that supports get
 * @param {String|*} compositeKey - key to access, can be '.'-separated string
 * @return {*} - value in the final key of the nested container
 */
function get(container, compositeKey) {
  // Split the key into subkeys
  var keyList = getKeys(compositeKey);
  // Recursively get the value of each key;
  var value = container;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = keyList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      // If any intermediate subfield is not a container, return undefined
      if (!isObject(value)) {
        return undefined;
      }
      // Get the `getter` for this container
      var getter = getGetter(value);
      // Use the getter to get the value for the key
      value = getter(value, key);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return value;
}

// Default getter is container indexing
var squareBracketGetter = function squareBracketGetter(container, key) {
  return container[key];
};
var getMethodGetter = function getMethodGetter(obj, key) {
  return obj.get(key);
};
// Cache key to key arrays for speed
var keyMap = {};

// Looks for a `get` function on the prototype
// TODO - follow prototype chain?
// @private
// @return {Function} - get function: (container, key) => value
function getGetter(container) {
  // Check if container has a special get method
  var prototype = Object.getPrototypeOf(container);
  return prototype.get ? getMethodGetter : squareBracketGetter;
}

// Takes a string of '.' separated keys and returns an array of keys
// E.g. 'feature.geometry.type' => 'feature', 'geometry', 'type'
// @private
function getKeys(compositeKey) {
  if (typeof compositeKey === 'string') {
    // else assume string and split around dots
    var keyList = keyMap[compositeKey];
    if (!keyList) {
      keyList = compositeKey.split('.');
      keyMap[compositeKey] = keyList;
    }
    return keyList;
  }
  // Wrap in array if needed
  return Array.isArray(compositeKey) ? compositeKey : [compositeKey];
}

// "Generic" forEach that first attempts to call a
function forEach(container, visitor) {
  // Hack to work around limitations in buble compiler
  var prototype = Object.getPrototypeOf(container);
  if (prototype.forEach) {
    container.forEach(visitor);
    return;
  }

  var isKeyed = isKeyedContainer(container);
  if (isKeyed) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = entries(container)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _step2$value = _slicedToArray(_step2.value, 2),
            key = _step2$value[0],
            value = _step2$value[1];

        visitor(value, key, container);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return;
  }

  var index = 0;
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = values(container)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var element = _step3.value;

      // result[index] = visitor(element, index, container);
      visitor(element, index, container);
      index++;
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
}

function map(container, visitor) {
  // Hack to work around limitations in buble compiler
  var prototype = Object.getPrototypeOf(container);
  if (prototype.forEach) {
    var _ret = function () {
      var result = [];
      container.forEach(function (x, i, e) {
        return result.push(visitor(x, i, e));
      });
      return {
        v: result
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }

  var isKeyed = isKeyedContainer(container);
  // const result = new Array(count(container));
  var result = [];
  if (isKeyed) {
    // TODO - should this create an object?
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = entries(container)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var _step4$value = _slicedToArray(_step4.value, 2),
            key = _step4$value[0],
            value = _step4$value[1];

        // result[index] = visitor(element, index, container);
        result.push(visitor(value, key, container));
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }
  } else {
    var index = 0;
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = values(container)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var element = _step5.value;

        // result[index] = visitor(element, index, container);
        result.push(visitor(element, index, container));
        index++;
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }
  }
  return result;
}

function reduce(container, visitor) {
  // Hack to work around limitations in buble compiler
  var prototype = Object.getPrototypeOf(container);
  if (prototype.forEach) {
    var _ret2 = function () {
      var result = [];
      container.forEach(function (x, i, e) {
        return result.push(visitor(x, i, e));
      });
      return {
        v: result
      };
    }();

    if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
  }

  var isKeyed = isKeyedContainer(container);
  // const result = new Array(count(container));
  var result = [];
  if (isKeyed) {
    // TODO - should this create an object?
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = entries(container)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var _step6$value = _slicedToArray(_step6.value, 2),
            key = _step6$value[0],
            value = _step6$value[1];

        // result[index] = visitor(element, index, container);
        result.push(visitor(value, key, container));
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return) {
          _iterator6.return();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }
  } else {
    var index = 0;
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      for (var _iterator7 = values(container)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        var element = _step7.value;

        // result[index] = visitor(element, index, container);
        result.push(visitor(element, index, container));
        index++;
      }
    } catch (err) {
      _didIteratorError7 = true;
      _iteratorError7 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion7 && _iterator7.return) {
          _iterator7.return();
        }
      } finally {
        if (_didIteratorError7) {
          throw _iteratorError7;
        }
      }
    }
  }
  return result;
}

// Attempt to create a simple (array, plain object) representation of
// a nested structure of ES6 iterable classes.
// Assumption is that if an entries() method is available, the iterable object
// should be represented as an object, if not as an array.
function toJS(container) {
  if (!isObject(container)) {
    return container;
  }

  if (isKeyedContainer(container)) {
    var _result = {};
    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
      for (var _iterator8 = entries(container)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
        var _step8$value = _slicedToArray(_step8.value, 2),
            key = _step8$value[0],
            value = _step8$value[1];

        _result[key] = toJS(value);
      }
    } catch (err) {
      _didIteratorError8 = true;
      _iteratorError8 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion8 && _iterator8.return) {
          _iterator8.return();
        }
      } finally {
        if (_didIteratorError8) {
          throw _iteratorError8;
        }
      }
    }

    return _result;
  }

  var result = [];
  var _iteratorNormalCompletion9 = true;
  var _didIteratorError9 = false;
  var _iteratorError9 = undefined;

  try {
    for (var _iterator9 = values(container)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
      var value = _step9.value;

      result.push(toJS(value));
    }
  } catch (err) {
    _didIteratorError9 = true;
    _iteratorError9 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion9 && _iterator9.return) {
        _iterator9.return();
      }
    } finally {
      if (_didIteratorError9) {
        throw _iteratorError9;
      }
    }
  }

  return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdXRpbHMvY29udGFpbmVyLmpzIl0sIm5hbWVzIjpbImlzT2JqZWN0IiwiaXNQbGFpbk9iamVjdCIsImlzQ29udGFpbmVyIiwiY291bnQiLCJ2YWx1ZXMiLCJpc0tleWVkQ29udGFpbmVyIiwia2V5cyIsImVudHJpZXMiLCJnZXQiLCJmb3JFYWNoIiwibWFwIiwicmVkdWNlIiwidG9KUyIsIkVSUl9OT1RfQ09OVEFJTkVSIiwiRVJSX05PVF9LRVlFRF9DT05UQUlORVIiLCJ2YWx1ZSIsImNvbnN0cnVjdG9yIiwiT2JqZWN0IiwiQXJyYXkiLCJpc0FycmF5IiwiQXJyYXlCdWZmZXIiLCJpc1ZpZXciLCJjb250YWluZXIiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsInNpemUiLCJsZW5ndGgiLCJjb3VudGVyIiwia2V5IiwiRXJyb3IiLCJwcm90b3R5cGUiLCJnZXRQcm90b3R5cGVPZiIsIml0ZXJhdG9yIiwiU3ltYm9sIiwic2hpZnQiLCJoYXNLZXllZE1ldGhvZHMiLCJrZXllZENvbnRhaW5lciIsImNvbXBvc2l0ZUtleSIsImtleUxpc3QiLCJnZXRLZXlzIiwidW5kZWZpbmVkIiwiZ2V0dGVyIiwiZ2V0R2V0dGVyIiwic3F1YXJlQnJhY2tldEdldHRlciIsImdldE1ldGhvZEdldHRlciIsIm9iaiIsImtleU1hcCIsInNwbGl0IiwidmlzaXRvciIsImlzS2V5ZWQiLCJpbmRleCIsImVsZW1lbnQiLCJyZXN1bHQiLCJ4IiwiaSIsImUiLCJwdXNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O1FBK0JnQkEsUSxHQUFBQSxRO1FBU0FDLGEsR0FBQUEsYTtRQUlBQyxXLEdBQUFBLFc7UUFXQUMsSyxHQUFBQSxLO1FBbUNBQyxNLEdBQUFBLE07UUEyQkFDLGdCLEdBQUFBLGdCO1FBaUJBQyxJLEdBQUFBLEk7UUFrQkFDLE8sR0FBQUEsTztRQTJCQUMsRyxHQUFBQSxHO1FBb0RBQyxPLEdBQUFBLE87UUF3QkFDLEcsR0FBQUEsRztRQTZCQUMs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b3VyY2VzQ29udGVudCI6WyIvLyBFUzYgaW5jbHVkZXMgaXRlcmF0aW9uIGFuZCBpdGVyYWJsZSBwcm90b2NvbHMsIGFuZCBuZXcgc3RhbmRhcmQgY29udGFpbmVyc1xuLy8gSW5mbHVlbnRpYWwgbGlicmFyaWVzIGxpa2UgSW1tdXRhYmxlLmpzIHByb3ZpZGUgdXNlZnVsIGNvbnRhaW5lcnMgdGhhdFxuLy8gYWRvcHQgdGhlc2UgY29udmVudGlvbnMuXG4vL1xuLy8gU28sIGlzIGl0IHBvc3NpYmxlIHRvIHdyaXRlIGdlbmVyaWMgSmF2YVNjcmlwdCBjb2RlIHRoYXQgd29ya3Mgd2l0aCBhbnlcbi8vIHdlbGwtd3JpdHRlbiBjb250YWluZXIgY2xhc3M/IEFuZCBpcyBpdCBwb3NzaWJsZSB0byB3cml0ZSBnZW5lcmljIGNvbnRhaW5lclxuLy8gY2xhc3NlcyB0aGF0IHdvcmsgd2l0aCBhbnkgd2VsbC13cml0dGVuIGNvZGUuXG4vL1xuLy8gQWxtb3N0LiBCdXQgaXQgaXMgbm90IHRyaXZpYWwuIEltcG9ydGFudGx5IHRoZSBzdGFuZGFyZCBKYXZhU2NyaXB0IGBPYmplY3Rgc1xuLy8gbGFjayBldmVuIGJhc2ljIGl0ZXJhdGlvbiBzdXBwb3J0IGFuZCBldmVuIHN0YW5kYXJkIEphdmFTY3JpcHQgYEFycmF5YHNcbi8vIGRpZmZlciBpbiBtaW5vciBidXQgaW1wb3J0YW50IGFzcGVjdHMgZnJvbSB0aGUgbmV3IGNsYXNzZXMuXG4vL1xuLy8gVGhlIGJhZCBuZXdzIGlzIHRoYXQgaXQgZG9lcyBub3QgYXBwZWFyIHRoYXQgdGhlc2UgdGhpbmdzIGFyZSBnb2luZyB0byBiZVxuLy8gc29sdmVkIHNvb24sIGV2ZW4gaW4gYW4gYWN0aXZlbHkgZXZvbHZpbmcgbGFuZ3VhZ2UgbGlrZSBKYXZhU2NyaXB0LiBUaGVcbi8vIHJlYXNvbiBpcyBjb25jZXJucy5cbi8vXG4vLyBUaGUgZ29vZCBuZXdzIGlzIHRoYXQgaXQgaXMgbm90IG92ZXJseSBoYXJkIHRvIFwicGFwZXIgb3ZlclwiIHRoZSBkaWZmZXJlbmNlc1xuLy8gd2l0aCBhIHNldCBvZiBzbWFsbCBlZmZpY2llbnQgZnVuY3Rpb25zLiBBbmQgdm9pbGEsIGNvbnRhaW5lci5qcy5cbi8vXG4vLyBEaWZmZXJlbnQgdHlwZXMgb2YgY29udGFpbmVycyBwcm92aWRlIGRpZmZlcmVudCB0eXBlcyBvZiBhY2Nlc3MuXG4vLyBBIHJhbmRvbSBhY2Nlc3MgY29udGFpbmVyXG4vLyBBIGtleWVkIGNvbnRhaW5lclxuXG5jb25zdCBFUlJfTk9UX0NPTlRBSU5FUiA9ICdFeHBlY3RlZCBhIGNvbnRhaW5lcic7XG5jb25zdCBFUlJfTk9UX0tFWUVEX0NPTlRBSU5FUiA9ICdFeHBlY3RlZCBhIFwia2V5ZWRcIiBjb250YWluZXInO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhcmd1bWVudCBpcyBhbiBpbmRleGFibGUgb2JqZWN0IChub3QgYSBwcmltaXRpdmUgdmFsdWUsIG5vciBudWxsKVxuICogQHBhcmFtIHsqfSB2YWx1ZSAtIEphdmFTY3JpcHQgdmFsdWUgdG8gYmUgdGVzdGVkXG4gKiBAcmV0dXJuIHtCb29sZWFufSAtIHRydWUgaWYgYXJndW1lbnQgaXMgYSBKYXZhU2NyaXB0IG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGFyZ3VtZW50IGlzIGEgcGxhaW4gb2JqZWN0IChub3QgYSBjbGFzcyBvciBhcnJheSBldGMpXG4gKiBAcGFyYW0geyp9IHZhbHVlIC0gSmF2YVNjcmlwdCB2YWx1ZSB0byBiZSB0ZXN0ZWRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IC0gdHJ1ZSBpZiBhcmd1bWVudCBpcyBhIHBsYWluIEphdmFTY3JpcHQgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlLmNvbnN0cnVjdG9yID09PSBPYmplY3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbnRhaW5lcih2YWx1ZSkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgQXJyYXlCdWZmZXIuaXNWaWV3KHZhbHVlKSB8fCBpc09iamVjdCh2YWx1ZSk7XG59XG5cbi8qKlxuICogRGVkdWNlcyBudW1lciBvZiBlbGVtZW50cyBpbiBhIEphdmFTY3JpcHQgY29udGFpbmVyLlxuICogLSBBdXRvLWRlZHVjdGlvbiBmb3IgRVM2IGNvbnRhaW5lcnMgdGhhdCBkZWZpbmUgYSBjb3VudCgpIG1ldGhvZFxuICogLSBBdXRvLWRlZHVjdGlvbiBmb3IgRVM2IGNvbnRhaW5lcnMgdGhhdCBkZWZpbmUgYSBzaXplIG1lbWJlclxuICogLSBBdXRvLWRlZHVjdGlvbiBmb3IgQ2xhc3NpYyBBcnJheXMgdmlhIHRoZSBidWlsdC1pbiBsZW5ndGggYXR0cmlidXRlXG4gKiAtIEFsc28gaGFuZGxlcyBvYmplY3RzLCBhbHRob3VnaCBub3RlIHRoYXQgdGhpcyBhbiBPKE4pIG9wZXJhdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gY291bnQoY29udGFpbmVyKSB7XG4gIC8vIENoZWNrIGlmIEVTNiBjb2xsZWN0aW9uIFwiY291bnRcIiBmdW5jdGlvbiBpcyBhdmFpbGFibGVcbiAgaWYgKHR5cGVvZiBjb250YWluZXIuY291bnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gY29udGFpbmVyLmNvdW50KCk7XG4gIH1cblxuICAvLyBDaGVjayBpZiBFUzYgY29sbGVjdGlvbiBcInNpemVcIiBhdHRyaWJ1dGUgaXMgc2V0XG4gIGlmIChOdW1iZXIuaXNGaW5pdGUoY29udGFpbmVyLnNpemUpKSB7XG4gICAgcmV0dXJuIGNvbnRhaW5lci5zaXplO1xuICB9XG5cbiAgLy8gQ2hlY2sgaWYgYXJyYXkgbGVuZ3RoIGF0dHJpYnV0ZSBpcyBzZXRcbiAgLy8gTm90ZTogY2hlY2tpbmcgdGhpcyBsYXN0IHNpbmNlIHNvbWUgRVM2IGNvbGxlY3Rpb25zIChJbW11dGFibGUuanMpXG4gIC8vIGVtaXQgcHJvZnVzZSB3YXJuaW5ncyB3aGVuIHRyeWluZyB0byBhY2Nlc3MgYGxlbmd0aGAgYXR0cmlidXRlXG4gIGlmIChOdW1iZXIuaXNGaW5pdGUoY29udGFpbmVyLmxlbmd0aCkpIHtcbiAgICByZXR1cm4gY29udGFpbmVyLmxlbmd0aDtcbiAgfVxuXG4gIC8vIE5vdGUgdGhhdCBnZXR0aW5nIHRoZSBjb3VudCBvZiBhbiBvYmplY3QgaXMgTyhOKVxuICBpZiAoaXNQbGFpbk9iamVjdChjb250YWluZXIpKSB7XG4gICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgIGZvciAoY29uc3Qga2V5IGluIGNvbnRhaW5lcikgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICBjb3VudGVyKys7XG4gICAgfVxuICAgIHJldHVybiBjb3VudGVyO1xuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKEVSUl9OT1RfQ09OVEFJTkVSKTtcbn1cblxuLy8gUmV0dXJucyBhbiBpdGVyYXRvciBvdmVyIGFsbCAqKnZhbHVlcyoqIG9mIGEgY29udGFpbmVyXG4vL1xuLy8gTm90ZTogS2V5ZWQgY29udGFpbmVycyBhcmUgZXhwZWN0ZWQgdG8gcHJvdmlkZSBhbiBgdmFsdWVzKClgIG1ldGhvZCxcbi8vIHdpdGggdGhlIGV4Y2VwdGlvbiBvZiBwbGFpbiBvYmplY3RzIHdoaWNoIGdldCBzcGVjaWFsIGhhbmRsaW5nXG5cbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZXMoY29udGFpbmVyKSB7XG4gIC8vIEhBQ0sgLSBOZWVkZWQgdG8gbWFrZSBidWJsZSBjb21waWxlciB3b3JrXG4gIGlmIChBcnJheS5pc0FycmF5KGNvbnRhaW5lcikpIHtcbiAgICByZXR1cm4gY29udGFpbmVyO1xuICB9XG5cbiAgY29uc3QgcHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGNvbnRhaW5lcik7XG4gIGlmICh0eXBlb2YgcHJvdG90eXBlLnZhbHVlcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBjb250YWluZXIudmFsdWVzKCk7XG4gIH1cblxuICBpZiAodHlwZW9mIGNvbnRhaW5lci5jb25zdHJ1Y3Rvci52YWx1ZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gY29udGFpbmVyLmNvbnN0cnVjdG9yLnZhbHVlcyhjb250YWluZXIpO1xuICB9XG5cbiAgY29uc3QgaXRlcmF0b3IgPSBjb250YWluZXJbU3ltYm9sLml0ZXJhdG9yXTtcbiAgaWYgKGl0ZXJhdG9yKSB7XG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgfVxuXG4gIHRocm93IG5ldyBFcnJvcihFUlJfTk9UX0NPTlRBSU5FUik7XG59XG5cbi8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gS0VZRUQgQ09OVEFJTkVSU1xuLy8gRXhhbXBsZXM6IG9iamVjdHMsIE1hcCwgSW1tdXRhYmxlLk1hcCwgLi4uXG5cbmV4cG9ydCBmdW5jdGlvbiBpc0tleWVkQ29udGFpbmVyKGNvbnRhaW5lcikge1xuICBpZiAoQXJyYXkuaXNBcnJheShjb250YWluZXIpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb250YWluZXIpO1xuICAvLyBIQUNLIHRvIGNsYXNzaWZ5IEltbXV0YWJsZS5MaXN0IGFzIG5vbiBrZXllZCBjb250YWluZXJcbiAgaWYgKHR5cGVvZiBwcm90b3R5cGUuc2hpZnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgaGFzS2V5ZWRNZXRob2RzID0gdHlwZW9mIHByb3RvdHlwZS5nZXQgPT09ICdmdW5jdGlvbic7XG4gIHJldHVybiBoYXNLZXllZE1ldGhvZHMgfHwgaXNQbGFpbk9iamVjdChjb250YWluZXIpO1xufVxuXG4vLyBSZXR1cm5zIGFuIGl0ZXJhdG9yIG92ZXIgYWxsICoqZW50cmllcyoqIG9mIGEgXCJrZXllZCBjb250YWluZXJcIlxuLy8gS2V5ZWQgY29udGFpbmVycyBhcmUgZXhwZWN0ZWQgdG8gcHJvdmlkZSBhIGBrZXlzKClgIG1ldGhvZCxcbi8vIHdpdGggdGhlIGV4Y2VwdGlvbiBvZiBwbGFpbiBvYmplY3RzLlxuLy9cbmV4cG9ydCBmdW5jdGlvbiBrZXlzKGtleWVkQ29udGFpbmVyKSB7XG4gIGNvbnN0IHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihrZXllZENvbnRhaW5lcik7XG4gIGlmICh0eXBlb2YgcHJvdG90eXBlLmtleXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4ga2V5ZWRDb250YWluZXIua2V5cygpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBrZXllZENvbnRhaW5lci5jb25zdHJ1Y3Rvci5rZXlzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGtleWVkQ29udGFpbmVyLmNvbnN0cnVjdG9yLmtleXMoa2V5ZWRDb250YWluZXIpO1xuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKEVSUl9OT1RfS0VZRURfQ09OVEFJTkVSKTtcbn1cblxuLy8gUmV0dXJucyBhbiBpdGVyYXRvciBvdmVyIGFsbCAqKmVudHJpZXMqKiBvZiBhIFwia2V5ZWQgY29udGFpbmVyXCJcbi8vXG4vLyBLZXllZCBjb250YWluZXJzIGFyZSBleHBlY3RlZCB0byBwcm92aWRlIGFuIGBlbnRyaWVzKClgIG1ldGhvZCxcbi8vIHdpdGggdGhlIGV4Y2VwdGlvbiBvZiBwbGFpbiBvYmplY3RzLlxuLy9cbmV4cG9ydCBmdW5jdGlvbiBlbnRyaWVzKGtleWVkQ29udGFpbmVyKSB7XG4gIGNvbnN0IHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihrZXllZENvbnRhaW5lcik7XG4gIGlmICh0eXBlb2YgcHJvdG90eXBlLmVudHJpZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4ga2V5ZWRDb250YWluZXIuZW50cmllcygpO1xuICB9XG5cbiAgLy8gaWYgKHR5cGVvZiBwcm90b3R5cGUuY29uc3RydWN0b3IuZW50cmllcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyAgIHJldHVybiBwcm90b3R5cGUuY29uc3RydWN0b3IuZW50cmllcyhrZXllZENvbnRhaW5lcik7XG4gIC8vIH1cblxuICBpZiAodHlwZW9mIGtleWVkQ29udGFpbmVyLmNvbnN0cnVjdG9yLmVudHJpZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4ga2V5ZWRDb250YWluZXIuY29uc3RydWN0b3IuZW50cmllcyhrZXllZENvbnRhaW5lcik7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBBY2Nlc3MgcHJvcGVydGllcyBvZiBuZXN0ZWQgY29udGFpbmVycyB1c2luZyBkb3QtcGF0aCBub3RhdGlvblxuICogLSBTdXBwb3J0cyBwbGFpbiBvYmplY3RzIGFuZCBhcnJheXMsIGFzIHdlbGwgYXMgY2xhc3NlcyB3aXRoIGBnZXRgIG1ldGhvZHNcbiAqICAgc3VjaCBhcyBFUzYgTWFwcywgSW1tdXRhYmxlLmpzIG9iamVjdHMgZXRjXG4gKiAtIFJldHVybnMgdW5kZWZpbmVkIGlmIGFueSBjb250YWluZXIgaXMgbm90IHZhbGlkLCBpbnN0ZWFkIG9mIHRocm93aW5nXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRhaW5lciAtIGNvbnRhaW5lciB0aGF0IHN1cHBvcnRzIGdldFxuICogQHBhcmFtIHtTdHJpbmd8Kn0gY29tcG9zaXRlS2V5IC0ga2V5IHRvIGFjY2VzcywgY2FuIGJlICcuJy1zZXBhcmF0ZWQgc3RyaW5nXG4gKiBAcmV0dXJuIHsqfSAtIHZhbHVlIGluIHRoZSBmaW5hbCBrZXkgb2YgdGhlIG5lc3RlZCBjb250YWluZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldChjb250YWluZXIsIGNvbXBvc2l0ZUtleSkge1xuICAvLyBTcGxpdCB0aGUga2V5IGludG8gc3Via2V5c1xuICBjb25zdCBrZXlMaXN0ID0gZ2V0S2V5cyhjb21wb3NpdGVLZXkpO1xuICAvLyBSZWN1cnNpdmVseSBnZXQgdGhlIHZhbHVlIG9mIGVhY2gga2V5O1xuICBsZXQgdmFsdWUgPSBjb250YWluZXI7XG4gIGZvciAoY29uc3Qga2V5IG9mIGtleUxpc3QpIHtcbiAgICAvLyBJZiBhbnkgaW50ZXJtZWRpYXRlIHN1YmZpZWxkIGlzIG5vdCBhIGNvbnRhaW5lciwgcmV0dXJuIHVuZGVmaW5lZFxuICAgIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBHZXQgdGhlIGBnZXR0ZXJgIGZvciB0aGlzIGNvbnRhaW5lclxuICAgIGNvbnN0IGdldHRlciA9IGdldEdldHRlcih2YWx1ZSk7XG4gICAgLy8gVXNlIHRoZSBnZXR0ZXIgdG8gZ2V0IHRoZSB2YWx1ZSBmb3IgdGhlIGtleVxuICAgIHZhbHVlID0gZ2V0dGVyKHZhbHVlLCBrZXkpO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLy8gRGVmYXVsdCBnZXR0ZXIgaXMgY29udGFpbmVyIGluZGV4aW5nXG5jb25zdCBzcXVhcmVCcmFja2V0R2V0dGVyID0gKGNvbnRhaW5lciwga2V5KSA9PiBjb250YWluZXJba2V5XTtcbmNvbnN0IGdldE1ldGhvZEdldHRlciA9IChvYmosIGtleSkgPT4gb2JqLmdldChrZXkpO1xuLy8gQ2FjaGUga2V5IHRvIGtleSBhcnJheXMgZm9yIHNwZWVkXG5jb25zdCBrZXlNYXAgPSB7fTtcblxuLy8gTG9va3MgZm9yIGEgYGdldGAgZnVuY3Rpb24gb24gdGhlIHByb3RvdHlwZVxuLy8gVE9ETyAtIGZvbGxvdyBwcm90b3R5cGUgY2hhaW4/XG4vLyBAcHJpdmF0ZVxuLy8gQHJldHVybiB7RnVuY3Rpb259IC0gZ2V0IGZ1bmN0aW9uOiAoY29udGFpbmVyLCBrZXkpID0+IHZhbHVlXG5mdW5jdGlvbiBnZXRHZXR0ZXIoY29udGFpbmVyKSB7XG4gIC8vIENoZWNrIGlmIGNvbnRhaW5lciBoYXMgYSBzcGVjaWFsIGdldCBtZXRob2RcbiAgY29uc3QgcHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGNvbnRhaW5lcik7XG4gIHJldHVybiBwcm90b3R5cGUuZ2V0ID8gZ2V0TWV0aG9kR2V0dGVyIDogc3F1YXJlQnJhY2tldEdldHRlcjtcbn1cblxuLy8gVGFrZXMgYSBzdHJpbmcgb2YgJy4nIHNlcGFyYXRlZCBrZXlzIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIGtleXNcbi8vIEUuZy4gJ2ZlYXR1cmUuZ2VvbWV0cnkudHlwZScgPT4gJ2ZlYXR1cmUnLCAnZ2VvbWV0cnknLCAndHlwZSdcbi8vIEBwcml2YXRlXG5mdW5jdGlvbiBnZXRLZXlzKGNvbXBvc2l0ZUtleSkge1xuICBpZiAodHlwZW9mIGNvbXBvc2l0ZUtleSA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBlbHNlIGFzc3VtZSBzdHJpbmcgYW5kIHNwbGl0IGFyb3VuZCBkb3RzXG4gICAgbGV0IGtleUxpc3QgPSBrZXlNYXBbY29tcG9zaXRlS2V5XTtcbiAgICBpZiAoIWtleUxpc3QpIHtcbiAgICAgIGtleUxpc3QgPSBjb21wb3NpdGVLZXkuc3BsaXQoJy4nKTtcbiAgICAgIGtleU1hcFtjb21wb3NpdGVLZXldID0ga2V5TGlzdDtcbiAgICB9XG4gICAgcmV0dXJuIGtleUxpc3Q7XG4gIH1cbiAgLy8gV3JhcCBpbiBhcnJheSBpZiBuZWVkZWRcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoY29tcG9zaXRlS2V5KSA/IGNvbXBvc2l0ZUtleSA6IFtjb21wb3NpdGVLZXldO1xufVxuXG4vLyBcIkdlbmVyaWNcIiBmb3JFYWNoIHRoYXQgZmlyc3QgYXR0ZW1wdHMgdG8gY2FsbCBhXG5leHBvcnQgZnVuY3Rpb24gZm9yRWFjaChjb250YWluZXIsIHZpc2l0b3IpIHtcbiAgLy8gSGFjayB0byB3b3JrIGFyb3VuZCBsaW1pdGF0aW9ucyBpbiBidWJsZSBjb21waWxlclxuICBjb25zdCBwcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY29udGFpbmVyKTtcbiAgaWYgKHByb3RvdHlwZS5mb3JFYWNoKSB7XG4gICAgY29udGFpbmVyLmZvckVhY2godmlzaXRvcik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgaXNLZXllZCA9IGlzS2V5ZWRDb250YWluZXIoY29udGFpbmVyKTtcbiAgaWYgKGlzS2V5ZWQpIHtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBlbnRyaWVzKGNvbnRhaW5lcikpIHtcbiAgICAgIHZpc2l0b3IodmFsdWUsIGtleSwgY29udGFpbmVyKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IGluZGV4ID0gMDtcbiAgZm9yIChjb25zdCBlbGVtZW50IG9mIHZhbHVlcyhjb250YWluZXIpKSB7XG4gICAgLy8gcmVzdWx0W2luZGV4XSA9IHZpc2l0b3IoZWxlbWVudCwgaW5kZXgsIGNvbnRhaW5lcik7XG4gICAgdmlzaXRvcihlbGVtZW50LCBpbmRleCwgY29udGFpbmVyKTtcbiAgICBpbmRleCsrO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXAoY29udGFpbmVyLCB2aXNpdG9yKSB7XG4gIC8vIEhhY2sgdG8gd29yayBhcm91bmQgbGltaXRhdGlvbnMgaW4gYnVibGUgY29tcGlsZXJcbiAgY29uc3QgcHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGNvbnRhaW5lcik7XG4gIGlmIChwcm90b3R5cGUuZm9yRWFjaCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgIGNvbnRhaW5lci5mb3JFYWNoKCh4LCBpLCBlKSA9PiByZXN1bHQucHVzaCh2aXNpdG9yKHgsIGksIGUpKSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGNvbnN0IGlzS2V5ZWQgPSBpc0tleWVkQ29udGFpbmVyKGNvbnRhaW5lcik7XG4gIC8vIGNvbnN0IHJlc3VsdCA9IG5ldyBBcnJheShjb3VudChjb250YWluZXIpKTtcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGlmIChpc0tleWVkKSB7XG4gICAgLy8gVE9ETyAtIHNob3VsZCB0aGlzIGNyZWF0ZSBhbiBvYmplY3Q/XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgZW50cmllcyhjb250YWluZXIpKSB7XG4gICAgICAvLyByZXN1bHRbaW5kZXhdID0gdmlzaXRvcihlbGVtZW50LCBpbmRleCwgY29udGFpbmVyKTtcbiAgICAgIHJlc3VsdC5wdXNoKHZpc2l0b3IodmFsdWUsIGtleSwgY29udGFpbmVyKSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGxldCBpbmRleCA9IDA7XG4gICAgZm9yIChjb25zdCBlbGVtZW50IG9mIHZhbHVlcyhjb250YWluZXIpKSB7XG4gICAgICAvLyByZXN1bHRbaW5kZXhdID0gdmlzaXRvcihlbGVtZW50LCBpbmRleCwgY29udGFpbmVyKTtcbiAgICAgIHJlc3VsdC5wdXNoKHZpc2l0b3IoZWxlbWVudCwgaW5kZXgsIGNvbnRhaW5lcikpO1xuICAgICAgaW5kZXgrKztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZShjb250YWluZXIsIHZpc2l0b3IpIHtcbiAgLy8gSGFjayB0byB3b3JrIGFyb3VuZCBsaW1pdGF0aW9ucyBpbiBidWJsZSBjb21waWxlclxuICBjb25zdCBwcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY29udGFpbmVyKTtcbiAgaWYgKHByb3RvdHlwZS5mb3JFYWNoKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgY29udGFpbmVyLmZvckVhY2goKHgsIGksIGUpID0+IHJlc3VsdC5wdXNoKHZpc2l0b3IoeCwgaSwgZSkpKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgY29uc3QgaXNLZXllZCA9IGlzS2V5ZWRDb250YWluZXIoY29udGFpbmVyKTtcbiAgLy8gY29uc3QgcmVzdWx0ID0gbmV3IEFycmF5KGNvdW50KGNvbnRhaW5lcikpO1xuICBjb25zdCByZXN1bHQgPSBbXTtcbiAgaWYgKGlzS2V5ZWQpIHtcbiAgICAvLyBUT0RPIC0gc2hvdWxkIHRoaXMgY3JlYXRlIGFuIG9iamVjdD9cbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBlbnRyaWVzKGNvbnRhaW5lcikpIHtcbiAgICAgIC8vIHJlc3VsdFtpbmRleF0gPSB2aXNpdG9yKGVsZW1lbnQsIGluZGV4LCBjb250YWluZXIpO1xuICAgICAgcmVzdWx0LnB1c2godmlzaXRvcih2YWx1ZSwga2V5LCBjb250YWluZXIpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgdmFsdWVzKGNvbnRhaW5lcikpIHtcbiAgICAgIC8vIHJlc3VsdFtpbmRleF0gPSB2aXNpdG9yKGVsZW1lbnQsIGluZGV4LCBjb250YWluZXIpO1xuICAgICAgcmVzdWx0LnB1c2godmlzaXRvcihlbGVtZW50LCBpbmRleCwgY29udGFpbmVyKSk7XG4gICAgICBpbmRleCsrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyBBdHRlbXB0IHRvIGNyZWF0ZSBhIHNpbXBsZSAoYXJyYXksIHBsYWluIG9iamVjdCkgcmVwcmVzZW50YXRpb24gb2Zcbi8vIGEgbmVzdGVkIHN0cnVjdHVyZSBvZiBFUzYgaXRlcmFibGUgY2xhc3Nlcy5cbi8vIEFzc3VtcHRpb24gaXMgdGhhdCBpZiBhbiBlbnRyaWVzKCkgbWV0aG9kIGlzIGF2YWlsYWJsZSwgdGhlIGl0ZXJhYmxlIG9iamVjdFxuLy8gc2hvdWxkIGJlIHJlcHJlc2VudGVkIGFzIGFuIG9iamVjdCwgaWYgbm90IGFzIGFuIGFycmF5LlxuZXhwb3J0IGZ1bmN0aW9uIHRvSlMoY29udGFpbmVyKSB7XG4gIGlmICghaXNPYmplY3QoY29udGFpbmVyKSkge1xuICAgIHJldHVybiBjb250YWluZXI7XG4gIH1cblxuICBpZiAoaXNLZXllZENvbnRhaW5lcihjb250YWluZXIpKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgZW50cmllcyhjb250YWluZXIpKSB7XG4gICAgICByZXN1bHRba2V5XSA9IHRvSlModmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzKGNvbnRhaW5lcikpIHtcbiAgICByZXN1bHQucHVzaCh0b0pTKHZhbHVlKSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiJdfQ==