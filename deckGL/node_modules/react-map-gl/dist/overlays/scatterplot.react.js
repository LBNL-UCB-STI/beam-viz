'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp; // Copyright (c) 2015 Uber Technologies, Inc.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _canvasCompositeTypes = require('canvas-composite-types');

var _canvasCompositeTypes2 = _interopRequireDefault(_canvasCompositeTypes);

var _viewportMercatorProject = require('viewport-mercator-project');

var _viewportMercatorProject2 = _interopRequireDefault(_viewportMercatorProject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function round(x, n) {
  var tenN = Math.pow(10, n);
  return Math.round(x * tenN) / tenN;
}

var ScatterplotOverlay = (_temp = _class = function (_Component) {
  _inherits(ScatterplotOverlay, _Component);

  function ScatterplotOverlay() {
    _classCallCheck(this, ScatterplotOverlay);

    return _possibleConstructorReturn(this, (ScatterplotOverlay.__proto__ || Object.getPrototypeOf(ScatterplotOverlay)).apply(this, arguments));
  }

  _createClass(ScatterplotOverlay, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._redraw();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this._redraw();
    }

    /* eslint-disable max-statements */

  }, {
    key: '_redraw',
    value: function _redraw() {
      var _props = this.props,
          width = _props.width,
          height = _props.height,
          dotRadius = _props.dotRadius,
          dotFill = _props.dotFill,
          compositeOperation = _props.compositeOperation,
          renderWhileDragging = _props.renderWhileDragging,
          isDragging = _props.isDragging,
          locations = _props.locations,
          lngLatAccessor = _props.lngLatAccessor;


      var mercator = (0, _viewportMercatorProject2.default)(this.props);
      var pixelRatio = _window2.default.devicePixelRatio || 1;
      var canvas = this.refs.overlay;
      var ctx = canvas.getContext('2d');

      ctx.save();
      ctx.scale(pixelRatio, pixelRatio);
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = compositeOperation;

      if ((renderWhileDragging || !isDragging) && locations) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = locations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var location = _step.value;

            var pixel = mercator.project(lngLatAccessor(location));
            var pixelRounded = [round(pixel[0], 1), round(pixel[1], 1)];
            if (pixelRounded[0] + dotRadius >= 0 && pixelRounded[0] - dotRadius < width && pixelRounded[1] + dotRadius >= 0 && pixelRounded[1] - dotRadius < height) {
              ctx.fillStyle = dotFill;
              ctx.beginPath();
              ctx.arc(pixelRounded[0], pixelRounded[1], dotRadius, 0, Math.PI * 2);
              ctx.fill();
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

      ctx.restore();
    }
    /* eslint-enable max-statements */

  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          width = _props2.width,
          height = _props2.height,
          globalOpacity = _props2.globalOpacity;

      var pixelRatio = _window2.default.devicePixelRatio || 1;
      return _react2.default.createElement('canvas', {
        ref: 'overlay',
        width: width * pixelRatio,
        height: height * pixelRatio,
        style: {
          width: width + 'px',
          height: height + 'px',
          position: 'absolute',
          pointerEvents: 'none',
          opacity: globalOpacity,
          left: 0,
          top: 0
        } });
    }
  }]);

  return ScatterplotOverlay;
}(_react.Component), _class.propTypes = {
  width: _react.PropTypes.number.isRequired,
  height: _react.PropTypes.number.isRequired,
  latitude: _react.PropTypes.number.isRequired,
  longitude: _react.PropTypes.number.isRequired,
  zoom: _react.PropTypes.number.isRequired,
  isDragging: _react.PropTypes.bool.isRequired,
  locations: _react.PropTypes.instanceOf(_immutable2.default.List).isRequired,
  lngLatAccessor: _react.PropTypes.func.isRequired,
  renderWhileDragging: _react.PropTypes.bool,
  globalOpacity: _react.PropTypes.number.isRequired,
  dotRadius: _react.PropTypes.number.isRequired,
  dotFill: _react.PropTypes.string.isRequired,
  compositeOperation: _react.PropTypes.oneOf(_canvasCompositeTypes2.default).isRequired
}, _class.defaultProps = {
  lngLatAccessor: function lngLatAccessor(location) {
    return [location.get(0), location.get(1)];
  },
  renderWhileDragging: true,
  dotRadius: 4,
  dotFill: '#1FBAD6',
  globalOpacity: 1,
  // Same as browser default.
  compositeOperation: 'source-over'
}, _temp);
exports.default = ScatterplotOverlay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vdmVybGF5cy9zY2F0dGVycGxvdC5yZWFjdC5qcyJdLCJuYW1lcyI6WyJyb3VuZCIsIngiLCJuIiwidGVuTiIsIk1hdGgiLCJwb3ciLCJTY2F0dGVycGxvdE92ZXJsYXkiLCJfcmVkcmF3IiwicHJvcHMiLCJ3aWR0aCIsImhlaWdodCIsImRvdFJhZGl1cyIsImRvdEZpbGwiLCJjb21wb3NpdGVPcGVyYXRpb24iLCJyZW5kZXJXaGlsZURyYWdnaW5nIiwiaXNEcmFnZ2luZyIsImxvY2F0aW9ucyIsImxuZ0xhdEFjY2Vzc29yIiwibWVyY2F0b3IiLCJwaXhlbFJhdGlvIiwiZGV2aWNlUGl4ZWxSYXRpbyIsImNhbnZhcyIsInJlZnMiLCJvdmVybGF5IiwiY3R4IiwiZ2V0Q29udGV4dCIsInNhdmUiLCJzY2FsZSIsImNsZWFyUmVjdCIsImdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiIsImxvY2F0aW9uIiwicGl4ZWwiLCJwcm9qZWN0IiwicGl4ZWxSb3VuZGVkIiwiZmlsbFN0eWxlIiwiYmVnaW5QYXRoIiwiYXJjIiwiUEkiLCJmaWxsIiwicmVzdG9yZSIsImdsb2JhbE9wYWNpdHkiLCJwb3NpdGlvbiIsInBvaW50ZXJFdmVudHMiLCJvcGFjaXR5IiwibGVmdCIsInRvcCIsInByb3BUeXBlcyIsIm51bWJlciIsImlzUmVxdWlyZWQiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsInpvb20iLCJib29sIiwiaW5zdGFuY2VPZiIsIkxpc3QiLCJmdW5jIiwic3RyaW5nIiwib25lT2YiLCJkZWZhdWx0UHJvcHMiLCJnZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OzttQkFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxTQUFTQSxLQUFULENBQWVDLENBQWYsRUFB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U0FKVztBQUtwQjRCLGlCQUFlLENBTEs7QUFNcEI7QUFDQTNCLHNCQUFvQjtBQVBBLEM7a0JBbEJIUCxrQiIsImZpbGUiOiJzY2F0dGVycGxvdC5yZWFjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlcywgQ29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IENPTVBPU0lURV9UWVBFUyBmcm9tICdjYW52YXMtY29tcG9zaXRlLXR5cGVzJztcbmltcG9ydCBWaWV3cG9ydE1lcmNhdG9yIGZyb20gJ3ZpZXdwb3J0LW1lcmNhdG9yLXByb2plY3QnO1xuXG5mdW5jdGlvbiByb3VuZCh4LCBuKSB7XG4gIGNvbnN0IHRlbk4gPSBNYXRoLnBvdygxMCwgbik7XG4gIHJldHVybiBNYXRoLnJvdW5kKHggKiB0ZW5OKSAvIHRlbk47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjYXR0ZXJwbG90T3ZlcmxheSBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGhlaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGxhdGl0dWRlOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgbG9uZ2l0dWRlOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgem9vbTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGlzRHJhZ2dpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgbG9jYXRpb25zOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCkuaXNSZXF1aXJlZCxcbiAgICBsbmdMYXRBY2Nlc3NvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByZW5kZXJXaGlsZURyYWdnaW5nOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBnbG9iYWxPcGFjaXR5OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgZG90UmFkaXVzOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgZG90RmlsbDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNvbXBvc2l0ZU9wZXJhdGlvbjogUHJvcFR5cGVzLm9uZU9mKENPTVBPU0lURV9UWVBFUykuaXNSZXF1aXJlZFxuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgbG5nTGF0QWNjZXNzb3I6IGxvY2F0aW9uID0+IFtsb2NhdGlvbi5nZXQoMCksIGxvY2F0aW9uLmdldCgxKV0sXG4gICAgcmVuZGVyV2hpbGVEcmFnZ2luZzogdHJ1ZSxcbiAgICBkb3RSYWRpdXM6IDQsXG4gICAgZG90RmlsbDogJyMxRkJBRDYnLFxuICAgIGdsb2JhbE9wYWNpdHk6IDEsXG4gICAgLy8gU2FtZSBhcyBicm93c2VyIGRlZmF1bHQuXG4gICAgY29tcG9zaXRlT3BlcmF0aW9uOiAnc291cmNlLW92ZXInXG4gIH07XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5fcmVkcmF3KCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgdGhpcy5fcmVkcmF3KCk7XG4gIH1cblxuICAvKiBlc2xpbnQtZGlzYWJsZSBtYXgtc3RhdGVtZW50cyAqL1xuICBfcmVkcmF3KCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHdpZHRoLCBoZWlnaHQsIGRvdFJhZGl1cywgZG90RmlsbCwgY29tcG9zaXRlT3BlcmF0aW9uLFxuICAgICAgcmVuZGVyV2hpbGVEcmFnZ2luZywgaXNEcmFnZ2luZywgbG9jYXRpb25zLCBsbmdMYXRBY2Nlc3NvclxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgbWVyY2F0b3IgPSBWaWV3cG9ydE1lcmNhdG9yKHRoaXMucHJvcHMpO1xuICAgIGNvbnN0IHBpeGVsUmF0aW8gPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxO1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMucmVmcy5vdmVybGF5O1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguc2NhbGUocGl4ZWxSYXRpbywgcGl4ZWxSYXRpbyk7XG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gY29tcG9zaXRlT3BlcmF0aW9uO1xuXG4gICAgaWYgKChyZW5kZXJXaGlsZURyYWdnaW5nIHx8ICFpc0RyYWdnaW5nKSAmJiBsb2NhdGlvbnMpIHtcbiAgICAgIGZvciAoY29uc3QgbG9jYXRpb24gb2YgbG9jYXRpb25zKSB7XG4gICAgICAgIGNvbnN0IHBpeGVsID0gbWVyY2F0b3IucHJvamVjdChsbmdMYXRBY2Nlc3Nvcihsb2NhdGlvbikpO1xuICAgICAgICBjb25zdCBwaXhlbFJvdW5kZWQgPSBbcm91bmQocGl4ZWxbMF0sIDEpLCByb3VuZChwaXhlbFsxXSwgMSldO1xuICAgICAgICBpZiAocGl4ZWxSb3VuZGVkWzBdICsgZG90UmFkaXVzID49IDAgJiZcbiAgICAgICAgICAgIHBpeGVsUm91bmRlZFswXSAtIGRvdFJhZGl1cyA8IHdpZHRoICYmXG4gICAgICAgICAgICBwaXhlbFJvdW5kZWRbMV0gKyBkb3RSYWRpdXMgPj0gMCAmJlxuICAgICAgICAgICAgcGl4ZWxSb3VuZGVkWzFdIC0gZG90UmFkaXVzIDwgaGVpZ2h0XG4gICAgICAgICkge1xuICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBkb3RGaWxsO1xuICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICBjdHguYXJjKHBpeGVsUm91bmRlZFswXSwgcGl4ZWxSb3VuZGVkWzFdLCBkb3RSYWRpdXMsIDAsIE1hdGguUEkgKiAyKTtcbiAgICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuICAvKiBlc2xpbnQtZW5hYmxlIG1heC1zdGF0ZW1lbnRzICovXG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0LCBnbG9iYWxPcGFjaXR5fSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgcGl4ZWxSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG4gICAgcmV0dXJuIChcbiAgICAgIDxjYW52YXNcbiAgICAgICAgcmVmPVwib3ZlcmxheVwiXG4gICAgICAgIHdpZHRoPXsgd2lkdGggKiBwaXhlbFJhdGlvIH1cbiAgICAgICAgaGVpZ2h0PXsgaGVpZ2h0ICogcGl4ZWxSYXRpbyB9XG4gICAgICAgIHN0eWxlPXsge1xuICAgICAgICAgIHdpZHRoOiBgJHt3aWR0aH1weGAsXG4gICAgICAgICAgaGVpZ2h0OiBgJHtoZWlnaHR9cHhgLFxuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJyxcbiAgICAgICAgICBvcGFjaXR5OiBnbG9iYWxPcGFjaXR5LFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgdG9wOiAwXG4gICAgICAgIH0gfS8+XG4gICAgKTtcbiAgfVxufVxuIl19