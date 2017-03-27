'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = autobind;
var PREDEFINED = ['constructor', 'render', 'componentWillMount', 'componentDidMount', 'componentWillReceiveProps', 'shouldComponentUpdate', 'componentWillUpdate', 'componentDidUpdate', 'componentWillUnmount'];

/**
 * Binds the "this" argument of all functions on a class instance to the instance
 * @param {Object} obj - class instance (typically a react component)
 */
function autobind(obj) {
  var proto = Object.getPrototypeOf(obj);
  var propNames = Object.getOwnPropertyNames(proto);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var key = _step.value;

      if (typeof obj[key] === 'function') {
        if (!PREDEFINED.find(function (name) {
          return key === name;
        })) {
          obj[key] = obj[key].bind(obj);
        }
      }
    };

    for (var _iterator = propNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
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
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9hdXRvYmluZC5qcyJdLCJuYW1lcyI6WyJhdXRvYmluZCIsIlBSRURFRklORUQiLCJvYmoiLCJwcm90byIsIk9iamVjdCIsImdldFByb3RvdHlwZU9mIiwicHJvcE5hbWVzIiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsImtleSIsImZpbmQiLCJuYW1lIiwiYmluZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBVXdCQSxRO0FBVnhCLElBQU1DLGFBQWEsQ0FDakIsYUFEaUIsRUFDRixRQURFLEVBQ1Esb0JBRFIsRUFDOEIsbUJBRDlCLEVBRWpCLDJCQUZpQixFQUVZLHVCQUZaLEVBRXFDLHFCQUZyQyxFQUdqQixvQkFIaUIsRUFHSyxzQkFITCxDQUFuQjs7QUFNQTs7OztBQUllLFNBQVNELFFBQVQsQ0FBa0JFLEdBQWxCLEVBQXVCO0FBQ3BDLE1BQU1DLFFBQVFDLE9BQU9DLGNBQVAsQ0FBc0JILEdBQXRCLENBQWQ7QUFDQSxNQUFNSSxZQUFZRixPQUFPRyxtQkFBUCxDQUEyQkosS0FBM0IsQ0FBbEI7QUFGb0M7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSxVQUd6QkssR0FIeUI7O0FBSWxDLFVBQUksT0FBT04sSUFBSU0sR0FBSixDQUFQLEtBQW9CLFVBQXhCLEVBQW9DO0FBQ2xDLFlBQUksQ0FBQ1AsV0FBV1EsSUFBWCxDQUFnQjtBQUFBLGlCQUFRRCxRQUFRRSxJQUFoQjtBQUFBLFNBQWhCLENBQUwsRUFBNEM7QUFDMUNSLGNBQUlNLEdBQUosSUFBV04sSUFBSU0sR0FBSixFQUFTRyxJQUFULENBQWNULEdBQWQsQ0FBWDtBQUNEO0FBQ0Y7QUFSaUM7O0FBR3BDLHlCQUFrQkksU0FBbEIsOEhBQTZCO0FBQUE7QUFNNUI7QUFUbUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVVyQyIsImZpbGUiOiJhdXRvYmluZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFBSRURFRklORUQgPSBbXG4gICdjb25zdHJ1Y3RvcicsICdyZW5kZXInLCAnY29tcG9uZW50V2lsbE1vdW50JywgJ2NvbXBvbmVudERpZE1vdW50JyxcbiAgJ2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMnLCAnc2hvdWxkQ29tcG9uZW50VXBkYXRlJywgJ2NvbXBvbmVudFdpbGxVcGRhdGUnLFxuICAnY29tcG9uZW50RGlkVXBkYXRlJywgJ2NvbXBvbmVudFdpbGxVbm1vdW50J1xuXTtcblxuLyoqXG4gKiBCaW5kcyB0aGUgXCJ0aGlzXCIgYXJndW1lbnQgb2YgYWxsIGZ1bmN0aW9ucyBvbiBhIGNsYXNzIGluc3RhbmNlIHRvIHRoZSBpbnN0YW5jZVxuICogQHBhcmFtIHtPYmplY3R9IG9iaiAtIGNsYXNzIGluc3RhbmNlICh0eXBpY2FsbHkgYSByZWFjdCBjb21wb25lbnQpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGF1dG9iaW5kKG9iaikge1xuICBjb25zdCBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xuICBjb25zdCBwcm9wTmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm90byk7XG4gIGZvciAoY29uc3Qga2V5IG9mIHByb3BOYW1lcykge1xuICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmICghUFJFREVGSU5FRC5maW5kKG5hbWUgPT4ga2V5ID09PSBuYW1lKSkge1xuICAgICAgICBvYmpba2V5XSA9IG9ialtrZXldLmJpbmQob2JqKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==