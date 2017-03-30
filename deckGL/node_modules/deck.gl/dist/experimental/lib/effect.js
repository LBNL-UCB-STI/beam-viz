"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var counter = 0;

var Effect = function () {
  function Effect() {
    _classCallCheck(this, Effect);

    this.count = counter++;
    this.visible = true;
    this.priority = 0;
    this.needsRedraw = false;
  }

  /**
   * subclasses should override to set up any resources needed
   */


  _createClass(Effect, [{
    key: "initialize",
    value: function initialize(_ref) {
      var gl = _ref.gl,
          layerManager = _ref.layerManager;
    }
    /**
     * and subclasses should free those resources here
     */

  }, {
    key: "finalize",
    value: function finalize(_ref2) {
      var gl = _ref2.gl,
          layerManager = _ref2.layerManager;
    }
    /**
     * override for a callback immediately before drawing each frame
     */

  }, {
    key: "preDraw",
    value: function preDraw(_ref3) {
      var gl = _ref3.gl,
          layerManager = _ref3.layerManager;
    }
    /**
     * override for a callback immediately after drawing a frame's layers
     */

  }, {
    key: "draw",
    value: function draw(_ref4) {
      var gl = _ref4.gl,
          layerManager = _ref4.layerManager;
    }
  }, {
    key: "setNeedsRedraw",
    value: function setNeedsRedraw() {
      var redraw = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      this.needsRedraw = redraw;
    }
  }]);

  return Effect;
}();

exports.default = Effect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9leHBlcmltZW50YWwvbGliL2VmZmVjdC5qcyJdLCJuYW1lcyI6WyJjb3VudGVyIiwiRWZmZWN0IiwiY291bnQiLCJ2aXNpYmxlIiwicHJpb3JpdHkiLCJuZWVkc1JlZHJhdyIsImdsIiwibGF5ZXJNYW5hZ2VyIiwicmVkcmF3Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBSUEsVUFBVSxDQUFkOztJQUVxQkMsTTtBQUVuQixvQkFBYztBQUFBOztBQUNaLFNBQUtDLEtBQUwsR0FBYUYsU0FBYjtBQUNBLFNBQUtHLE9BQUwsR0FBZSxJQUFmO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQixDQUFoQjtBQUNBLFNBQUtDLFdBQUwsR0FBbUIsS0FBbkI7QUFDRDs7QUFFRDs7Ozs7OztxQ0FHK0I7QUFBQSxVQUFuQkMsRUFBbUIsUUFBbkJBLEVBQW1CO0FBQUEsVUFBZkMsWUFBZSxRQUFmQSxZQUFlO0FBQzlCO0FBQ0Q7Ozs7OztvQ0FHNkI7QUFBQSxVQUFuQkQsRUFBbUIsU0FBbkJBLEVBQW1CO0FBQUEsVUFBZkMsWUFBZSxTQUFmQSxZQUFlO0FBQzVCO0FBQ0Q7Ozs7OzttQ0FHNEI7QUFBQSxVQUFuQkQsRUFBbUIsU0FBbkJBLEVBQW1CO0FBQUEsVUFBZkMsWUFBZSxTQUFmQSxZQUFlO0FBQzNCO0FBQ0Q7Ozs7OztnQ0FHeUI7QUFBQSxVQUFuQkQsRUFBbUIsU0FBbkJBLEVBQW1CO0FBQUEsVUFBZkMsWUFBZSxTQUFmQSxZQUFlO0FBQ3hCOzs7cUNBRTZCO0FBQUEsVUFBZkMsTUFBZSx1RUFBTixJQUFNOztBQUM1QixXQUFLSCxXQUFMLEdBQW1CRyxNQUFuQjtBQUNEOzs7Ozs7a0JBaENrQlAsTSIsImZpbGUiOiJlZmZlY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgY291bnRlciA9IDA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVmZmVjdCB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb3VudCA9IGNvdW50ZXIrKztcbiAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xuICAgIHRoaXMucHJpb3JpdHkgPSAwO1xuICAgIHRoaXMubmVlZHNSZWRyYXcgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBzdWJjbGFzc2VzIHNob3VsZCBvdmVycmlkZSB0byBzZXQgdXAgYW55IHJlc291cmNlcyBuZWVkZWRcbiAgICovXG4gIGluaXRpYWxpemUoe2dsLCBsYXllck1hbmFnZXJ9KSB7XG4gIH1cbiAgLyoqXG4gICAqIGFuZCBzdWJjbGFzc2VzIHNob3VsZCBmcmVlIHRob3NlIHJlc291cmNlcyBoZXJlXG4gICAqL1xuICBmaW5hbGl6ZSh7Z2wsIGxheWVyTWFuYWdlcn0pIHtcbiAgfVxuICAvKipcbiAgICogb3ZlcnJpZGUgZm9yIGEgY2FsbGJhY2sgaW1tZWRpYXRlbHkgYmVmb3JlIGRyYXdpbmcgZWFjaCBmcmFtZVxuICAgKi9cbiAgcHJlRHJhdyh7Z2wsIGxheWVyTWFuYWdlcn0pIHtcbiAgfVxuICAvKipcbiAgICogb3ZlcnJpZGUgZm9yIGEgY2FsbGJhY2sgaW1tZWRpYXRlbHkgYWZ0ZXIgZHJhd2luZyBhIGZyYW1lJ3MgbGF5ZXJzXG4gICAqL1xuICBkcmF3KHtnbCwgbGF5ZXJNYW5hZ2VyfSkge1xuICB9XG5cbiAgc2V0TmVlZHNSZWRyYXcocmVkcmF3ID0gdHJ1ZSkge1xuICAgIHRoaXMubmVlZHNSZWRyYXcgPSByZWRyYXc7XG4gIH1cbn1cbiJdfQ==