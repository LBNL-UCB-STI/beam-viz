'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSimple = isSimple;
exports.normalize = normalize;
exports.getVertexCount = getVertexCount;
exports.getTriangleCount = getTriangleCount;
exports.forEachVertex = forEachVertex;

var _utils = require('../../../lib/utils');

// Basic polygon support
//
// Handles simple and complex polygons
// Simple polygons are arrays of vertices, implicitly "closed"
// Complex polygons are arrays of simple polygons, with the first polygon
// representing the outer hull and other polygons representing holes

/**
 * Check if this is a non-nested polygon (i.e. the first element of the first element is a number)
 * @param {Array} polygon - either a complex or simple polygon
 * @return {Boolean} - true if the polygon is a simple polygon (i.e. not an array of polygons)
 */
function isSimple(polygon) {
  return polygon.length >= 1 && polygon[0].length >= 2 && Number.isFinite(polygon[0][0]);
}

/**
 * Normalize to ensure that all polygons in a list are complex - simplifies processing
 * @param {Array} polygon - either a complex or a simple polygon
 * @param {Object} opts
 * @param {Object} opts.dimensions - if 3, the coords will be padded with 0's if needed
 * @return {Array} - returns a complex polygons
 */
function normalize(polygon) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$dimensions = _ref.dimensions,
      dimensions = _ref$dimensions === undefined ? 3 : _ref$dimensions;

  return isSimple(polygon) ? [polygon] : polygon;
}

/**
 * Check if this is a non-nested polygon (i.e. the first element of the first element is a number)
 * @param {Array} polygon - either a complex or simple polygon
 * @return {Boolean} - true if the polygon is a simple polygon (i.e. not an array of polygons)
 */
function getVertexCount(polygon) {
  return isSimple(polygon) ? _utils.Container.count(polygon) : polygon.reduce(function (count, simplePolygon) {
    return count + _utils.Container.count(simplePolygon);
  }, 0);
}

// Return number of triangles needed to tesselate the polygon
function getTriangleCount(polygon) {
  var triangleCount = 0;
  var first = true;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = normalize(polygon)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var simplePolygon = _step.value;

      var size = _utils.Container.count(simplePolygon);
      if (first) {
        triangleCount += size > 3 ? size - 3 : 0;
      } else {
        triangleCount += size + 1;
      }
      first = false;
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

  return triangleCount;
}

function forEachVertex(polygon, visitor) {
  if (isSimple(polygon)) {
    _utils.Container.forEach(polygon, visitor);
    return;
  }

  var vertexIndex = 0;
  _utils.Container.forEach(polygon, function (simplePolygon) {
    _utils.Container.forEach(simplePolygon, function (v, i, p) {
      return visitor(v, vertexIndex, polygon);
    });
    vertexIndex++;
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9sYXllcnMvY29yZS9wb2x5Z29uLWxheWVyL3BvbHlnb24uanMiXSwibmFtZXMiOlsiaXNTaW1wbGUiLCJub3JtYWxpemUiLCJnZXRWZXJ0ZXhDb3VudCIsImdldFRyaWFuZ2xlQ291bnQiLCJmb3JFYWNoVmVydGV4IiwicG9seWdvbiIsImxlbmd0aCIsIk51bWJlciIsImlzRmluaXRlIiwiZGltZW5zaW9ucyIsImNvdW50IiwicmVkdWNlIiwic2ltcGxlUG9seWdvbiIsInRyaWFuZ2xlQ291bnQiLCJmaXJzdCIsInNpemUiLCJ2aXNpdG9yIiwiZm9yRWFjaCIsInZlcnRleEluZGV4IiwidiIsImkiLCJwIl0sIm1hcHBpbmdzIjoiOzs7OztRQWNnQkEsUSxHQUFBQSxRO1FBV0FDLFMsR0FBQUEsUztRQVNBQyxjLEdBQUFBLGM7UUFPQUMsZ0IsR0FBQUEsZ0I7UUFlQUMsYSxHQUFBQSxhOztBQXhEaEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7OztBQUtPLFNBQVNKLFFBQVQsQ0FBa0JLLE9BQWxCLEVBQTJCO0FBQ2hDLFNBQU9BLFFBQVFDLE1BQVIsSUFBa0IsQ0FBbEIsSUFBdUJELFFBQVEsQ0FBUixFQUFXQyxNQUFYLElBQXFCLENBQTVDLElBQWlEQyxPQUFPQyxRQUFQLENBQWdCSCxRQUFRLENBQVIsRUFBVyxDQUFYLENBQWhCLENBQXhEO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFPTyxTQUFTSixTQUFULENBQW1CSSxPQUFuQixFQUFtRDtBQUFBLGlGQUFKLEVBQUk7QUFBQSw2QkFBdEJJLFVBQXNCO0FBQUEsTUFBdEJBLFVBQXNCLG1DQUFULENBQVM7O0FBQ3hELFNBQU9ULFNBQVNLLE9BQVQsSUFBb0IsQ0FBQ0EsT0FBRCxDQUFwQixHQUFnQ0EsT0FBdkM7QUFDRDs7QUFFRDs7Ozs7QUFLTyxTQUFTSCxjQUFULENBQXdCRyxPQUF4QixFQUFpQztBQUN0QyxTQUFPTCxTQUFTSyxPQUFULElBQ0wsaUJBQVVLLEtBQVYsQ0FBZ0JMLE9BQWhCLENBREssR0FFTEEsUUFBUU0sTUFBUixDQUFlLFVBQUNELEtBQUQsRUFBUUUsYUFBUjtBQUFBLFdBQTBCRixRQUFRLGlCQUFVQSxLQUFWLENBQWdCRSxhQUFoQixDQUFsQztBQUFBLEdBQWYsRUFBaUYsQ0FBakYsQ0FGRjtBQUdEOztBQUVEO0FBQ08sU0FBU1QsZ0JBQVQsQ0FBMEJFLE9BQTFCLEVBQW1DO0FBQ3hDLE1BQUlRLGdCQUFnQixDQUFwQjtBQUNBLE1BQUlDLFFBQVEsSUFBWjtBQUZ3QztBQUFBO0FBQUE7O0FBQUE7QUFHeEMseUJBQTRCYixVQUFVSSxPQUFWLENBQTVCLDhIQUFnRDtBQUFBLFVBQXJDTyxhQUFxQzs7QUFDOUMsVUFBTUcsT0FBTyxpQkFBVUwsS0FBVixDQUFnQkUsYUFBaEIsQ0FBYjtBQUNBLFVBQUlFLEtBQUosRUFBVztBQUNURCx5QkFBaUJFLE9BQU8sQ0FBUCxHQUFXQSxPQUFPLENBQWxCLEdBQXNCLENBQXZDO0FBQ0QsT0FGRCxNQUVPO0FBQ0xGLHlCQUFpQkUsT0FBTyxDQUF4QjtBQUNEO0FBQ0RELGNBQVEsS0FBUjtBQUNEO0FBWHVDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBWXhDLFNBQU9ELGFBQVA7QUFDRDs7QUFFTSxTQUFTVCxhQUFULENBQXVCQyxPQUF2QixFQUFnQ1csT0FBaEMsRUFBeUM7QUFDOUMsTUFBSWhCLFNBQVNLLE9BQVQsQ0FBSixFQUF1QjtBQUNyQixxQkFBVVksT0FBVixDQUFrQlosT0FBbEIsRUFBMkJXLE9BQTNCO0FBQ0E7QUFDRDs7QUFFRCxNQUFJRSxjQUFjLENBQWxCO0FBQ0EsbUJBQVVELE9BQVYsQ0FBa0JaLE9BQWxCLEVBQTJCLHlCQUFpQjtBQUMxQyxxQkFBVVksT0FBVixDQUFrQkwsYUFBbEIsRUFBaUMsVUFBQ08sQ0FBRCxFQUFJQyxDQUFKLEVBQU9DLENBQVA7QUFBQSxhQUFhTCxRQUFRRyxDQUFSLEVBQVdELFdBQVgsRUFBd0JiLE9BQXhCLENBQWI7QUFBQSxLQUFqQztBQUNBYTtBQUNELEdBSEQ7QUFJRCIsImZpbGUiOiJwb2x5Z29uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb250YWluZXJ9IGZyb20gJy4uLy4uLy4uL2xpYi91dGlscyc7XG5cbi8vIEJhc2ljIHBvbHlnb24gc3VwcG9ydFxuLy9cbi8vIEhhbmRsZXMgc2ltcGxlIGFuZCBjb21wbGV4IHBvbHlnb25zXG4vLyBTaW1wbGUgcG9seWdvbnMgYXJlIGFycmF5cyBvZiB2ZXJ0aWNlcywgaW1wbGljaXRseSBcImNsb3NlZFwiXG4vLyBDb21wbGV4IHBvbHlnb25zIGFyZSBhcnJheXMgb2Ygc2ltcGxlIHBvbHlnb25zLCB3aXRoIHRoZSBmaXJzdCBwb2x5Z29uXG4vLyByZXByZXNlbnRpbmcgdGhlIG91dGVyIGh1bGwgYW5kIG90aGVyIHBvbHlnb25zIHJlcHJlc2VudGluZyBob2xlc1xuXG4vKipcbiAqIENoZWNrIGlmIHRoaXMgaXMgYSBub24tbmVzdGVkIHBvbHlnb24gKGkuZS4gdGhlIGZpcnN0IGVsZW1lbnQgb2YgdGhlIGZpcnN0IGVsZW1lbnQgaXMgYSBudW1iZXIpXG4gKiBAcGFyYW0ge0FycmF5fSBwb2x5Z29uIC0gZWl0aGVyIGEgY29tcGxleCBvciBzaW1wbGUgcG9seWdvblxuICogQHJldHVybiB7Qm9vbGVhbn0gLSB0cnVlIGlmIHRoZSBwb2x5Z29uIGlzIGEgc2ltcGxlIHBvbHlnb24gKGkuZS4gbm90IGFuIGFycmF5IG9mIHBvbHlnb25zKVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTaW1wbGUocG9seWdvbikge1xuICByZXR1cm4gcG9seWdvbi5sZW5ndGggPj0gMSAmJiBwb2x5Z29uWzBdLmxlbmd0aCA+PSAyICYmIE51bWJlci5pc0Zpbml0ZShwb2x5Z29uWzBdWzBdKTtcbn1cblxuLyoqXG4gKiBOb3JtYWxpemUgdG8gZW5zdXJlIHRoYXQgYWxsIHBvbHlnb25zIGluIGEgbGlzdCBhcmUgY29tcGxleCAtIHNpbXBsaWZpZXMgcHJvY2Vzc2luZ1xuICogQHBhcmFtIHtBcnJheX0gcG9seWdvbiAtIGVpdGhlciBhIGNvbXBsZXggb3IgYSBzaW1wbGUgcG9seWdvblxuICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzLmRpbWVuc2lvbnMgLSBpZiAzLCB0aGUgY29vcmRzIHdpbGwgYmUgcGFkZGVkIHdpdGggMCdzIGlmIG5lZWRlZFxuICogQHJldHVybiB7QXJyYXl9IC0gcmV0dXJucyBhIGNvbXBsZXggcG9seWdvbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZShwb2x5Z29uLCB7ZGltZW5zaW9ucyA9IDN9ID0ge30pIHtcbiAgcmV0dXJuIGlzU2ltcGxlKHBvbHlnb24pID8gW3BvbHlnb25dIDogcG9seWdvbjtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGlzIGlzIGEgbm9uLW5lc3RlZCBwb2x5Z29uIChpLmUuIHRoZSBmaXJzdCBlbGVtZW50IG9mIHRoZSBmaXJzdCBlbGVtZW50IGlzIGEgbnVtYmVyKVxuICogQHBhcmFtIHtBcnJheX0gcG9seWdvbiAtIGVpdGhlciBhIGNvbXBsZXggb3Igc2ltcGxlIHBvbHlnb25cbiAqIEByZXR1cm4ge0Jvb2xlYW59IC0gdHJ1ZSBpZiB0aGUgcG9seWdvbiBpcyBhIHNpbXBsZSBwb2x5Z29uIChpLmUuIG5vdCBhbiBhcnJheSBvZiBwb2x5Z29ucylcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFZlcnRleENvdW50KHBvbHlnb24pIHtcbiAgcmV0dXJuIGlzU2ltcGxlKHBvbHlnb24pID9cbiAgICBDb250YWluZXIuY291bnQocG9seWdvbikgOlxuICAgIHBvbHlnb24ucmVkdWNlKChjb3VudCwgc2ltcGxlUG9seWdvbikgPT4gY291bnQgKyBDb250YWluZXIuY291bnQoc2ltcGxlUG9seWdvbiksIDApO1xufVxuXG4vLyBSZXR1cm4gbnVtYmVyIG9mIHRyaWFuZ2xlcyBuZWVkZWQgdG8gdGVzc2VsYXRlIHRoZSBwb2x5Z29uXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHJpYW5nbGVDb3VudChwb2x5Z29uKSB7XG4gIGxldCB0cmlhbmdsZUNvdW50ID0gMDtcbiAgbGV0IGZpcnN0ID0gdHJ1ZTtcbiAgZm9yIChjb25zdCBzaW1wbGVQb2x5Z29uIG9mIG5vcm1hbGl6ZShwb2x5Z29uKSkge1xuICAgIGNvbnN0IHNpemUgPSBDb250YWluZXIuY291bnQoc2ltcGxlUG9seWdvbik7XG4gICAgaWYgKGZpcnN0KSB7XG4gICAgICB0cmlhbmdsZUNvdW50ICs9IHNpemUgPiAzID8gc2l6ZSAtIDMgOiAwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmlhbmdsZUNvdW50ICs9IHNpemUgKyAxO1xuICAgIH1cbiAgICBmaXJzdCA9IGZhbHNlO1xuICB9XG4gIHJldHVybiB0cmlhbmdsZUNvdW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9yRWFjaFZlcnRleChwb2x5Z29uLCB2aXNpdG9yKSB7XG4gIGlmIChpc1NpbXBsZShwb2x5Z29uKSkge1xuICAgIENvbnRhaW5lci5mb3JFYWNoKHBvbHlnb24sIHZpc2l0b3IpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCB2ZXJ0ZXhJbmRleCA9IDA7XG4gIENvbnRhaW5lci5mb3JFYWNoKHBvbHlnb24sIHNpbXBsZVBvbHlnb24gPT4ge1xuICAgIENvbnRhaW5lci5mb3JFYWNoKHNpbXBsZVBvbHlnb24sICh2LCBpLCBwKSA9PiB2aXNpdG9yKHYsIHZlcnRleEluZGV4LCBwb2x5Z29uKSk7XG4gICAgdmVydGV4SW5kZXgrKztcbiAgfSk7XG59XG4iXX0=