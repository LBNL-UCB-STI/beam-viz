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

var DEGREES_TO_RADIANS = Math.PI / 180;

var PerspectiveViewport = function (_Viewport) {
  _inherits(PerspectiveViewport, _Viewport);

  function PerspectiveViewport(_ref) {
    var width = _ref.width,
        height = _ref.height,
        eye = _ref.eye,
        _ref$lookAt = _ref.lookAt,
        lookAt = _ref$lookAt === undefined ? [0, 0, 0] : _ref$lookAt,
        _ref$up = _ref.up,
        up = _ref$up === undefined ? [0, 1, 0] : _ref$up,
        _ref$fovy = _ref.fovy,
        fovy = _ref$fovy === undefined ? 75 : _ref$fovy,
        _ref$near = _ref.near,
        near = _ref$near === undefined ? 1 : _ref$near,
        _ref$far = _ref.far,
        far = _ref$far === undefined ? 100 : _ref$far,
        _ref$aspect = _ref.aspect,
        aspect = _ref$aspect === undefined ? null : _ref$aspect;

    _classCallCheck(this, PerspectiveViewport);

    var fovyRadians = fovy * DEGREES_TO_RADIANS;
    aspect = Number.isFinite(aspect) ? aspect : width / height;
    return _possibleConstructorReturn(this, (PerspectiveViewport.__proto__ || Object.getPrototypeOf(PerspectiveViewport)).call(this, {
      viewMatrix: _glMatrix.mat4.lookAt([], eye, lookAt, up),
      projectionMatrix: _glMatrix.mat4.perspective([], fovyRadians, aspect, near, far),
      width: width,
      height: height
    }));
  }

  return PerspectiveViewport;
}(_viewport2.default);

exports.default = PerspectiveViewport;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdmlld3BvcnRzL3BlcnNwZWN0aXZlLXZpZXdwb3J0LmpzIl0sIm5hbWVzIjpbIkRFR1JFRVNfVE9fUkFESUFOUyIsIk1hdGgiLCJQSSIsIlBlcnNwZWN0aXZlVmlld3BvcnQiLCJ3aWR0aCIsImhlaWdodCIsImV5ZSIsImxvb2tBdCIsInVwIiwiZm92eSIsIm5lYXIiLCJmYXIiLCJhc3BlY3QiLCJmb3Z5UmFkaWFucyIsIk51bWJlciIsImlzRmluaXRlIiwidmlld01hdHJpeCIsInByb2plY3Rpb25NYXRyaXgiLCJwZXJzcGVjdGl2ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVBLElBQU1BLHFCQUFxQkMsS0FBS0MsRUFBTCxHQUFVLEdBQXJDOztJQUVxQkMsbUI7OztBQUNuQixxQ0FjRztBQUFBLFFBWkRDLEtBWUMsUUFaREEsS0FZQztBQUFBLFFBWERDLE1BV0MsUUFYREEsTUFXQztBQUFBLFFBVERDLEdBU0MsUUFUREEsR0FTQztBQUFBLDJCQVJEQyxNQVFDO0FBQUEsUUFSREEsTUFRQywrQkFSUSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxDQVFSO0FBQUEsdUJBUERDLEVBT0M7QUFBQSxRQVBEQSxFQU9DLDJCQVBJLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBT0o7QUFBQSx5QkFMREMsSUFLQztBQUFBLFFBTERBLElBS0MsNkJBTE0sRUFLTjtBQUFBLHlCQUpEQyxJQUlDO0FBQUEsUUFKREEsSUFJQyw2QkFKTSxDQUlOO0FBQUEsd0JBSERDLEdBR0M7QUFBQSxRQUhEQSxHQUdDLDRCQUhLLEdBR0w7QUFBQSwyQkFEREMsTUFDQztBQUFBLFFBRERBLE1BQ0MsK0JBRFEsSUFDUjs7QUFBQTs7QUFDRCxRQUFNQyxjQUFjSixPQUFPVCxrQkFBM0I7QUFDQVksYUFBU0UsT0FBT0MsUUFBUCxDQUFnQkgsTUFBaEIsSUFBMEJBLE1BQTFCLEdBQW1DUixRQUFRQyxNQUFwRDtBQUZDLHFJQUdLO0FBQ0pXLGtCQUFZLGVBQUtULE1BQUwsQ0FBWSxFQUFaLEVBQWdCRCxHQUFoQixFQUFxQkMsTUFBckIsRUFBNkJDLEVBQTdCLENBRFI7QUFFSlMsd0JBQWtCLGVBQUtDLFdBQUwsQ0FBaUIsRUFBakIsRUFBcUJMLFdBQXJCLEVBQWtDRCxNQUFsQyxFQUEwQ0YsSUFBMUMsRUFBZ0RDLEdBQWhELENBRmQ7QUFHSlAsa0JBSEk7QUFJSkM7QUFKSSxLQUhMO0FBU0Y7Ozs7O2tCQXhCa0JGLG1CIiwiZmlsZSI6InBlcnNwZWN0aXZlLXZpZXdwb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZpZXdwb3J0IGZyb20gJy4vdmlld3BvcnQnO1xuaW1wb3J0IHttYXQ0fSBmcm9tICdnbC1tYXRyaXgnO1xuXG5jb25zdCBERUdSRUVTX1RPX1JBRElBTlMgPSBNYXRoLlBJIC8gMTgwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQZXJzcGVjdGl2ZVZpZXdwb3J0IGV4dGVuZHMgVmlld3BvcnQge1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgLy8gdmlld3BvcnQgYXJndW1lbnRzXG4gICAgd2lkdGgsIC8vIFdpZHRoIG9mIHZpZXdwb3J0XG4gICAgaGVpZ2h0LCAvLyBIZWlnaHQgb2Ygdmlld3BvcnRcbiAgICAvLyB2aWV3IG1hdHJpeCBhcmd1bWVudHNcbiAgICBleWUsIC8vIERlZmluZXMgZXllIHBvc2l0aW9uXG4gICAgbG9va0F0ID0gWzAsIDAsIDBdLCAvLyBXaGljaCBwb2ludCBpcyBjYW1lcmEgbG9va2luZyBhdCwgZGVmYXVsdCBvcmlnaW5cbiAgICB1cCA9IFswLCAxLCAwXSwgLy8gRGVmaW5lcyB1cCBkaXJlY3Rpb24sIGRlZmF1bHQgcG9zaXRpdmUgeSBheGlzXG4gICAgLy8gcHJvamVjdGlvbiBtYXRyaXggYXJndW1lbnRzXG4gICAgZm92eSA9IDc1LCAvLyBGaWVsZCBvZiB2aWV3IGNvdmVyZWQgYnkgY2FtZXJhXG4gICAgbmVhciA9IDEsIC8vIERpc3RhbmNlIG9mIG5lYXIgY2xpcHBpbmcgcGxhbmVcbiAgICBmYXIgPSAxMDAsIC8vIERpc3RhbmNlIG9mIGZhciBjbGlwcGluZyBwbGFuZVxuICAgIC8vIGF1dG9tYXRpY2FsbHkgY2FsY3VsYXRlZFxuICAgIGFzcGVjdCA9IG51bGwgLy8gQXNwZWN0IHJhdGlvIChzZXQgdG8gdmlld3BvcnQgd2lkaHQvaGVpZ2h0KVxuICB9KSB7XG4gICAgY29uc3QgZm92eVJhZGlhbnMgPSBmb3Z5ICogREVHUkVFU19UT19SQURJQU5TO1xuICAgIGFzcGVjdCA9IE51bWJlci5pc0Zpbml0ZShhc3BlY3QpID8gYXNwZWN0IDogd2lkdGggLyBoZWlnaHQ7XG4gICAgc3VwZXIoe1xuICAgICAgdmlld01hdHJpeDogbWF0NC5sb29rQXQoW10sIGV5ZSwgbG9va0F0LCB1cCksXG4gICAgICBwcm9qZWN0aW9uTWF0cml4OiBtYXQ0LnBlcnNwZWN0aXZlKFtdLCBmb3Z5UmFkaWFucywgYXNwZWN0LCBuZWFyLCBmYXIpLFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHRcbiAgICB9KTtcbiAgfVxufVxuIl19