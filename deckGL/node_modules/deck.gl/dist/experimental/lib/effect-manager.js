"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable no-try-catch */

var EffectManager = function () {
  function EffectManager(_ref) {
    var gl = _ref.gl,
        layerManager = _ref.layerManager;

    _classCallCheck(this, EffectManager);

    this.gl = gl;
    this.layerManager = layerManager;
    this._effects = [];
  }

  /**
   * Adds an effect to be managed.  That effect's initialize function will
   * be called, and the effect's preDraw and draw callbacks will be
   * called at the appropriate times in the render loop
   * @param {Effect} effect - the effect to be added
   */


  _createClass(EffectManager, [{
    key: "addEffect",
    value: function addEffect(effect) {
      this._effects.push(effect);
      this._sortEffects();
      effect.initialize({ gl: this.gl, layerManager: this.layerManager });
    }

    /**
     * Removes an effect that is already being managed.  That effect's
     * finalize function will be called, and its callbacks will no longer
     * be envoked in the render loop
     * @param {Effect} effect - the effect to be removed
     * @return {bool} - True if the effect was already being managed, and
     * thus successfully removed; false otherwise
     */

  }, {
    key: "removeEffect",
    value: function removeEffect(effect) {
      var i = this._effects.indexOf(effect);
      if (i >= 0) {
        effect.finalize({ gl: this.gl, layerManager: this.layerManager });
        this._effects.splice(i, 1);
        return true;
      }
      return false;
    }

    /**
     * Envoke the preDraw callback of all managed events, in order of
     * decreasing priority
     */

  }, {
    key: "preDraw",
    value: function preDraw() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._effects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var effect = _step.value;

          if (effect.needsRedraw) {
            effect.preDraw({ gl: this.gl, layerManager: this.layerManager });
          }
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

    /**
     * Envoke the draw callback of all managed events, in order of
     * decreasing priority
     */

  }, {
    key: "draw",
    value: function draw() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this._effects[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var effect = _step2.value;

          if (effect.needsRedraw) {
            effect.draw({ gl: this.gl, layerManager: this.layerManager });
          }
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
    }
  }, {
    key: "_sortEffects",
    value: function _sortEffects() {
      this._effects.sort(function (a, b) {
        if (a.priority > b.priority) {
          return -1;
        } else if (a.priority < b.priority) {
          return 1;
        }
        return a.count - b.count;
      });
    }
  }]);

  return EffectManager;
}();

exports.default = EffectManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9leHBlcmltZW50YWwvbGliL2VmZmVjdC1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbIkVmZmVjdE1hbmFnZXIiLCJnbCIsImxheWVyTWFuYWdlciIsIl9lZmZlY3RzIiwiZWZmZWN0IiwicHVzaCIsIl9zb3J0RWZmZWN0cyIsImluaXRpYWxpemUiLCJpIiwiaW5kZXhPZiIsImZpbmFsaXplIiwic3BsaWNlIiwibmVlZHNSZWRyYXciLCJwcmVEcmF3IiwiZHJhdyIsInNvcnQiLCJhIiwiYiIsInByaW9yaXR5IiwiY291bnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7SUFFcUJBLGE7QUFDbkIsK0JBQWdDO0FBQUEsUUFBbkJDLEVBQW1CLFFBQW5CQSxFQUFtQjtBQUFBLFFBQWZDLFlBQWUsUUFBZkEsWUFBZTs7QUFBQTs7QUFDOUIsU0FBS0QsRUFBTCxHQUFVQSxFQUFWO0FBQ0EsU0FBS0MsWUFBTCxHQUFvQkEsWUFBcEI7QUFDQSxTQUFLQyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7OEJBTVVDLE0sRUFBUTtBQUNoQixXQUFLRCxRQUFMLENBQWNFLElBQWQsQ0FBbUJELE1BQW5CO0FBQ0EsV0FBS0UsWUFBTDtBQUNBRixhQUFPRyxVQUFQLENBQWtCLEVBQUNOLElBQUksS0FBS0EsRUFBVixFQUFjQyxjQUFjLEtBQUtBLFlBQWpDLEVBQWxCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7O2lDQVFhRSxNLEVBQVE7QUFDbkIsVUFBTUksSUFBSSxLQUFLTCxRQUFMLENBQWNNLE9BQWQsQ0FBc0JMLE1BQXRCLENBQVY7QUFDQSxVQUFJSSxLQUFLLENBQVQsRUFBWTtBQUNWSixlQUFPTSxRQUFQLENBQWdCLEVBQUNULElBQUksS0FBS0EsRUFBVixFQUFjQyxjQUFjLEtBQUtBLFlBQWpDLEVBQWhCO0FBQ0EsYUFBS0MsUUFBTCxDQUFjUSxNQUFkLENBQXFCSCxDQUFyQixFQUF3QixDQUF4QjtBQUNBLGVBQU8sSUFBUDtBQUNEO0FBQ0QsYUFBTyxLQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OEJBSVU7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDUiw2QkFBcUIsS0FBS0wsUUFBMUIsOEhBQW9DO0FBQUEsY0FBekJDLE1BQXlCOztBQUNsQyxjQUFJQSxPQUFPUSxXQUFYLEVBQXdCO0FBQ3RCUixtQkFBT1MsT0FBUCxDQUFlLEVBQUNaLElBQUksS0FBS0EsRUFBVixFQUFjQyxjQUFjLEtBQUtBLFlBQWpDLEVBQWY7QUFDRDtBQUNGO0FBTE87QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU1UOztBQUVEOzs7Ozs7OzJCQUlPO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ0wsOEJBQXFCLEtBQUtDLFFBQTFCLG1JQUFvQztBQUFBLGNBQXpCQyxNQUF5Qjs7QUFDbEMsY0FBSUEsT0FBT1EsV0FBWCxFQUF3QjtBQUN0QlIsbUJBQU9VLElBQVAsQ0FBWSxFQUFDYixJQUFJLEtBQUtBLEVBQVYsRUFBY0MsY0FBYyxLQUFLQSxZQUFqQyxFQUFaO0FBQ0Q7QUFDRjtBQUxJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNTjs7O21DQUVjO0FBQ2IsV0FBS0MsUUFBTCxDQUFjWSxJQUFkLENBQW1CLFVBQUNDLENBQUQsRUFBSUMsQ0FBSixFQUFVO0FBQzNCLFlBQUlELEVBQUVFLFFBQUYsR0FBYUQsRUFBRUMsUUFBbkIsRUFBNkI7QUFDM0IsaUJBQU8sQ0FBQyxDQUFSO0FBQ0QsU0FGRCxNQUVPLElBQUlGLEVBQUVFLFFBQUYsR0FBYUQsRUFBRUMsUUFBbkIsRUFBNkI7QUFDbEMsaUJBQU8sQ0FBUDtBQUNEO0FBQ0QsZUFBT0YsRUFBRUcsS0FBRixHQUFVRixFQUFFRSxLQUFuQjtBQUNELE9BUEQ7QUFRRDs7Ozs7O2tCQXRFa0JuQixhIiwiZmlsZSI6ImVmZmVjdC1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tdHJ5LWNhdGNoICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVmZmVjdE1hbmFnZXIge1xuICBjb25zdHJ1Y3Rvcih7Z2wsIGxheWVyTWFuYWdlcn0pIHtcbiAgICB0aGlzLmdsID0gZ2w7XG4gICAgdGhpcy5sYXllck1hbmFnZXIgPSBsYXllck1hbmFnZXI7XG4gICAgdGhpcy5fZWZmZWN0cyA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gZWZmZWN0IHRvIGJlIG1hbmFnZWQuICBUaGF0IGVmZmVjdCdzIGluaXRpYWxpemUgZnVuY3Rpb24gd2lsbFxuICAgKiBiZSBjYWxsZWQsIGFuZCB0aGUgZWZmZWN0J3MgcHJlRHJhdyBhbmQgZHJhdyBjYWxsYmFja3Mgd2lsbCBiZVxuICAgKiBjYWxsZWQgYXQgdGhlIGFwcHJvcHJpYXRlIHRpbWVzIGluIHRoZSByZW5kZXIgbG9vcFxuICAgKiBAcGFyYW0ge0VmZmVjdH0gZWZmZWN0IC0gdGhlIGVmZmVjdCB0byBiZSBhZGRlZFxuICAgKi9cbiAgYWRkRWZmZWN0KGVmZmVjdCkge1xuICAgIHRoaXMuX2VmZmVjdHMucHVzaChlZmZlY3QpO1xuICAgIHRoaXMuX3NvcnRFZmZlY3RzKCk7XG4gICAgZWZmZWN0LmluaXRpYWxpemUoe2dsOiB0aGlzLmdsLCBsYXllck1hbmFnZXI6IHRoaXMubGF5ZXJNYW5hZ2VyfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbiBlZmZlY3QgdGhhdCBpcyBhbHJlYWR5IGJlaW5nIG1hbmFnZWQuICBUaGF0IGVmZmVjdCdzXG4gICAqIGZpbmFsaXplIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkLCBhbmQgaXRzIGNhbGxiYWNrcyB3aWxsIG5vIGxvbmdlclxuICAgKiBiZSBlbnZva2VkIGluIHRoZSByZW5kZXIgbG9vcFxuICAgKiBAcGFyYW0ge0VmZmVjdH0gZWZmZWN0IC0gdGhlIGVmZmVjdCB0byBiZSByZW1vdmVkXG4gICAqIEByZXR1cm4ge2Jvb2x9IC0gVHJ1ZSBpZiB0aGUgZWZmZWN0IHdhcyBhbHJlYWR5IGJlaW5nIG1hbmFnZWQsIGFuZFxuICAgKiB0aHVzIHN1Y2Nlc3NmdWxseSByZW1vdmVkOyBmYWxzZSBvdGhlcndpc2VcbiAgICovXG4gIHJlbW92ZUVmZmVjdChlZmZlY3QpIHtcbiAgICBjb25zdCBpID0gdGhpcy5fZWZmZWN0cy5pbmRleE9mKGVmZmVjdCk7XG4gICAgaWYgKGkgPj0gMCkge1xuICAgICAgZWZmZWN0LmZpbmFsaXplKHtnbDogdGhpcy5nbCwgbGF5ZXJNYW5hZ2VyOiB0aGlzLmxheWVyTWFuYWdlcn0pO1xuICAgICAgdGhpcy5fZWZmZWN0cy5zcGxpY2UoaSwgMSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEVudm9rZSB0aGUgcHJlRHJhdyBjYWxsYmFjayBvZiBhbGwgbWFuYWdlZCBldmVudHMsIGluIG9yZGVyIG9mXG4gICAqIGRlY3JlYXNpbmcgcHJpb3JpdHlcbiAgICovXG4gIHByZURyYXcoKSB7XG4gICAgZm9yIChjb25zdCBlZmZlY3Qgb2YgdGhpcy5fZWZmZWN0cykge1xuICAgICAgaWYgKGVmZmVjdC5uZWVkc1JlZHJhdykge1xuICAgICAgICBlZmZlY3QucHJlRHJhdyh7Z2w6IHRoaXMuZ2wsIGxheWVyTWFuYWdlcjogdGhpcy5sYXllck1hbmFnZXJ9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRW52b2tlIHRoZSBkcmF3IGNhbGxiYWNrIG9mIGFsbCBtYW5hZ2VkIGV2ZW50cywgaW4gb3JkZXIgb2ZcbiAgICogZGVjcmVhc2luZyBwcmlvcml0eVxuICAgKi9cbiAgZHJhdygpIHtcbiAgICBmb3IgKGNvbnN0IGVmZmVjdCBvZiB0aGlzLl9lZmZlY3RzKSB7XG4gICAgICBpZiAoZWZmZWN0Lm5lZWRzUmVkcmF3KSB7XG4gICAgICAgIGVmZmVjdC5kcmF3KHtnbDogdGhpcy5nbCwgbGF5ZXJNYW5hZ2VyOiB0aGlzLmxheWVyTWFuYWdlcn0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9zb3J0RWZmZWN0cygpIHtcbiAgICB0aGlzLl9lZmZlY3RzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGlmIChhLnByaW9yaXR5ID4gYi5wcmlvcml0eSkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9IGVsc2UgaWYgKGEucHJpb3JpdHkgPCBiLnByaW9yaXR5KSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGEuY291bnQgLSBiLmNvdW50O1xuICAgIH0pO1xuICB9XG59XG4iXX0=