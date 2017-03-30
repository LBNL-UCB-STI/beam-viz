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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CanvasOverlay = (_temp = _class = function (_Component) {
  _inherits(CanvasOverlay, _Component);

  function CanvasOverlay() {
    _classCallCheck(this, CanvasOverlay);

    return _possibleConstructorReturn(this, (CanvasOverlay.__proto__ || Object.getPrototypeOf(CanvasOverlay)).apply(this, arguments));
  }

  _createClass(CanvasOverlay, [{
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
      var pixelRatio = _window2.default.devicePixelRatio || 1;
      var canvas = this.refs.overlay;
      var ctx = canvas.getContext('2d');
      ctx.save();
      ctx.scale(pixelRatio, pixelRatio);
      var mercator = (0, _viewportMercatorProject2.default)(this.props);
      this.props.redraw({
        width: this.props.width,
        height: this.props.height,
        ctx: ctx,
        project: mercator.project,
        unproject: mercator.unproject,
        isDragging: this.props.isDragging
      });
      ctx.restore();
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
          left: 0,
          top: 0
        } });
    }
  }]);

  return CanvasOverlay;
}(_react.Component), _class.propTypes = {
  width: _react.PropTypes.number.isRequired,
  height: _react.PropTypes.number.isRequired,
  latitude: _react.PropTypes.number.isRequired,
  longitude: _react.PropTypes.number.isRequired,
  zoom: _react.PropTypes.number.isRequired,
  redraw: _react.PropTypes.func.isRequired,
  isDragging: _react.PropTypes.bool.isRequired
}, _temp);
exports.default = CanvasOverlay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vdmVybGF5cy9jYW52YXMucmVhY3QuanMiXSwibmFtZXMiOlsiQ2FudmFzT3ZlcmxheSIsIl9yZWRyYXciLCJwaXhlbFJhdGlvIiwiZGV2aWNlUGl4ZWxSYXRpbyIsImNhbnZhcyIsInJlZnMiLCJvdmVybGF5IiwiY3R4IiwiZ2V0Q29udGV4dCIsInNhdmUiLCJzY2FsZSIsIm1lcmNhdG9yIiwicHJvcHMiLCJyZWRyYXciLCJ3aWR0aCIsImhlaWdodCIsInByb2plY3QiLCJ1bnByb2plY3QiLCJpc0RyYWdnaW5nIiwicmVzdG9yZSIsInBvc2l0aW9uIiwicG9pbnRlckV2ZW50cyIsImxlZnQiLCJ0b3AiLCJwcm9wVHlwZXMiLCJudW1iZXIiLCJpc1JlcXVpcmVkIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJ6b29tIiwiZnVuYyIsImJvb2wiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OzttQkFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVxQkEsYTs7Ozs7Ozs7Ozs7d0NBWUM7QUFDbEIsV0FBS0MsT0FBTDtBQUNEOzs7eUNBRW9CO0FBQ25CLFdBQUtBLE9BQUw7QUFDRDs7OzhCQUVTO0FBQ1IsVUFBTUMsYUFBYSxpQkFBT0MsZ0JBQVAsSUFBMkIsQ0FBOUM7QUFDQSxVQUFNQyxTQUFTLEtBQUtDLElBQUwsQ0FBVUMsT0FBekI7QUFDQSxVQUFNQyxNQUFNSCxPQUFPSSxVQUFQLENBQWtCLElBQWxCLENBQVo7QUFDQUQsVUFBSUUsSUFBSjtBQUNBRixVQUFJRyxLQUFKLENBQVVSLFVBQVYsRUFBc0JBLFVBQXRCO0FBQ0EsVUFBTVMsV0FBVyx1Q0FBaUIsS0FBS0MsS0FBdEIsQ0FBakI7QUFDQSxXQUFLQSxLQUFMLENBQVdDLE1BQVgsQ0FBa0I7QUFDaEJDLGVBQU8sS0FBS0YsS0FBTCxDQUFXRSxLQURGO0FBRWhCQyxnQkFBUSxLQUFLSCxLQUFMLENBQVdHLE1BRkg7QUFHaEJSLGdCQUhnQjtBQUloQlMsaUJBQVNMLFNBQVNLLE9BSkY7QUFLaEJDLG1CQUFXTixTQUFTTSxTQUxKO0FBTWhCQyxvQkFBWSxLQUFLTixLQUFMLENBQVdNO0FBTlAsT0FBbEI7QUFRQVgsVUFBSVksT0FBSjtBQUNEOzs7NkJBRVE7QUFDUCxVQUFNakIsYUFBYSxpQkFBT0MsZ0JBQVAsSUFBMkIsQ0FBOUM7QUFDQSxhQUNFO0FBQ0UsYUFBSSxTQUROO0FBRUUsZUFBUSxLQUFLUyxLQUFMLENBQVdFLEtBQVgsR0FBbUJaLFVBRjdCO0FBR0UsZ0JBQVMsS0FBS1UsS0FBTCxDQUFXRyxNQUFYLEdBQW9CYixVQUgvQjtBQUlFLGVBQVE7QUFDTlksaUJBQVUsS0FBS0YsS0FBTCxDQUFXRSxLQUFyQixPQURNO0FBRU5DLGtCQUFXLEtBQUtILEtBQUwsQ0FBV0csTUFBdEIsT0FGTTtBQUdOSyxvQkFBVSxVQUhKO0FBSU5DLHlCQUFlLE1BSlQ7QUFLTkMsZ0JBQU0sQ0FMQTtBQU1OQyxlQUFLO0FBTkMsU0FKVixHQURGO0FBY0Q7Ozs7NEJBcERNQyxTLEdBQVk7QUFDakJWLFNBQU8saUJBQVVXLE1BQVYsQ0FBaUJDLFVBRFA7QUFFakJYLFVBQVEsaUJBQVVVLE1BQVYsQ0FBaUJDLFVBRlI7QUFHakJDLFlBQVUsaUJBQVVGLE1BQVYsQ0FBaUJDLFVBSFY7QUFJakJFLGFBQVcsaUJBQVVILE1BQVYsQ0FBaUJDLFVBSlg7QUFLakJHLFFBQU0saUJBQVVKLE1BQVYsQ0FBaUJDLFVBTE47QUFNakJiLFVBQVEsaUJBQVVpQixJQUFWLENBQWVKLFVBTk47QUFPakJSLGNBQVksaUJBQVVhLElBQVYsQ0FBZUw7QUFQVixDO2tCQUZBMUIsYSIsImZpbGUiOiJjYW52YXMucmVhY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cblxuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXMsIENvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFZpZXdwb3J0TWVyY2F0b3IgZnJvbSAndmlld3BvcnQtbWVyY2F0b3ItcHJvamVjdCc7XG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXNPdmVybGF5IGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgbGF0aXR1ZGU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBsb25naXR1ZGU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICB6b29tOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgcmVkcmF3OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGlzRHJhZ2dpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWRcbiAgfTtcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9yZWRyYXcoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICB0aGlzLl9yZWRyYXcoKTtcbiAgfVxuXG4gIF9yZWRyYXcoKSB7XG4gICAgY29uc3QgcGl4ZWxSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5yZWZzLm92ZXJsYXk7XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguc2NhbGUocGl4ZWxSYXRpbywgcGl4ZWxSYXRpbyk7XG4gICAgY29uc3QgbWVyY2F0b3IgPSBWaWV3cG9ydE1lcmNhdG9yKHRoaXMucHJvcHMpO1xuICAgIHRoaXMucHJvcHMucmVkcmF3KHtcbiAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgIGN0eCxcbiAgICAgIHByb2plY3Q6IG1lcmNhdG9yLnByb2plY3QsXG4gICAgICB1bnByb2plY3Q6IG1lcmNhdG9yLnVucHJvamVjdCxcbiAgICAgIGlzRHJhZ2dpbmc6IHRoaXMucHJvcHMuaXNEcmFnZ2luZ1xuICAgIH0pO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgcGl4ZWxSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG4gICAgcmV0dXJuIChcbiAgICAgIDxjYW52YXNcbiAgICAgICAgcmVmPVwib3ZlcmxheVwiXG4gICAgICAgIHdpZHRoPXsgdGhpcy5wcm9wcy53aWR0aCAqIHBpeGVsUmF0aW8gfVxuICAgICAgICBoZWlnaHQ9eyB0aGlzLnByb3BzLmhlaWdodCAqIHBpeGVsUmF0aW8gfVxuICAgICAgICBzdHlsZT17IHtcbiAgICAgICAgICB3aWR0aDogYCR7dGhpcy5wcm9wcy53aWR0aH1weGAsXG4gICAgICAgICAgaGVpZ2h0OiBgJHt0aGlzLnByb3BzLmhlaWdodH1weGAsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgdG9wOiAwXG4gICAgICAgIH0gfS8+XG4gICAgKTtcbiAgfVxufVxuIl19