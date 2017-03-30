'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.compareProps = compareProps;
exports.areEqualShallow = areEqualShallow;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * @param {Object} opt.oldProps - object with old key/value pairs
 * @param {Object} opt.newProps - object with new key/value pairs
 * @param {Object} opt.ignoreProps={} - object, keys that should not be compared
 * @returns {null|String} - null when values of all keys are strictly equal.
 *   if unequal, returns a string explaining what changed.
 */
/* eslint-disable max-statements, complexity */
function compareProps() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      oldProps = _ref.oldProps,
      newProps = _ref.newProps,
      _ref$ignoreProps = _ref.ignoreProps,
      ignoreProps = _ref$ignoreProps === undefined ? {} : _ref$ignoreProps;

  (0, _assert2.default)(oldProps !== undefined && newProps !== undefined, 'compareProps args');

  if (oldProps === newProps) {
    return null;
  }

  if ((typeof oldProps === 'undefined' ? 'undefined' : _typeof(oldProps)) !== 'object' || oldProps === null) {
    return 'old props is not an object';
  }
  if ((typeof newProps === 'undefined' ? 'undefined' : _typeof(newProps)) !== 'object' || newProps === null) {
    return 'new props is not an object';
  }

  // Test if new props different from old props
  for (var key in oldProps) {
    if (!(key in ignoreProps)) {
      if (!newProps.hasOwnProperty(key)) {
        return 'prop ' + key + ' dropped: ' + oldProps[key] + ' -> (undefined)';
      } else if (oldProps[key] !== newProps[key]) {
        return 'prop ' + key + ' changed: ' + oldProps[key] + ' -> ' + newProps[key];
      }
    }
  }

  // Test if any new props have been added
  for (var _key in newProps) {
    if (!(_key in ignoreProps)) {
      if (!oldProps.hasOwnProperty(_key)) {
        return 'prop ' + _key + ' added: (undefined) -> ' + newProps[_key];
      }
    }
  }

  return null;
}
/* eslint-enable max-statements, complexity */

// Shallow compare
/* eslint-disable complexity */
function areEqualShallow(a, b) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref2$ignore = _ref2.ignore,
      ignore = _ref2$ignore === undefined ? {} : _ref2$ignore;

  if (a === b) {
    return true;
  }

  if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) !== 'object' || a === null || (typeof b === 'undefined' ? 'undefined' : _typeof(b)) !== 'object' || b === null) {
    return false;
  }

  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  for (var key in a) {
    if (!(key in ignore) && (!(key in b) || a[key] !== b[key])) {
      return false;
    }
  }
  for (var _key2 in b) {
    if (!(_key2 in ignore) && !(_key2 in a)) {
      return false;
    }
  }
  return true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdXRpbHMvY29tcGFyZS1vYmplY3RzLmpzIl0sIm5hbWVzIjpbImNvbXBhcmVQcm9wcyIsImFyZUVxdWFsU2hhbGxvdyIsIm9sZFByb3BzIiwibmV3UHJvcHMiLCJpZ25vcmVQcm9wcyIsInVuZGVmaW5lZCIsImtleSIsImhhc093blByb3BlcnR5IiwiYSIsImIiLCJpZ25vcmUiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztRQVlnQkEsWSxHQUFBQSxZO1FBd0NBQyxlLEdBQUFBLGU7O0FBcERoQjs7Ozs7O0FBRUE7Ozs7Ozs7OztBQVNBO0FBQ08sU0FBU0QsWUFBVCxHQUFtRTtBQUFBLGlGQUFKLEVBQUk7QUFBQSxNQUE1Q0UsUUFBNEMsUUFBNUNBLFFBQTRDO0FBQUEsTUFBbENDLFFBQWtDLFFBQWxDQSxRQUFrQztBQUFBLDhCQUF4QkMsV0FBd0I7QUFBQSxNQUF4QkEsV0FBd0Isb0NBQVYsRUFBVTs7QUFDeEUsd0JBQU9GLGFBQWFHLFNBQWIsSUFBMEJGLGFBQWFFLFNBQTlDLEVBQXlELG1CQUF6RDs7QUFFQSxNQUFJSCxhQUFhQyxRQUFqQixFQUEyQjtBQUN6QixXQUFPLElBQVA7QUFDRDs7QUFFRCxNQUFJLFFBQU9ELFFBQVAseUNBQU9BLFFBQVAsT0FBb0IsUUFBcEIsSUFBZ0NBLGFBQWEsSUFBakQsRUFBdUQ7QUFDckQsV0FBTyw0QkFBUDtBQUNEO0FBQ0QsTUFBSSxRQUFPQyxRQUFQLHlDQUFPQSxRQUFQLE9BQW9CLFFBQXBCLElBQWdDQSxhQUFhLElBQWpELEVBQXVEO0FBQ3JELFdBQU8sNEJBQVA7QUFDRDs7QUFFRDtBQUNBLE9BQUssSUFBTUcsR0FBWCxJQUFrQkosUUFBbEIsRUFBNEI7QUFDMUIsUUFBSSxFQUFFSSxPQUFPRixXQUFULENBQUosRUFBMkI7QUFDekIsVUFBSSxDQUFDRCxTQUFTSSxjQUFULENBQXdCRCxHQUF4QixDQUFMLEVBQW1DO0FBQ2pDLHlCQUFlQSxHQUFmLGtCQUErQkosU0FBU0ksR0FBVCxDQUEvQjtBQUNELE9BRkQsTUFFTyxJQUFJSixTQUFTSSxHQUFULE1BQWtCSCxTQUFTRyxHQUFULENBQXRCLEVBQXFDO0FBQzFDLHlCQUFlQSxHQUFmLGtCQUErQkosU0FBU0ksR0FBVCxDQUEvQixZQUFtREgsU0FBU0csR0FBVCxDQUFuRDtBQUNEO0FBQ0Y7QUFDRjs7QUFFRDtBQUNBLE9BQUssSUFBTUEsSUFBWCxJQUFrQkgsUUFBbEIsRUFBNEI7QUFDMUIsUUFBSSxFQUFFRyxRQUFPRixXQUFULENBQUosRUFBMkI7QUFDekIsVUFBSSxDQUFDRixTQUFTSyxjQUFULENBQXdCRCxJQUF4QixDQUFMLEVBQW1DO0FBQ2pDLHlCQUFlQSxJQUFmLCtCQUE0Q0gsU0FBU0csSUFBVCxDQUE1QztBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxTQUFPLElBQVA7QUFDRDtBQUNEOztBQUVBO0FBQ0E7QUFDTyxTQUFTTCxlQUFULENBQXlCTyxDQUF6QixFQUE0QkMsQ0FBNUIsRUFBbUQ7QUFBQSxrRkFBSixFQUFJO0FBQUEsMkJBQW5CQyxNQUFtQjtBQUFBLE1BQW5CQSxNQUFtQixnQ0FBVixFQUFVOztBQUV4RCxNQUFJRixNQUFNQyxDQUFWLEVBQWE7QUFDWCxXQUFPLElBQVA7QUFDRDs7QUFFRCxNQUFJLFFBQU9ELENBQVAseUNBQU9BLENBQVAsT0FBYSxRQUFiLElBQXlCQSxNQUFNLElBQS9CLElBQ0YsUUFBT0MsQ0FBUCx5Q0FBT0EsQ0FBUCxPQUFhLFFBRFgsSUFDdUJBLE1BQU0sSUFEakMsRUFDdUM7QUFDckMsV0FBTyxLQUFQO0FBQ0Q7O0FBRUQsTUFBSUUsT0FBT0MsSUFBUCxDQUFZSixDQUFaLEVBQWVLLE1BQWYsS0FBMEJGLE9BQU9DLElBQVAsQ0FBWUgsQ0FBWixFQUFlSSxNQUE3QyxFQUFxRDtBQUNuRCxXQUFPLEtBQVA7QUFDRDs7QUFFRCxPQUFLLElBQU1QLEdBQVgsSUFBa0JFLENBQWxCLEVBQXFCO0FBQ25CLFFBQUksRUFBRUYsT0FBT0ksTUFBVCxNQUFxQixFQUFFSixPQUFPRyxDQUFULEtBQWVELEVBQUVGLEdBQUYsTUFBV0csRUFBRUgsR0FBRixDQUEvQyxDQUFKLEVBQTREO0FBQzFELGFBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFDRCxPQUFLLElBQU1BLEtBQVgsSUFBa0JHLENBQWxCLEVBQXFCO0FBQ25CLFFBQUksRUFBRUgsU0FBT0ksTUFBVCxLQUFxQixFQUFFSixTQUFPRSxDQUFULENBQXpCLEVBQXVDO0FBQ3JDLGFBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFDRCxTQUFPLElBQVA7QUFDRCIsImZpbGUiOiJjb21wYXJlLW9iamVjdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5cbi8qKlxuICogUGVyZm9ybXMgZXF1YWxpdHkgYnkgaXRlcmF0aW5nIHRocm91Z2gga2V5cyBvbiBhbiBvYmplY3QgYW5kIHJldHVybmluZyBmYWxzZVxuICogd2hlbiBhbnkga2V5IGhhcyB2YWx1ZXMgd2hpY2ggYXJlIG5vdCBzdHJpY3RseSBlcXVhbCBiZXR3ZWVuIHRoZSBhcmd1bWVudHMuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0Lm9sZFByb3BzIC0gb2JqZWN0IHdpdGggb2xkIGtleS92YWx1ZSBwYWlyc1xuICogQHBhcmFtIHtPYmplY3R9IG9wdC5uZXdQcm9wcyAtIG9iamVjdCB3aXRoIG5ldyBrZXkvdmFsdWUgcGFpcnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHQuaWdub3JlUHJvcHM9e30gLSBvYmplY3QsIGtleXMgdGhhdCBzaG91bGQgbm90IGJlIGNvbXBhcmVkXG4gKiBAcmV0dXJucyB7bnVsbHxTdHJpbmd9IC0gbnVsbCB3aGVuIHZhbHVlcyBvZiBhbGwga2V5cyBhcmUgc3RyaWN0bHkgZXF1YWwuXG4gKiAgIGlmIHVuZXF1YWwsIHJldHVybnMgYSBzdHJpbmcgZXhwbGFpbmluZyB3aGF0IGNoYW5nZWQuXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG1heC1zdGF0ZW1lbnRzLCBjb21wbGV4aXR5ICovXG5leHBvcnQgZnVuY3Rpb24gY29tcGFyZVByb3BzKHtvbGRQcm9wcywgbmV3UHJvcHMsIGlnbm9yZVByb3BzID0ge319ID0ge30pIHtcbiAgYXNzZXJ0KG9sZFByb3BzICE9PSB1bmRlZmluZWQgJiYgbmV3UHJvcHMgIT09IHVuZGVmaW5lZCwgJ2NvbXBhcmVQcm9wcyBhcmdzJyk7XG5cbiAgaWYgKG9sZFByb3BzID09PSBuZXdQcm9wcykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvbGRQcm9wcyAhPT0gJ29iamVjdCcgfHwgb2xkUHJvcHMgPT09IG51bGwpIHtcbiAgICByZXR1cm4gJ29sZCBwcm9wcyBpcyBub3QgYW4gb2JqZWN0JztcbiAgfVxuICBpZiAodHlwZW9mIG5ld1Byb3BzICE9PSAnb2JqZWN0JyB8fCBuZXdQcm9wcyA9PT0gbnVsbCkge1xuICAgIHJldHVybiAnbmV3IHByb3BzIGlzIG5vdCBhbiBvYmplY3QnO1xuICB9XG5cbiAgLy8gVGVzdCBpZiBuZXcgcHJvcHMgZGlmZmVyZW50IGZyb20gb2xkIHByb3BzXG4gIGZvciAoY29uc3Qga2V5IGluIG9sZFByb3BzKSB7XG4gICAgaWYgKCEoa2V5IGluIGlnbm9yZVByb3BzKSkge1xuICAgICAgaWYgKCFuZXdQcm9wcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHJldHVybiBgcHJvcCAke2tleX0gZHJvcHBlZDogJHtvbGRQcm9wc1trZXldfSAtPiAodW5kZWZpbmVkKWA7XG4gICAgICB9IGVsc2UgaWYgKG9sZFByb3BzW2tleV0gIT09IG5ld1Byb3BzW2tleV0pIHtcbiAgICAgICAgcmV0dXJuIGBwcm9wICR7a2V5fSBjaGFuZ2VkOiAke29sZFByb3BzW2tleV19IC0+ICR7bmV3UHJvcHNba2V5XX1gO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFRlc3QgaWYgYW55IG5ldyBwcm9wcyBoYXZlIGJlZW4gYWRkZWRcbiAgZm9yIChjb25zdCBrZXkgaW4gbmV3UHJvcHMpIHtcbiAgICBpZiAoIShrZXkgaW4gaWdub3JlUHJvcHMpKSB7XG4gICAgICBpZiAoIW9sZFByb3BzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgcmV0dXJuIGBwcm9wICR7a2V5fSBhZGRlZDogKHVuZGVmaW5lZCkgLT4gJHtuZXdQcm9wc1trZXldfWA7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG4vKiBlc2xpbnQtZW5hYmxlIG1heC1zdGF0ZW1lbnRzLCBjb21wbGV4aXR5ICovXG5cbi8vIFNoYWxsb3cgY29tcGFyZVxuLyogZXNsaW50LWRpc2FibGUgY29tcGxleGl0eSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFyZUVxdWFsU2hhbGxvdyhhLCBiLCB7aWdub3JlID0ge319ID0ge30pIHtcblxuICBpZiAoYSA9PT0gYikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBhICE9PSAnb2JqZWN0JyB8fCBhID09PSBudWxsIHx8XG4gICAgdHlwZW9mIGIgIT09ICdvYmplY3QnIHx8IGIgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoT2JqZWN0LmtleXMoYSkubGVuZ3RoICE9PSBPYmplY3Qua2V5cyhiKS5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmb3IgKGNvbnN0IGtleSBpbiBhKSB7XG4gICAgaWYgKCEoa2V5IGluIGlnbm9yZSkgJiYgKCEoa2V5IGluIGIpIHx8IGFba2V5XSAhPT0gYltrZXldKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICBmb3IgKGNvbnN0IGtleSBpbiBiKSB7XG4gICAgaWYgKCEoa2V5IGluIGlnbm9yZSkgJiYgKCEoa2V5IGluIGEpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cbiJdfQ==