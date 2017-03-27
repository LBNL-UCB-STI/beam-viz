'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = alphaify;

var _d3Color = require('d3-color');

function alphaify(color, a) {
  var c = (0, _d3Color.rgb)(color);
  return 'rgba(' + [c.r, c.g, c.b] + ', ' + a + ')';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9hbHBoYWlmeS5qcyJdLCJuYW1lcyI6WyJhbHBoYWlmeSIsImNvbG9yIiwiYSIsImMiLCJyIiwiZyIsImIiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQUV3QkEsUTs7QUFGeEI7O0FBRWUsU0FBU0EsUUFBVCxDQUFrQkMsS0FBbEIsRUFBeUJDLENBQXpCLEVBQTRCO0FBQ3pDLE1BQU1DLElBQUksa0JBQUlGLEtBQUosQ0FBVjtBQUNBLG1CQUFlLENBQUNFLEVBQUVDLENBQUgsRUFBTUQsRUFBRUUsQ0FBUixFQUFXRixFQUFFRyxDQUFiLENBQWYsVUFBbUNKLENBQW5DO0FBQ0QiLCJmaWxlIjoiYWxwaGFpZnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3JnYn0gZnJvbSAnZDMtY29sb3InO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhbHBoYWlmeShjb2xvciwgYSkge1xuICBjb25zdCBjID0gcmdiKGNvbG9yKTtcbiAgcmV0dXJuIGByZ2JhKCR7W2MuciwgYy5nLCBjLmJdfSwgJHthfSlgO1xufVxuIl19