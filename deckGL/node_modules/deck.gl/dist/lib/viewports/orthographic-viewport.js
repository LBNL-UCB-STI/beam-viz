'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _viewport = require('./viewport');

var _viewport2 = _interopRequireDefault(_viewport);

var _glMatrix = require('gl-matrix');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OrthographicViewport = function (_Viewport) {
  _inherits(OrthographicViewport, _Viewport);

  function OrthographicViewport(_ref) {
    var width = _ref.width,
        height = _ref.height,
        eye = _ref.eye,
        _ref$lookAt = _ref.lookAt,
        lookAt = _ref$lookAt === undefined ? [0, 0, 0] : _ref$lookAt,
        _ref$up = _ref.up,
        up = _ref$up === undefined ? [0, 1, 0] : _ref$up,
        _ref$near = _ref.near,
        near = _ref$near === undefined ? 1 : _ref$near,
        _ref$far = _ref.far,
        far = _ref$far === undefined ? 100 : _ref$far,
        _ref$fovy = _ref.fovy,
        fovy = _ref$fovy === undefined ? 75 : _ref$fovy,
        left = _ref.left,
        top = _ref.top,
        _ref$right = _ref.right,
        right = _ref$right === undefined ? null : _ref$right,
        _ref$bottom = _ref.bottom,
        bottom = _ref$bottom === undefined ? null : _ref$bottom;

    _classCallCheck(this, OrthographicViewport);

    right = Number.isFinite(right) ? right : left + width;
    bottom = Number.isFinite(bottom) ? right : top + height;
    return _possibleConstructorReturn(this, (OrthographicViewport.__proto__ || Object.getPrototypeOf(OrthographicViewport)).call(this, {
      viewMatrix: _glMatrix.mat4.lookAt([], eye, lookAt, up),
      projectionMatrix: _glMatrix.mat4.ortho([], left, right, bottom, top, near, far),
      width: width,
      height: height
    }));
  }

  return OrthographicViewport;
}(_viewport2.default);

exports.default = OrthographicViewport;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdmlld3BvcnRzL29ydGhvZ3JhcGhpYy12aWV3cG9ydC5qcyJdLCJuYW1lcyI6WyJPcnRob2dyYXBoaWNWaWV3cG9ydCIsIndpZHRoIiwiaGVpZ2h0IiwiZXllIiwibG9va0F0IiwidXAiLCJuZWFyIiwiZmFyIiwiZm92eSIsImxlZnQiLCJ0b3AiLCJyaWdodCIsImJvdHRvbSIsIk51bWJlciIsImlzRmluaXRlIiwidmlld01hdHJpeCIsInByb2plY3Rpb25NYXRyaXgiLCJvcnRobyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7OztJQUVxQkEsb0I7OztBQUNuQixzQ0FpQkc7QUFBQSxRQWZEQyxLQWVDLFFBZkRBLEtBZUM7QUFBQSxRQWREQyxNQWNDLFFBZERBLE1BY0M7QUFBQSxRQVpEQyxHQVlDLFFBWkRBLEdBWUM7QUFBQSwyQkFYREMsTUFXQztBQUFBLFFBWERBLE1BV0MsK0JBWFEsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsQ0FXUjtBQUFBLHVCQVZEQyxFQVVDO0FBQUEsUUFWREEsRUFVQywyQkFWSSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxDQVVKO0FBQUEseUJBUkRDLElBUUM7QUFBQSxRQVJEQSxJQVFDLDZCQVJNLENBUU47QUFBQSx3QkFQREMsR0FPQztBQUFBLFFBUERBLEdBT0MsNEJBUEssR0FPTDtBQUFBLHlCQU5EQyxJQU1DO0FBQUEsUUFOREEsSUFNQyw2QkFOTSxFQU1OO0FBQUEsUUFMREMsSUFLQyxRQUxEQSxJQUtDO0FBQUEsUUFKREMsR0FJQyxRQUpEQSxHQUlDO0FBQUEsMEJBRkRDLEtBRUM7QUFBQSxRQUZEQSxLQUVDLDhCQUZPLElBRVA7QUFBQSwyQkFEREMsTUFDQztBQUFBLFFBRERBLE1BQ0MsK0JBRFEsSUFDUjs7QUFBQTs7QUFDREQsWUFBUUUsT0FBT0MsUUFBUCxDQUFnQkgsS0FBaEIsSUFBeUJBLEtBQXpCLEdBQWlDRixPQUFPUixLQUFoRDtBQUNBVyxhQUFTQyxPQUFPQyxRQUFQLENBQWdCRixNQUFoQixJQUEwQkQsS0FBMUIsR0FBa0NELE1BQU1SLE1BQWpEO0FBRkMsdUlBR0s7QUFDSmEsa0JBQVksZUFBS1gsTUFBTCxDQUFZLEVBQVosRUFBZ0JELEdBQWhCLEVBQXFCQyxNQUFyQixFQUE2QkMsRUFBN0IsQ0FEUjtBQUVKVyx3QkFBa0IsZUFBS0MsS0FBTCxDQUFXLEVBQVgsRUFBZVIsSUFBZixFQUFxQkUsS0FBckIsRUFBNEJDLE1BQTVCLEVBQW9DRixHQUFwQyxFQUF5Q0osSUFBekMsRUFBK0NDLEdBQS9DLENBRmQ7QUFHSk4sa0JBSEk7QUFJSkM7QUFKSSxLQUhMO0FBU0Y7Ozs7O2tCQTNCa0JGLG9CIiwiZmlsZSI6Im9ydGhvZ3JhcGhpYy12aWV3cG9ydC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3cG9ydCBmcm9tICcuL3ZpZXdwb3J0JztcbmltcG9ydCB7bWF0NH0gZnJvbSAnZ2wtbWF0cml4JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3J0aG9ncmFwaGljVmlld3BvcnQgZXh0ZW5kcyBWaWV3cG9ydCB7XG4gIGNvbnN0cnVjdG9yKHtcbiAgICAvLyB2aWV3cG9ydCBhcmd1bWVudHNcbiAgICB3aWR0aCwgLy8gV2lkdGggb2Ygdmlld3BvcnRcbiAgICBoZWlnaHQsIC8vIEhlaWdodCBvZiB2aWV3cG9ydFxuICAgIC8vIHZpZXcgbWF0cml4IGFyZ3VtZW50c1xuICAgIGV5ZSwgLy8gRGVmaW5lcyBleWUgcG9zaXRpb25cbiAgICBsb29rQXQgPSBbMCwgMCwgMF0sIC8vIFdoaWNoIHBvaW50IGlzIGNhbWVyYSBsb29raW5nIGF0LCBkZWZhdWx0IG9yaWdpblxuICAgIHVwID0gWzAsIDEsIDBdLCAvLyBEZWZpbmVzIHVwIGRpcmVjdGlvbiwgZGVmYXVsdCBwb3NpdGl2ZSB5IGF4aXNcbiAgICAvLyBwcm9qZWN0aW9uIG1hdHJpeCBhcmd1bWVudHNcbiAgICBuZWFyID0gMSwgLy8gRGlzdGFuY2Ugb2YgbmVhciBjbGlwcGluZyBwbGFuZVxuICAgIGZhciA9IDEwMCwgLy8gRGlzdGFuY2Ugb2YgZmFyIGNsaXBwaW5nIHBsYW5lXG4gICAgZm92eSA9IDc1LCAvLyBGaWVsZCBvZiB2aWV3IGNvdmVyZWQgYnkgY2FtZXJhXG4gICAgbGVmdCwgLy8gTGVmdCBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICAgIHRvcCwgLy8gVG9wIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gICAgLy8gYXV0b21hdGljYWxseSBjYWxjdWxhdGVkXG4gICAgcmlnaHQgPSBudWxsLCAvLyBSaWdodCBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICAgIGJvdHRvbSA9IG51bGwgLy8gQm90dG9tIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gIH0pIHtcbiAgICByaWdodCA9IE51bWJlci5pc0Zpbml0ZShyaWdodCkgPyByaWdodCA6IGxlZnQgKyB3aWR0aDtcbiAgICBib3R0b20gPSBOdW1iZXIuaXNGaW5pdGUoYm90dG9tKSA/IHJpZ2h0IDogdG9wICsgaGVpZ2h0O1xuICAgIHN1cGVyKHtcbiAgICAgIHZpZXdNYXRyaXg6IG1hdDQubG9va0F0KFtdLCBleWUsIGxvb2tBdCwgdXApLFxuICAgICAgcHJvamVjdGlvbk1hdHJpeDogbWF0NC5vcnRobyhbXSwgbGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIpLFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHRcbiAgICB9KTtcbiAgfVxufVxuIl19