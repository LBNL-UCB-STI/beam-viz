"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flatten = flatten;
exports.countVertices = countVertices;
exports.flattenVertices = flattenVertices;
exports.fillArray = fillArray;
/**
 * Flattens a nested array into a single level array
 * @example flatten([[1, [2]], [3], 4]) => [1, 2, 3, 4]
 * @param {Array} array The array to flatten.
 * @return {Array} Returns the new flattened array.
 */
function flatten(array) {
  var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var index = -1;
  while (++index < array.length) {
    var value = array[index];
    if (Array.isArray(value)) {
      flatten(value, result);
    } else {
      result.push(value);
    }
  }
  return result;
}

function countVertices(nestedArray) {
  var count = 0;
  var index = -1;
  while (++index < nestedArray.length) {
    var value = nestedArray[index];
    if (Array.isArray(value) || ArrayBuffer.isView(value)) {
      count += countVertices(value);
    } else {
      count++;
    }
  }
  return count;
}

// Flattens nested array of vertices, padding third coordinate as needed
function flattenVertices(nestedArray) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$result = _ref.result,
      result = _ref$result === undefined ? [] : _ref$result,
      _ref$dimensions = _ref.dimensions,
      dimensions = _ref$dimensions === undefined ? 3 : _ref$dimensions;

  var index = -1;
  var vertexLength = 0;
  while (++index < nestedArray.length) {
    var value = nestedArray[index];
    if (Array.isArray(value) || ArrayBuffer.isView(value)) {
      flattenVertices(value, { result: result, dimensions: dimensions });
    } else {
      if (vertexLength < dimensions) {
        // eslint-disable-line
        result.push(value);
        vertexLength++;
      }
    }
  }
  // Add a third coordinate if needed
  if (vertexLength > 0 && vertexLength < dimensions) {
    result.push(0);
  }
  return result;
}

// Uses copyWithin to significantly speed up typed array value filling
function fillArray(_ref2) {
  var target = _ref2.target,
      source = _ref2.source,
      _ref2$start = _ref2.start,
      start = _ref2$start === undefined ? 0 : _ref2$start,
      _ref2$count = _ref2.count,
      count = _ref2$count === undefined ? 1 : _ref2$count;

  var total = count * source.length;
  var copied = 0;
  for (var i = 0; i < source.length; ++i) {
    target[start + copied++] = source[i];
  }

  while (copied < total) {
    // If we have copied less than half, copy everything we got
    // else copy remaining in one operation
    if (copied < total - copied) {
      target.copyWithin(start + copied, start, start + copied);
      copied *= 2;
    } else {
      target.copyWithin(start + copied, start, start + total - copied);
      copied = total;
    }
  }

  return target;
}

// Flattens nested array of vertices, padding third coordinate as needed
/*
export function flattenTypedVertices(nestedArray, {
  result = [],
  Type = Float32Array,
  start = 0,
  dimensions = 3
} = {}) {
  let index = -1;
  let vertexLength = 0;
  while (++index < nestedArray.length) {
    const value = nestedArray[index];
    if (Array.isArray(value) || ArrayBuffer.isView(value)) {
      start = flattenTypedVertices(value, {result, start, dimensions});
    } else {
      if (vertexLength < dimensions) { // eslint-disable-line
        result[start++] = value;
        vertexLength++;
      }
    }
  }
  // Add a third coordinate if needed
  if (vertexLength > 0 && vertexLength < dimensions) {
    result[start++] = 0;
  }
  return start;
}
*/
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdXRpbHMvZmxhdHRlbi5qcyJdLCJuYW1lcyI6WyJmbGF0dGVuIiwiY291bnRWZXJ0aWNlcyIsImZsYXR0ZW5WZXJ0aWNlcyIsImZpbGxBcnJheSIsImFycmF5IiwicmVzdWx0IiwiaW5kZXgiLCJsZW5ndGgiLCJ2YWx1ZSIsIkFycmF5IiwiaXNBcnJheSIsInB1c2giLCJuZXN0ZWRBcnJheSIsImNvdW50IiwiQXJyYXlCdWZmZXIiLCJpc1ZpZXciLCJkaW1lbnNpb25zIiwidmVydGV4TGVuZ3RoIiwidGFyZ2V0Iiwic291cmNlIiwic3RhcnQiLCJ0b3RhbCIsImNvcGllZCIsImkiLCJjb3B5V2l0aGluIl0sIm1hcHBpbmdzIjoiOzs7OztRQU1nQkEsTyxHQUFBQSxPO1FBYUFDLGEsR0FBQUEsYTtRQWVBQyxlLEdBQUFBLGU7UUFzQkFDLFMsR0FBQUEsUztBQXhEaEI7Ozs7OztBQU1PLFNBQVNILE9BQVQsQ0FBaUJJLEtBQWpCLEVBQXFDO0FBQUEsTUFBYkMsTUFBYSx1RUFBSixFQUFJOztBQUMxQyxNQUFJQyxRQUFRLENBQUMsQ0FBYjtBQUNBLFNBQU8sRUFBRUEsS0FBRixHQUFVRixNQUFNRyxNQUF2QixFQUErQjtBQUM3QixRQUFNQyxRQUFRSixNQUFNRSxLQUFOLENBQWQ7QUFDQSxRQUFJRyxNQUFNQyxPQUFOLENBQWNGLEtBQWQsQ0FBSixFQUEwQjtBQUN4QlIsY0FBUVEsS0FBUixFQUFlSCxNQUFmO0FBQ0QsS0FGRCxNQUVPO0FBQ0xBLGFBQU9NLElBQVAsQ0FBWUgsS0FBWjtBQUNEO0FBQ0Y7QUFDRCxTQUFPSCxNQUFQO0FBQ0Q7O0FBRU0sU0FBU0osYUFBVCxDQUF1QlcsV0FBdkIsRUFBb0M7QUFDekMsTUFBSUMsUUFBUSxDQUFaO0FBQ0EsTUFBSVAsUUFBUSxDQUFDLENBQWI7QUFDQSxTQUFPLEVBQUVBLEtBQUYsR0FBVU0sWUFBWUwsTUFBN0IsRUFBcUM7QUFDbkMsUUFBTUMsUUFBUUksWUFBWU4sS0FBWixDQUFkO0FBQ0EsUUFBSUcsTUFBTUMsT0FBTixDQUFjRixLQUFkLEtBQXdCTSxZQUFZQyxNQUFaLENBQW1CUCxLQUFuQixDQUE1QixFQUF1RDtBQUNyREssZUFBU1osY0FBY08sS0FBZCxDQUFUO0FBQ0QsS0FGRCxNQUVPO0FBQ0xLO0FBQ0Q7QUFDRjtBQUNELFNBQU9BLEtBQVA7QUFDRDs7QUFFRDtBQUNPLFNBQVNYLGVBQVQsQ0FBeUJVLFdBQXpCLEVBQTBFO0FBQUEsaUZBQUosRUFBSTtBQUFBLHlCQUFuQ1AsTUFBbUM7QUFBQSxNQUFuQ0EsTUFBbUMsK0JBQTFCLEVBQTBCO0FBQUEsNkJBQXRCVyxVQUFzQjtBQUFBLE1BQXRCQSxVQUFzQixtQ0FBVCxDQUFTOztBQUMvRSxNQUFJVixRQUFRLENBQUMsQ0FBYjtBQUNBLE1BQUlXLGVBQWUsQ0FBbkI7QUFDQSxTQUFPLEVBQUVYLEtBQUYsR0FBVU0sWUFBWUwsTUFBN0IsRUFBcUM7QUFDbkMsUUFBTUMsUUFBUUksWUFBWU4sS0FBWixDQUFkO0FBQ0EsUUFBSUcsTUFBTUMsT0FBTixDQUFjRixLQUFkLEtBQXdCTSxZQUFZQyxNQUFaLENBQW1CUCxLQUFuQixDQUE1QixFQUF1RDtBQUNyRE4sc0JBQWdCTSxLQUFoQixFQUF1QixFQUFDSCxjQUFELEVBQVNXLHNCQUFULEVBQXZCO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsVUFBSUMsZUFBZUQsVUFBbkIsRUFBK0I7QUFBRTtBQUMvQlgsZUFBT00sSUFBUCxDQUFZSCxLQUFaO0FBQ0FTO0FBQ0Q7QUFDRjtBQUNGO0FBQ0Q7QUFDQSxNQUFJQSxlQUFlLENBQWYsSUFBb0JBLGVBQWVELFVBQXZDLEVBQW1EO0FBQ2pEWCxXQUFPTSxJQUFQLENBQVksQ0FBWjtBQUNEO0FBQ0QsU0FBT04sTUFBUDtBQUNEOztBQUVEO0FBQ08sU0FBU0YsU0FBVCxRQUEyRDtBQUFBLE1BQXZDZSxNQUF1QyxTQUF2Q0EsTUFBdUM7QUFBQSxNQUEvQkMsTUFBK0IsU0FBL0JBLE1BQStCO0FBQUEsMEJBQXZCQyxLQUF1QjtBQUFBLE1BQXZCQSxLQUF1QiwrQkFBZixDQUFlO0FBQUEsMEJBQVpQLEtBQVk7QUFBQSxNQUFaQSxLQUFZLCtCQUFKLENBQUk7O0FBQ2hFLE1BQU1RLFFBQVFSLFFBQVFNLE9BQU9aLE1BQTdCO0FBQ0EsTUFBSWUsU0FBUyxDQUFiO0FBQ0EsT0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlKLE9BQU9aLE1BQTNCLEVBQW1DLEVBQUVnQixDQUFyQyxFQUF3QztBQUN0Q0wsV0FBT0UsUUFBUUUsUUFBZixJQUEyQkgsT0FBT0ksQ0FBUCxDQUEzQjtBQUNEOztBQUVELFNBQU9ELFNBQVNELEtBQWhCLEVBQXVCO0FBQ3JCO0FBQ0E7QUFDQSxRQUFJQyxTQUFTRCxRQUFRQyxNQUFyQixFQUE2QjtBQUMzQkosYUFBT00sVUFBUCxDQUFrQkosUUFBUUUsTUFBMUIsRUFBa0NGLEtBQWxDLEVBQXlDQSxRQUFRRSxNQUFqRDtBQUNBQSxnQkFBVSxDQUFWO0FBQ0QsS0FIRCxNQUdPO0FBQ0xKLGFBQU9NLFVBQVAsQ0FBa0JKLFFBQVFFLE1BQTFCLEVBQWtDRixLQUFsQyxFQUF5Q0EsUUFBUUMsS0FBUixHQUFnQkMsTUFBekQ7QUFDQUEsZUFBU0QsS0FBVDtBQUNEO0FBQ0Y7O0FBRUQsU0FBT0gsTUFBUDtBQUNEOztBQUVEO0FBQ0EiLCJmaWxlIjoiZmxhdHRlbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRmxhdHRlbnMgYSBuZXN0ZWQgYXJyYXkgaW50byBhIHNpbmdsZSBsZXZlbCBhcnJheVxuICogQGV4YW1wbGUgZmxhdHRlbihbWzEsIFsyXV0sIFszXSwgNF0pID0+IFsxLCAyLCAzLCA0XVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGZsYXR0ZW4uXG4gKiBAcmV0dXJuIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZsYXR0ZW5lZCBhcnJheS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZsYXR0ZW4oYXJyYXksIHJlc3VsdCA9IFtdKSB7XG4gIGxldCBpbmRleCA9IC0xO1xuICB3aGlsZSAoKytpbmRleCA8IGFycmF5Lmxlbmd0aCkge1xuICAgIGNvbnN0IHZhbHVlID0gYXJyYXlbaW5kZXhdO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgZmxhdHRlbih2YWx1ZSwgcmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY291bnRWZXJ0aWNlcyhuZXN0ZWRBcnJheSkge1xuICBsZXQgY291bnQgPSAwO1xuICBsZXQgaW5kZXggPSAtMTtcbiAgd2hpbGUgKCsraW5kZXggPCBuZXN0ZWRBcnJheS5sZW5ndGgpIHtcbiAgICBjb25zdCB2YWx1ZSA9IG5lc3RlZEFycmF5W2luZGV4XTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgQXJyYXlCdWZmZXIuaXNWaWV3KHZhbHVlKSkge1xuICAgICAgY291bnQgKz0gY291bnRWZXJ0aWNlcyh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvdW50Kys7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb3VudDtcbn1cblxuLy8gRmxhdHRlbnMgbmVzdGVkIGFycmF5IG9mIHZlcnRpY2VzLCBwYWRkaW5nIHRoaXJkIGNvb3JkaW5hdGUgYXMgbmVlZGVkXG5leHBvcnQgZnVuY3Rpb24gZmxhdHRlblZlcnRpY2VzKG5lc3RlZEFycmF5LCB7cmVzdWx0ID0gW10sIGRpbWVuc2lvbnMgPSAzfSA9IHt9KSB7XG4gIGxldCBpbmRleCA9IC0xO1xuICBsZXQgdmVydGV4TGVuZ3RoID0gMDtcbiAgd2hpbGUgKCsraW5kZXggPCBuZXN0ZWRBcnJheS5sZW5ndGgpIHtcbiAgICBjb25zdCB2YWx1ZSA9IG5lc3RlZEFycmF5W2luZGV4XTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgQXJyYXlCdWZmZXIuaXNWaWV3KHZhbHVlKSkge1xuICAgICAgZmxhdHRlblZlcnRpY2VzKHZhbHVlLCB7cmVzdWx0LCBkaW1lbnNpb25zfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh2ZXJ0ZXhMZW5ndGggPCBkaW1lbnNpb25zKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICB2ZXJ0ZXhMZW5ndGgrKztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gQWRkIGEgdGhpcmQgY29vcmRpbmF0ZSBpZiBuZWVkZWRcbiAgaWYgKHZlcnRleExlbmd0aCA+IDAgJiYgdmVydGV4TGVuZ3RoIDwgZGltZW5zaW9ucykge1xuICAgIHJlc3VsdC5wdXNoKDApO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIFVzZXMgY29weVdpdGhpbiB0byBzaWduaWZpY2FudGx5IHNwZWVkIHVwIHR5cGVkIGFycmF5IHZhbHVlIGZpbGxpbmdcbmV4cG9ydCBmdW5jdGlvbiBmaWxsQXJyYXkoe3RhcmdldCwgc291cmNlLCBzdGFydCA9IDAsIGNvdW50ID0gMX0pIHtcbiAgY29uc3QgdG90YWwgPSBjb3VudCAqIHNvdXJjZS5sZW5ndGg7XG4gIGxldCBjb3BpZWQgPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNvdXJjZS5sZW5ndGg7ICsraSkge1xuICAgIHRhcmdldFtzdGFydCArIGNvcGllZCsrXSA9IHNvdXJjZVtpXTtcbiAgfVxuXG4gIHdoaWxlIChjb3BpZWQgPCB0b3RhbCkge1xuICAgIC8vIElmIHdlIGhhdmUgY29waWVkIGxlc3MgdGhhbiBoYWxmLCBjb3B5IGV2ZXJ5dGhpbmcgd2UgZ290XG4gICAgLy8gZWxzZSBjb3B5IHJlbWFpbmluZyBpbiBvbmUgb3BlcmF0aW9uXG4gICAgaWYgKGNvcGllZCA8IHRvdGFsIC0gY29waWVkKSB7XG4gICAgICB0YXJnZXQuY29weVdpdGhpbihzdGFydCArIGNvcGllZCwgc3RhcnQsIHN0YXJ0ICsgY29waWVkKTtcbiAgICAgIGNvcGllZCAqPSAyO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQuY29weVdpdGhpbihzdGFydCArIGNvcGllZCwgc3RhcnQsIHN0YXJ0ICsgdG90YWwgLSBjb3BpZWQpO1xuICAgICAgY29waWVkID0gdG90YWw7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuLy8gRmxhdHRlbnMgbmVzdGVkIGFycmF5IG9mIHZlcnRpY2VzLCBwYWRkaW5nIHRoaXJkIGNvb3JkaW5hdGUgYXMgbmVlZGVkXG4vKlxuZXhwb3J0IGZ1bmN0aW9uIGZsYXR0ZW5UeXBlZFZlcnRpY2VzKG5lc3RlZEFycmF5LCB7XG4gIHJlc3VsdCA9IFtdLFxuICBUeXBlID0gRmxvYXQzMkFycmF5LFxuICBzdGFydCA9IDAsXG4gIGRpbWVuc2lvbnMgPSAzXG59ID0ge30pIHtcbiAgbGV0IGluZGV4ID0gLTE7XG4gIGxldCB2ZXJ0ZXhMZW5ndGggPSAwO1xuICB3aGlsZSAoKytpbmRleCA8IG5lc3RlZEFycmF5Lmxlbmd0aCkge1xuICAgIGNvbnN0IHZhbHVlID0gbmVzdGVkQXJyYXlbaW5kZXhdO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSB8fCBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsdWUpKSB7XG4gICAgICBzdGFydCA9IGZsYXR0ZW5UeXBlZFZlcnRpY2VzKHZhbHVlLCB7cmVzdWx0LCBzdGFydCwgZGltZW5zaW9uc30pO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodmVydGV4TGVuZ3RoIDwgZGltZW5zaW9ucykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICAgIHJlc3VsdFtzdGFydCsrXSA9IHZhbHVlO1xuICAgICAgICB2ZXJ0ZXhMZW5ndGgrKztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gQWRkIGEgdGhpcmQgY29vcmRpbmF0ZSBpZiBuZWVkZWRcbiAgaWYgKHZlcnRleExlbmd0aCA+IDAgJiYgdmVydGV4TGVuZ3RoIDwgZGltZW5zaW9ucykge1xuICAgIHJlc3VsdFtzdGFydCsrXSA9IDA7XG4gIH1cbiAgcmV0dXJuIHN0YXJ0O1xufVxuKi9cbiJdfQ==