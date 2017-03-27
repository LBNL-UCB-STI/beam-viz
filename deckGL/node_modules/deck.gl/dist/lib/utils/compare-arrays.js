"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compareArrays = compareArrays;
exports.checkArray = checkArray;
function compareArrays(array1, array2) {

  var length = Math.min(array1.length, array2.length);
  for (var i = 0; i < length; ++i) {
    if (array1[i] !== array2[i]) {
      return "Arrays are different in element " + i + ": " + array1[i] + " vs " + array2[i];
    }
  }

  if (array1.length !== array2.length) {
    return "Arrays have different length " + array1.length + " vs " + array2.length;
  }

  return null;
}

function checkArray(array) {
  for (var i = 0; i < array.length; ++i) {
    if (!Number.isFinite(array[i])) {
      throw new Error("Array has invalid element " + i + ": " + array[i]);
    }
  }
  return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdXRpbHMvY29tcGFyZS1hcnJheXMuanMiXSwibmFtZXMiOlsiY29tcGFyZUFycmF5cyIsImNoZWNrQXJyYXkiLCJhcnJheTEiLCJhcnJheTIiLCJsZW5ndGgiLCJNYXRoIiwibWluIiwiaSIsImFycmF5IiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJFcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFBZ0JBLGEsR0FBQUEsYTtRQWdCQUMsVSxHQUFBQSxVO0FBaEJULFNBQVNELGFBQVQsQ0FBdUJFLE1BQXZCLEVBQStCQyxNQUEvQixFQUF1Qzs7QUFFNUMsTUFBTUMsU0FBU0MsS0FBS0MsR0FBTCxDQUFTSixPQUFPRSxNQUFoQixFQUF3QkQsT0FBT0MsTUFBL0IsQ0FBZjtBQUNBLE9BQUssSUFBSUcsSUFBSSxDQUFiLEVBQWdCQSxJQUFJSCxNQUFwQixFQUE0QixFQUFFRyxDQUE5QixFQUFpQztBQUMvQixRQUFJTCxPQUFPSyxDQUFQLE1BQWNKLE9BQU9JLENBQVAsQ0FBbEIsRUFBNkI7QUFDM0Isa0RBQTBDQSxDQUExQyxVQUFnREwsT0FBT0ssQ0FBUCxDQUFoRCxZQUFnRUosT0FBT0ksQ0FBUCxDQUFoRTtBQUNEO0FBQ0Y7O0FBRUQsTUFBSUwsT0FBT0UsTUFBUCxLQUFrQkQsT0FBT0MsTUFBN0IsRUFBcUM7QUFDbkMsNkNBQXVDRixPQUFPRSxNQUE5QyxZQUEyREQsT0FBT0MsTUFBbEU7QUFDRDs7QUFFRCxTQUFPLElBQVA7QUFDRDs7QUFFTSxTQUFTSCxVQUFULENBQW9CTyxLQUFwQixFQUEyQjtBQUNoQyxPQUFLLElBQUlELElBQUksQ0FBYixFQUFnQkEsSUFBSUMsTUFBTUosTUFBMUIsRUFBa0MsRUFBRUcsQ0FBcEMsRUFBdUM7QUFDckMsUUFBSSxDQUFDRSxPQUFPQyxRQUFQLENBQWdCRixNQUFNRCxDQUFOLENBQWhCLENBQUwsRUFBZ0M7QUFDOUIsWUFBTSxJQUFJSSxLQUFKLGdDQUF1Q0osQ0FBdkMsVUFBNkNDLE1BQU1ELENBQU4sQ0FBN0MsQ0FBTjtBQUNEO0FBQ0Y7QUFDRCxTQUFPLElBQVA7QUFDRCIsImZpbGUiOiJjb21wYXJlLWFycmF5cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBjb21wYXJlQXJyYXlzKGFycmF5MSwgYXJyYXkyKSB7XG5cbiAgY29uc3QgbGVuZ3RoID0gTWF0aC5taW4oYXJyYXkxLmxlbmd0aCwgYXJyYXkyLmxlbmd0aCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoYXJyYXkxW2ldICE9PSBhcnJheTJbaV0pIHtcbiAgICAgIHJldHVybiBgQXJyYXlzIGFyZSBkaWZmZXJlbnQgaW4gZWxlbWVudCAke2l9OiAke2FycmF5MVtpXX0gdnMgJHthcnJheTJbaV19YDtcbiAgICB9XG4gIH1cblxuICBpZiAoYXJyYXkxLmxlbmd0aCAhPT0gYXJyYXkyLmxlbmd0aCkge1xuICAgIHJldHVybiBgQXJyYXlzIGhhdmUgZGlmZmVyZW50IGxlbmd0aCAke2FycmF5MS5sZW5ndGh9IHZzICR7YXJyYXkyLmxlbmd0aH1gO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja0FycmF5KGFycmF5KSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShhcnJheVtpXSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXJyYXkgaGFzIGludmFsaWQgZWxlbWVudCAke2l9OiAke2FycmF5W2ldfWApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cbiJdfQ==