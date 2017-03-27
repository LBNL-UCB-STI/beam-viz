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

var _viewportMercatorProject = require('viewport-mercator-project');

var _viewportMercatorProject2 = _interopRequireDefault(_viewportMercatorProject);

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

var _d3Array = require('d3-array');

var _d3Scale = require('d3-scale');

var _d3Geo = require('d3-geo');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ChoroplethOverlay = (_temp = _class = function (_Component) {
  _inherits(ChoroplethOverlay, _Component);

  function ChoroplethOverlay() {
    _classCallCheck(this, ChoroplethOverlay);

    return _possibleConstructorReturn(this, (ChoroplethOverlay.__proto__ || Object.getPrototypeOf(ChoroplethOverlay)).apply(this, arguments));
  }

  _createClass(ChoroplethOverlay, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._redraw();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this._redraw();
    }
  }, {
    key: '_redraw',
    value: function _redraw() {
      var pixelRatio = _window2.default.devicePixelRatio;
      var canvas = this.refs.overlay;
      var ctx = canvas.getContext('2d');
      var mercator = (0, _viewportMercatorProject2.default)(this.props);

      ctx.save();
      ctx.scale(pixelRatio, pixelRatio);
      ctx.clearRect(0, 0, this.props.width, this.props.height);

      function projectPoint(lon, lat) {
        var point = mercator.project([lon, lat]);
        /* eslint-disable no-invalid-this */
        this.stream.point(point[0], point[1]);
        /* eslint-enable no-invalid-this */
      }

      if (this.props.renderWhileDragging || !this.props.isDragging) {
        var transform = (0, _d3Geo.geoTransform)({ point: projectPoint });
        var path = (0, _d3Geo.geoPath)().projection(transform).context(ctx);
        this._drawFeatures(ctx, path);
      }
      ctx.restore();
    }
  }, {
    key: '_drawFeatures',
    value: function _drawFeatures(ctx, path) {
      var features = this.props.features;

      if (!features) {
        return;
      }
      var colorDomain = this.props.colorDomain || (0, _d3Array.extent)(features.toArray(), this.props.valueAccessor);

      var colorScale = (0, _d3Scale.scaleLinear)().domain(colorDomain).range(this.props.colorRange).clamp(true);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = features[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var feature = _step.value;

          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = '1';
          ctx.fillStyle = colorScale(this.props.valueAccessor(feature));
          var geometry = feature.get('geometry');
          path({
            type: geometry.get('type'),
            coordinates: geometry.get('coordinates').toJS()
          });
          ctx.fill();
          ctx.stroke();
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
  }, {
    key: 'render',
    value: function render() {
      var pixelRatio = _window2.default.devicePixelRatio || 1;
      return _react2.default.createElement('canvas', {
        ref: 'overlay',
        width: this.props.width * pixelRatio,
        height: this.props.height * pixelRatio,
        style: {
          width: this.props.width + 'px',
          height: this.props.height + 'px',
          position: 'absolute',
          pointerEvents: 'none',
          opacity: this.props.globalOpacity,
          left: 0,
          top: 0
        } });
    }
  }]);

  return ChoroplethOverlay;
}(_react.Component), _class.propTypes = {
  width: _react.PropTypes.number.isRequired,
  height: _react.PropTypes.number.isRequired,
  latitude: _react.PropTypes.number.isRequired,
  longitude: _react.PropTypes.number.isRequired,
  zoom: _react.PropTypes.number.isRequired,
  isDragging: _react.PropTypes.bool.isRequired,
  renderWhileDragging: _react.PropTypes.bool.isRequired,
  globalOpacity: _react.PropTypes.number.isRequired,
  /**
    * An Immutable List of feature objects.
    */
  features: _react.PropTypes.instanceOf(_immutable2.default.List),
  /* eslint-disable react/forbid-prop-types */
  colorDomain: _react.PropTypes.array,
  colorRange: _react.PropTypes.array.isRequired,
  valueAccessor: _react.PropTypes.func.isRequired
}, _class.defaultProps = {
  renderWhileDragging: true,
  globalOpacity: 1,
  colorDomain: null,
  colorRange: ['#FFFFFF', '#1FBAD6'],
  valueAccessor: function valueAccessor(feature) {
    return feature.get('properties').get('value');
  }
}, _temp);
exports.default = ChoroplethOverlay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vdmVybGF5cy9jaG9yb3BsZXRoLnJlYWN0LmpzIl0sIm5hbWVzIjpbIkNob3JvcGxldGhPdmVybGF5IiwiX3JlZHJhdyIsInBpeGVsUmF0aW8iLCJkZXZpY2VQaXhlbFJhdGlvIiwiY2FudmFzIiwicmVmcyIsIm92ZXJsYXkiLCJjdHgiLCJnZXRDb250ZXh0IiwibWVyY2F0b3IiLCJwcm9wcyIsInNhdmUiLCJzY2FsZSIsImNsZWFyUmVjdCIsIndpZHRoIiwiaGVpZ2h0IiwicHJvamVjdFBvaW50IiwibG9uIiwibGF0IiwicG9pbnQiLCJwcm9qZWN0Iiwic3RyZWFtIiwicmVuZGVyV2hpbGVEcmFnZ2luZyIsImlzRHJhZ2dpbmciLCJ0cmFuc2Zvcm0iLCJwYXRoIiwicHJvamVjdGlvbiIsImNvbnRleHQiLCJfZHJhd0ZlYXR1cmVzIiwicmVzdG9yZSIsImZlYXR1cmVzIiwiY29sb3JEb21haW4iLCJ0b0FycmF5IiwidmFsdWVBY2Nlc3NvciIsImNvbG9yU2NhbGUiLCJkb21haW4iLCJyYW5nZSIsImNvbG9yUmFuZ2UiLCJjbGFtcCIsImZlYXR1cmUiLCJiZWdpblBhdGgiLCJzdHJva2VTdHlsZSIsImxpbmVXaWR0aCIsImZpbGxTdHlsZSIsImdlb21ldHJ5IiwiZ2V0IiwidHlwZSIsImNvb3JkaW5hdGVzIiwidG9KUyIsImZpbGwiLCJzdHJva2UiLCJwb3NpdGlvbiIsInBvaW50ZXJFdmVudHMiLCJvcGFjaXR5IiwiZ2xvYmFsT3BhY2l0eSIsImxlZnQiLCJ0b3AiLCJwcm9wVHlwZXMiLCJudW1iZXIiLCJpc1JlcXVpcmVkIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJ6b29tIiwiYm9vbCIsImluc3RhbmNlT2YiLCJMaXN0IiwiYXJyYXkiLCJmdW5jIiwiZGVmYXVsdFByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7bUJBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FB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Rks7QUFHcEJ2QixlQUFhLElBSE87QUFJcEJNLGNBQVksQ0FBQyxTQUFELEVBQVksU0FBWixDQUpRO0FBS3BCSixpQkFBZTtBQUFBLFdBQVdNLFFBQVFNLEdBQVIsQ0FBWSxZQUFaLEVBQTBCQSxHQUExQixDQUE4QixPQUE5QixDQUFYO0FBQUE7QUFMSyxDO2tCQXJCSDdDLGlCIiwiZmlsZSI6ImNob3JvcGxldGgucmVhY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cblxuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzLCBDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBWaWV3cG9ydE1lcmNhdG9yIGZyb20gJ3ZpZXdwb3J0LW1lcmNhdG9yLXByb2plY3QnO1xuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCB7ZXh0ZW50fSBmcm9tICdkMy1hcnJheSc7XG5pbXBvcnQge3NjYWxlTGluZWFyfSBmcm9tICdkMy1zY2FsZSc7XG5pbXBvcnQge2dlb1BhdGgsIGdlb1RyYW5zZm9ybX0gZnJvbSAnZDMtZ2VvJztcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hvcm9wbGV0aE92ZXJsYXkgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBsYXRpdHVkZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGxvbmdpdHVkZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHpvb206IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBpc0RyYWdnaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIHJlbmRlcldoaWxlRHJhZ2dpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgZ2xvYmFsT3BhY2l0eTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIC8qKlxuICAgICAgKiBBbiBJbW11dGFibGUgTGlzdCBvZiBmZWF0dXJlIG9iamVjdHMuXG4gICAgICAqL1xuICAgIGZlYXR1cmVzOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCksXG4gICAgLyogZXNsaW50LWRpc2FibGUgcmVhY3QvZm9yYmlkLXByb3AtdHlwZXMgKi9cbiAgICBjb2xvckRvbWFpbjogUHJvcFR5cGVzLmFycmF5LFxuICAgIGNvbG9yUmFuZ2U6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICAgIHZhbHVlQWNjZXNzb3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHJlbmRlcldoaWxlRHJhZ2dpbmc6IHRydWUsXG4gICAgZ2xvYmFsT3BhY2l0eTogMSxcbiAgICBjb2xvckRvbWFpbjogbnVsbCxcbiAgICBjb2xvclJhbmdlOiBbJyNGRkZGRkYnLCAnIzFGQkFENiddLFxuICAgIHZhbHVlQWNjZXNzb3I6IGZlYXR1cmUgPT4gZmVhdHVyZS5nZXQoJ3Byb3BlcnRpZXMnKS5nZXQoJ3ZhbHVlJylcbiAgfTtcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9yZWRyYXcoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICB0aGlzLl9yZWRyYXcoKTtcbiAgfVxuXG4gIF9yZWRyYXcoKSB7XG4gICAgY29uc3QgcGl4ZWxSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMucmVmcy5vdmVybGF5O1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IG1lcmNhdG9yID0gVmlld3BvcnRNZXJjYXRvcih0aGlzLnByb3BzKTtcblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnNjYWxlKHBpeGVsUmF0aW8sIHBpeGVsUmF0aW8pO1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5wcm9wcy53aWR0aCwgdGhpcy5wcm9wcy5oZWlnaHQpO1xuXG4gICAgZnVuY3Rpb24gcHJvamVjdFBvaW50KGxvbiwgbGF0KSB7XG4gICAgICBjb25zdCBwb2ludCA9IG1lcmNhdG9yLnByb2plY3QoW2xvbiwgbGF0XSk7XG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1pbnZhbGlkLXRoaXMgKi9cbiAgICAgIHRoaXMuc3RyZWFtLnBvaW50KHBvaW50WzBdLCBwb2ludFsxXSk7XG4gICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWludmFsaWQtdGhpcyAqL1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLnJlbmRlcldoaWxlRHJhZ2dpbmcgfHwgIXRoaXMucHJvcHMuaXNEcmFnZ2luZykge1xuICAgICAgY29uc3QgdHJhbnNmb3JtID0gZ2VvVHJhbnNmb3JtKHtwb2ludDogcHJvamVjdFBvaW50fSk7XG4gICAgICBjb25zdCBwYXRoID0gZ2VvUGF0aCgpLnByb2plY3Rpb24odHJhbnNmb3JtKS5jb250ZXh0KGN0eCk7XG4gICAgICB0aGlzLl9kcmF3RmVhdHVyZXMoY3R4LCBwYXRoKTtcbiAgICB9XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuXG4gIF9kcmF3RmVhdHVyZXMoY3R4LCBwYXRoKSB7XG4gICAgY29uc3Qge2ZlYXR1cmVzfSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKCFmZWF0dXJlcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjb2xvckRvbWFpbiA9IHRoaXMucHJvcHMuY29sb3JEb21haW4gfHxcbiAgICAgIGV4dGVudChmZWF0dXJlcy50b0FycmF5KCksIHRoaXMucHJvcHMudmFsdWVBY2Nlc3Nvcik7XG5cbiAgICBjb25zdCBjb2xvclNjYWxlID0gc2NhbGVMaW5lYXIoKVxuICAgICAgLmRvbWFpbihjb2xvckRvbWFpbilcbiAgICAgIC5yYW5nZSh0aGlzLnByb3BzLmNvbG9yUmFuZ2UpXG4gICAgICAuY2xhbXAodHJ1ZSk7XG5cbiAgICBmb3IgKGNvbnN0IGZlYXR1cmUgb2YgZmVhdHVyZXMpIHtcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNSknO1xuICAgICAgY3R4LmxpbmVXaWR0aCA9ICcxJztcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvclNjYWxlKHRoaXMucHJvcHMudmFsdWVBY2Nlc3NvcihmZWF0dXJlKSk7XG4gICAgICBjb25zdCBnZW9tZXRyeSA9IGZlYXR1cmUuZ2V0KCdnZW9tZXRyeScpO1xuICAgICAgcGF0aCh7XG4gICAgICAgIHR5cGU6IGdlb21ldHJ5LmdldCgndHlwZScpLFxuICAgICAgICBjb29yZGluYXRlczogZ2VvbWV0cnkuZ2V0KCdjb29yZGluYXRlcycpLnRvSlMoKVxuICAgICAgfSk7XG4gICAgICBjdHguZmlsbCgpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBwaXhlbFJhdGlvID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiAgICByZXR1cm4gKFxuICAgICAgPGNhbnZhc1xuICAgICAgICByZWY9XCJvdmVybGF5XCJcbiAgICAgICAgd2lkdGg9eyB0aGlzLnByb3BzLndpZHRoICogcGl4ZWxSYXRpbyB9XG4gICAgICAgIGhlaWdodD17IHRoaXMucHJvcHMuaGVpZ2h0ICogcGl4ZWxSYXRpbyB9XG4gICAgICAgIHN0eWxlPXsge1xuICAgICAgICAgIHdpZHRoOiBgJHt0aGlzLnByb3BzLndpZHRofXB4YCxcbiAgICAgICAgICBoZWlnaHQ6IGAke3RoaXMucHJvcHMuaGVpZ2h0fXB4YCxcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAgICAgb3BhY2l0eTogdGhpcy5wcm9wcy5nbG9iYWxPcGFjaXR5LFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgdG9wOiAwXG4gICAgICAgIH0gfS8+XG4gICAgKTtcbiAgfVxufVxuIl19