'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SVGOverlay = (_temp = _class = function (_Component) {
  _inherits(SVGOverlay, _Component);

  function SVGOverlay() {
    _classCallCheck(this, SVGOverlay);

    return _possibleConstructorReturn(this, (SVGOverlay.__proto__ || Object.getPrototypeOf(SVGOverlay)).apply(this, arguments));
  }

  _createClass(SVGOverlay, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          width = _props.width,
          height = _props.height,
          isDragging = _props.isDragging;

      var style = _extends({
        pointerEvents: 'none',
        position: 'absolute',
        left: 0,
        top: 0
      }, this.props.style);
      var mercator = (0, _viewportMercatorProject2.default)(this.props);
      var project = mercator.project,
          unproject = mercator.unproject;


      return _react2.default.createElement(
        'svg',
        {
          ref: 'overlay',
          width: width,
          height: height,
          style: style },
        this.props.redraw({ width: width, height: height, project: project, unproject: unproject, isDragging: isDragging })
      );
    }
  }]);

  return SVGOverlay;
}(_react.Component), _class.propTypes = {
  width: _react.PropTypes.number.isRequired,
  height: _react.PropTypes.number.isRequired,
  latitude: _react.PropTypes.number.isRequired,
  longitude: _react.PropTypes.number.isRequired,
  zoom: _react.PropTypes.number.isRequired,
  redraw: _react.PropTypes.func.isRequired,
  isDragging: _react.PropTypes.bool.isRequired
}, _temp);
exports.default = SVGOverlay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vdmVybGF5cy9zdmcucmVhY3QuanMiXSwibmFtZXMiOlsiU1ZHT3ZlcmxheSIsInByb3BzIiwid2lkdGgiLCJoZWlnaHQiLCJpc0RyYWdnaW5nIiwic3R5bGUiLCJwb2ludGVyRXZlbnRzIiwicG9zaXRpb24iLCJsZWZ0IiwidG9wIiwibWVyY2F0b3IiLCJwcm9qZWN0IiwidW5wcm9qZWN0IiwicmVkcmF3IiwicHJvcFR5cGVzIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwiem9vbSIsImZ1bmMiLCJib29sIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzttQkFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFcUJBLFU7Ozs7Ozs7Ozs7OzZCQVlWO0FBQUEsbUJBQzZCLEtBQUtDLEtBRGxDO0FBQUEsVUFDQUMsS0FEQSxVQUNBQSxLQURBO0FBQUEsVUFDT0MsTUFEUCxVQUNPQSxNQURQO0FBQUEsVUFDZUMsVUFEZixVQUNlQSxVQURmOztBQUVQLFVBQU1DO0FBQ0pDLHVCQUFlLE1BRFg7QUFFSkMsa0JBQVUsVUFGTjtBQUdKQyxjQUFNLENBSEY7QUFJSkMsYUFBSztBQUpELFNBS0QsS0FBS1IsS0FBTCxDQUFXSSxLQUxWLENBQU47QUFPQSxVQUFNSyxXQUFXLHVDQUFpQixLQUFLVCxLQUF0QixDQUFqQjtBQVRPLFVBVUFVLE9BVkEsR0FVc0JELFFBVnRCLENBVUFDLE9BVkE7QUFBQSxVQVVTQyxTQVZULEdBVXNCRixRQVZ0QixDQVVTRSxTQVZUOzs7QUFZUCxhQUNFO0FBQUE7QUFBQTtBQUNFLGVBQUksU0FETjtBQUVFLGlCQUFRVixLQUZWO0FBR0Usa0JBQVNDLE1BSFg7QUFJRSxpQkFBUUUsS0FKVjtBQU1JLGFBQUtKLEtBQUwsQ0FBV1ksTUFBWCxDQUFrQixFQUFDWCxZQUFELEVBQVFDLGNBQVIsRUFBZ0JRLGdCQUFoQixFQUF5QkMsb0JBQXpCLEVBQW9DUixzQkFBcEMsRUFBbEI7QUFOSixPQURGO0FBV0Q7Ozs7NEJBakNNVSxTLEdBQVk7QUFDakJaLFNBQU8saUJBQVVhLE1BQVYsQ0FBaUJDLFVBRFA7QUFFakJiLFVBQVEsaUJBQVVZLE1BQVYsQ0FBaUJDLFVBRlI7QUFHakJDLFlBQVUsaUJBQVVGLE1BQVYsQ0FBaUJDLFVBSFY7QUFJakJFLGFBQVcsaUJBQVVILE1BQVYsQ0FBaUJDLFVBSlg7QUFLakJHLFFBQU0saUJBQVVKLE1BQVYsQ0FBaUJDLFVBTE47QUFNakJILFVBQVEsaUJBQVVPLElBQVYsQ0FBZUosVUFOTjtBQU9qQlosY0FBWSxpQkFBVWlCLElBQVYsQ0FBZUw7QUFQVixDO2tCQUZBaEIsVSIsImZpbGUiOiJzdmcucmVhY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cblxuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXMsIENvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFZpZXdwb3J0TWVyY2F0b3IgZnJvbSAndmlld3BvcnQtbWVyY2F0b3ItcHJvamVjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNWR092ZXJsYXkgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBsYXRpdHVkZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGxvbmdpdHVkZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHpvb206IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICByZWRyYXc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgaXNEcmFnZ2luZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZFxuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7d2lkdGgsIGhlaWdodCwgaXNEcmFnZ2luZ30gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICBsZWZ0OiAwLFxuICAgICAgdG9wOiAwLFxuICAgICAgLi4udGhpcy5wcm9wcy5zdHlsZVxuICAgIH07XG4gICAgY29uc3QgbWVyY2F0b3IgPSBWaWV3cG9ydE1lcmNhdG9yKHRoaXMucHJvcHMpO1xuICAgIGNvbnN0IHtwcm9qZWN0LCB1bnByb2plY3R9ID0gbWVyY2F0b3I7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHN2Z1xuICAgICAgICByZWY9XCJvdmVybGF5XCJcbiAgICAgICAgd2lkdGg9eyB3aWR0aCB9XG4gICAgICAgIGhlaWdodD17IGhlaWdodCB9XG4gICAgICAgIHN0eWxlPXsgc3R5bGUgfT5cblxuICAgICAgICB7IHRoaXMucHJvcHMucmVkcmF3KHt3aWR0aCwgaGVpZ2h0LCBwcm9qZWN0LCB1bnByb2plY3QsIGlzRHJhZ2dpbmd9KSB9XG5cbiAgICAgIDwvc3ZnPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==