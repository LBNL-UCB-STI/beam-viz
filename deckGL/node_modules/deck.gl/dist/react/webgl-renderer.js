'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _autobind = require('./autobind');

var _autobind2 = _interopRequireDefault(_autobind);

var _luma = require('luma.gl');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Copyright (c) 2015 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/* global window */


/* global requestAnimationFrame, cancelAnimationFrame */

var DEFAULT_PIXEL_RATIO = typeof window !== 'undefined' && window.devicePixelRatio || 1;

var propTypes = {
  id: _react.PropTypes.string.isRequired,

  width: _react.PropTypes.number.isRequired,
  height: _react.PropTypes.number.isRequired,
  style: _react.PropTypes.object,

  pixelRatio: _react.PropTypes.number,
  viewport: _react.PropTypes.object.isRequired,
  events: _react.PropTypes.object,
  gl: _react.PropTypes.object,
  glOptions: _react.PropTypes.object,
  debug: _react.PropTypes.bool,

  onInitializationFailed: _react.PropTypes.func,
  onRendererInitialized: _react.PropTypes.func.isRequired,
  onRenderFrame: _react.PropTypes.func,
  onMouseMove: _react.PropTypes.func,
  onClick: _react.PropTypes.func
};

var defaultProps = {
  style: {},
  gl: null,
  glOptions: { preserveDrawingBuffer: true },
  debug: false,
  pixelRatio: DEFAULT_PIXEL_RATIO,

  onInitializationFailed: function onInitializationFailed(error) {
    throw error;
  },
  onRendererInitialized: function onRendererInitialized() {},
  onRenderFrame: function onRenderFrame() {}
};

var WebGLRenderer = function (_React$Component) {
  _inherits(WebGLRenderer, _React$Component);

  /**
   * @classdesc
   * Small react component that uses Luma.GL to initialize a WebGL context.
   *
   * Returns a canvas, creates a basic WebGL context
   * sets up a renderloop, and registers some basic event handlers
   *
   * @class
   * @param {Object} props - see propTypes documentation
   */
  function WebGLRenderer(props) {
    _classCallCheck(this, WebGLRenderer);

    var _this = _possibleConstructorReturn(this, (WebGLRenderer.__proto__ || Object.getPrototypeOf(WebGLRenderer)).call(this, props));

    _this.state = {};
    _this._animationFrame = null;
    _this.gl = null;
    (0, _autobind2.default)(_this);
    return _this;
  }

  _createClass(WebGLRenderer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var canvas = this.refs.overlay;
      this._initWebGL(canvas);
      this._animationLoop();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._cancelAnimationLoop();
    }

    /**
     * Initialize LumaGL library and through it WebGL
     * @param {string} canvas
     */

  }, {
    key: '_initWebGL',
    value: function _initWebGL(canvas) {
      var _props = this.props,
          debug = _props.debug,
          glOptions = _props.glOptions;

      // Create context if not supplied

      var gl = this.props.gl;
      if (!gl) {
        try {
          gl = (0, _luma.createGLContext)(Object.assign({ canvas: canvas, debug: debug }, glOptions));
        } catch (error) {
          this.props.onInitializationFailed(error);
          return;
        }
      }

      this.gl = gl;

      // Call callback last, in case it throws
      this.props.onRendererInitialized({ canvas: canvas, gl: gl });
    }

    /**
     * Main WebGL animation loop
     */

  }, {
    key: '_animationLoop',
    value: function _animationLoop() {
      this._renderFrame();
      // Keep registering ourselves for the next animation frame
      if (typeof window !== 'undefined') {
        this._animationFrame = requestAnimationFrame(this._animationLoop);
      }
    }
  }, {
    key: '_cancelAnimationLoop',
    value: function _cancelAnimationLoop() {
      if (this._animationFrame) {
        cancelAnimationFrame(this._animationFrame);
      }
    }

    // Updates WebGL viewport to latest props
    // for clean logging, only calls gl.viewport if props have changed

  }, {
    key: '_updateGLViewport',
    value: function _updateGLViewport() {
      var _props$viewport = this.props.viewport,
          x = _props$viewport.x,
          y = _props$viewport.y,
          w = _props$viewport.width,
          h = _props$viewport.height;
      var dpr = this.props.pixelRatio;
      var gl = this.gl;


      x = x * dpr;
      y = y * dpr;
      w = w * dpr;
      h = h * dpr;

      if (x !== this.x || y !== this.y || w !== this.w || h !== this.h) {
        gl.viewport(x, y, w, h);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
      }
    }
  }, {
    key: '_renderFrame',
    value: function _renderFrame() {
      var _props$viewport2 = this.props.viewport,
          width = _props$viewport2.width,
          height = _props$viewport2.height;
      var gl = this.gl;

      // Check for reasons not to draw

      if (!gl || !(width > 0) || !(height > 0)) {
        return;
      }

      this._updateGLViewport();

      // Call render callback
      this.props.onRenderFrame({ gl: gl });

      this.props.onAfterRender(this.refs.overlay);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          id = _props2.id,
          width = _props2.width,
          height = _props2.height,
          pixelRatio = _props2.pixelRatio,
          style = _props2.style;

      return (0, _react.createElement)('canvas', {
        ref: 'overlay',
        key: 'overlay',
        id: id,
        width: width * pixelRatio,
        height: height * pixelRatio,
        style: Object.assign({}, style, { width: width, height: height })
      });
    }
  }]);

  return WebGLRenderer;
}(_react2.default.Component);

exports.default = WebGLRenderer;


WebGLRenderer.propTypes = propTypes;
WebGLRenderer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC93ZWJnbC1yZW5kZXJlci5qcyJdLCJuYW1lcyI6WyJERUZBVUxUX1BJWEVMX1JBVElPIiwid2luZG93IiwiZGV2aWNlUGl4ZWxSYXRpbyIsInByb3BUeXBlcyIsImlkIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIndpZHRoIiwibnVtYmVyIiwiaGVpZ2h0Iiwic3R5bGUiLCJvYmplY3QiLCJwaXhlbFJhdGlvIiwidmlld3BvcnQiLCJldmVudHMiLCJnbCIsImdsT3B0aW9ucyIsImRlYnVnIiwiYm9vbCIsIm9uSW5pdGlhbGl6YXRpb25GYWlsZWQiLCJmdW5jIiwib25SZW5kZXJlckluaXRpYWxpemVkIiwib25SZW5kZXJGcmFtZSIsIm9uTW91c2VNb3ZlIiwib25DbGljayIsImRlZmF1bHRQcm9wcyIsInByZXNlcnZlRHJhd2luZ0J1ZmZlciIsImVycm9yIiwiV2ViR0xSZW5kZXJlciIsInByb3BzIiwic3RhdGUiLCJfYW5pbWF0aW9uRnJhbWUiLCJjYW52YXMiLCJyZWZzIiwib3ZlcmxheSIsIl9pbml0V2ViR0wiLCJfYW5pbWF0aW9uTG9vcCIsIl9jYW5jZWxBbmltYXRpb25Mb29wIiwiT2JqZWN0IiwiYXNzaWduIiwiX3JlbmRlckZyYW1lIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJ4IiwieSIsInciLCJoIiwiZHByIiwiX3VwZGF0ZUdMVmlld3BvcnQiLCJvbkFmdGVyUmVuZGVyIiwicmVmIiwia2V5IiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQXFCQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7OytlQXZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBSUE7O0FBRUEsSUFBTUEsc0JBQ0gsT0FBT0MsTUFBUCxLQUFrQixXQUFs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Q0FBeUIsS0FBS2hCLElBQUwsQ0FBVUMsT0FBbkM7QUFFRDs7OzZCQUVRO0FBQUEsb0JBQ3dDLEtBQUtMLEtBRDdDO0FBQUEsVUFDQXpCLEVBREEsV0FDQUEsRUFEQTtBQUFBLFVBQ0lHLEtBREosV0FDSUEsS0FESjtBQUFBLFVBQ1dFLE1BRFgsV0FDV0EsTUFEWDtBQUFBLFVBQ21CRyxVQURuQixXQUNtQkEsVUFEbkI7QUFBQSxVQUMrQkYsS0FEL0IsV0FDK0JBLEtBRC9COztBQUVQLGFBQU8sMEJBQWMsUUFBZCxFQUF3QjtBQUM3QndDLGFBQUssU0FEd0I7QUFFN0JDLGFBQUssU0FGd0I7QUFHN0IvQyxjQUg2QjtBQUk3QkcsZUFBT0EsUUFBUUssVUFKYztBQUs3QkgsZ0JBQVFBLFNBQVNHLFVBTFk7QUFNN0JGLGVBQU80QixPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQjdCLEtBQWxCLEVBQXlCLEVBQUNILFlBQUQsRUFBUUUsY0FBUixFQUF6QjtBQU5zQixPQUF4QixDQUFQO0FBUUQ7Ozs7RUF2SHdDLGdCQUFNMkMsUzs7a0JBQTVCeEIsYTs7O0FBMEhyQkEsY0FBY3pCLFNBQWQsR0FBMEJBLFNBQTFCO0FBQ0F5QixjQUFjSCxZQUFkLEdBQTZCQSxZQUE3QiIsImZpbGUiOiJ3ZWJnbC1yZW5kZXJlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbi8qIGdsb2JhbCB3aW5kb3cgKi9cbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlcywgY3JlYXRlRWxlbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGF1dG9iaW5kIGZyb20gJy4vYXV0b2JpbmQnO1xuaW1wb3J0IHtjcmVhdGVHTENvbnRleHR9IGZyb20gJ2x1bWEuZ2wnO1xuLyogZ2xvYmFsIHJlcXVlc3RBbmltYXRpb25GcmFtZSwgY2FuY2VsQW5pbWF0aW9uRnJhbWUgKi9cblxuY29uc3QgREVGQVVMVF9QSVhFTF9SQVRJTyA9XG4gICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbykgfHwgMTtcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuXG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGhlaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcblxuICBwaXhlbFJhdGlvOiBQcm9wVHlwZXMubnVtYmVyLFxuICB2aWV3cG9ydDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBldmVudHM6IFByb3BUeXBlcy5vYmplY3QsXG4gIGdsOiBQcm9wVHlwZXMub2JqZWN0LFxuICBnbE9wdGlvbnM6IFByb3BUeXBlcy5vYmplY3QsXG4gIGRlYnVnOiBQcm9wVHlwZXMuYm9vbCxcblxuICBvbkluaXRpYWxpemF0aW9uRmFpbGVkOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25SZW5kZXJlckluaXRpYWxpemVkOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBvblJlbmRlckZyYW1lOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Nb3VzZU1vdmU6IFByb3BUeXBlcy5mdW5jLFxuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBzdHlsZToge30sXG4gIGdsOiBudWxsLFxuICBnbE9wdGlvbnM6IHtwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRydWV9LFxuICBkZWJ1ZzogZmFsc2UsXG4gIHBpeGVsUmF0aW86IERFRkFVTFRfUElYRUxfUkFUSU8sXG5cbiAgb25Jbml0aWFsaXphdGlvbkZhaWxlZDogZXJyb3IgPT4ge1xuICAgIHRocm93IGVycm9yO1xuICB9LFxuICBvblJlbmRlcmVySW5pdGlhbGl6ZWQ6ICgpID0+IHt9LFxuICBvblJlbmRlckZyYW1lOiAoKSA9PiB7fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViR0xSZW5kZXJlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIC8qKlxuICAgKiBAY2xhc3NkZXNjXG4gICAqIFNtYWxsIHJlYWN0IGNvbXBvbmVudCB0aGF0IHVzZXMgTHVtYS5HTCB0byBpbml0aWFsaXplIGEgV2ViR0wgY29udGV4dC5cbiAgICpcbiAgICogUmV0dXJucyBhIGNhbnZhcywgY3JlYXRlcyBhIGJhc2ljIFdlYkdMIGNvbnRleHRcbiAgICogc2V0cyB1cCBhIHJlbmRlcmxvb3AsIGFuZCByZWdpc3RlcnMgc29tZSBiYXNpYyBldmVudCBoYW5kbGVyc1xuICAgKlxuICAgKiBAY2xhc3NcbiAgICogQHBhcmFtIHtPYmplY3R9IHByb3BzIC0gc2VlIHByb3BUeXBlcyBkb2N1bWVudGF0aW9uXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge307XG4gICAgdGhpcy5fYW5pbWF0aW9uRnJhbWUgPSBudWxsO1xuICAgIHRoaXMuZ2wgPSBudWxsO1xuICAgIGF1dG9iaW5kKHRoaXMpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5yZWZzLm92ZXJsYXk7XG4gICAgdGhpcy5faW5pdFdlYkdMKGNhbnZhcyk7XG4gICAgdGhpcy5fYW5pbWF0aW9uTG9vcCgpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5fY2FuY2VsQW5pbWF0aW9uTG9vcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgTHVtYUdMIGxpYnJhcnkgYW5kIHRocm91Z2ggaXQgV2ViR0xcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbnZhc1xuICAgKi9cbiAgX2luaXRXZWJHTChjYW52YXMpIHtcbiAgICBjb25zdCB7ZGVidWcsIGdsT3B0aW9uc30gPSB0aGlzLnByb3BzO1xuXG4gICAgLy8gQ3JlYXRlIGNvbnRleHQgaWYgbm90IHN1cHBsaWVkXG4gICAgbGV0IGdsID0gdGhpcy5wcm9wcy5nbDtcbiAgICBpZiAoIWdsKSB7XG4gICAgICB0cnkge1xuICAgICAgICBnbCA9IGNyZWF0ZUdMQ29udGV4dChPYmplY3QuYXNzaWduKHtjYW52YXMsIGRlYnVnfSwgZ2xPcHRpb25zKSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICB0aGlzLnByb3BzLm9uSW5pdGlhbGl6YXRpb25GYWlsZWQoZXJyb3IpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5nbCA9IGdsO1xuXG4gICAgLy8gQ2FsbCBjYWxsYmFjayBsYXN0LCBpbiBjYXNlIGl0IHRocm93c1xuICAgIHRoaXMucHJvcHMub25SZW5kZXJlckluaXRpYWxpemVkKHtjYW52YXMsIGdsfSk7XG4gIH1cblxuICAvKipcbiAgICogTWFpbiBXZWJHTCBhbmltYXRpb24gbG9vcFxuICAgKi9cbiAgX2FuaW1hdGlvbkxvb3AoKSB7XG4gICAgdGhpcy5fcmVuZGVyRnJhbWUoKTtcbiAgICAvLyBLZWVwIHJlZ2lzdGVyaW5nIG91cnNlbHZlcyBmb3IgdGhlIG5leHQgYW5pbWF0aW9uIGZyYW1lXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLl9hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9hbmltYXRpb25Mb29wKTtcbiAgICB9XG4gIH1cblxuICBfY2FuY2VsQW5pbWF0aW9uTG9vcCgpIHtcbiAgICBpZiAodGhpcy5fYW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuX2FuaW1hdGlvbkZyYW1lKTtcbiAgICB9XG4gIH1cblxuICAvLyBVcGRhdGVzIFdlYkdMIHZpZXdwb3J0IHRvIGxhdGVzdCBwcm9wc1xuICAvLyBmb3IgY2xlYW4gbG9nZ2luZywgb25seSBjYWxscyBnbC52aWV3cG9ydCBpZiBwcm9wcyBoYXZlIGNoYW5nZWRcbiAgX3VwZGF0ZUdMVmlld3BvcnQoKSB7XG4gICAgbGV0IHt2aWV3cG9ydDoge3gsIHksIHdpZHRoOiB3LCBoZWlnaHQ6IGh9fSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge3BpeGVsUmF0aW86IGRwcn0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtnbH0gPSB0aGlzO1xuXG4gICAgeCA9IHggKiBkcHI7XG4gICAgeSA9IHkgKiBkcHI7XG4gICAgdyA9IHcgKiBkcHI7XG4gICAgaCA9IGggKiBkcHI7XG5cbiAgICBpZiAoeCAhPT0gdGhpcy54IHx8IHkgIT09IHRoaXMueSB8fCB3ICE9PSB0aGlzLncgfHwgaCAhPT0gdGhpcy5oKSB7XG4gICAgICBnbC52aWV3cG9ydCh4LCB5LCB3LCBoKTtcbiAgICAgIHRoaXMueCA9IHg7XG4gICAgICB0aGlzLnkgPSB5O1xuICAgICAgdGhpcy53ID0gdztcbiAgICAgIHRoaXMuaCA9IGg7XG4gICAgfVxuICB9XG5cbiAgX3JlbmRlckZyYW1lKCkge1xuICAgIGNvbnN0IHt2aWV3cG9ydDoge3dpZHRoLCBoZWlnaHR9fSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge2dsfSA9IHRoaXM7XG5cbiAgICAvLyBDaGVjayBmb3IgcmVhc29ucyBub3QgdG8gZHJhd1xuICAgIGlmICghZ2wgfHwgISh3aWR0aCA+IDApIHx8ICEoaGVpZ2h0ID4gMCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl91cGRhdGVHTFZpZXdwb3J0KCk7XG5cbiAgICAvLyBDYWxsIHJlbmRlciBjYWxsYmFja1xuICAgIHRoaXMucHJvcHMub25SZW5kZXJGcmFtZSh7Z2x9KTtcblxuICAgIHRoaXMucHJvcHMub25BZnRlclJlbmRlcih0aGlzLnJlZnMub3ZlcmxheSk7XG5cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7aWQsIHdpZHRoLCBoZWlnaHQsIHBpeGVsUmF0aW8sIHN0eWxlfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIGNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycsIHtcbiAgICAgIHJlZjogJ292ZXJsYXknLFxuICAgICAga2V5OiAnb3ZlcmxheScsXG4gICAgICBpZCxcbiAgICAgIHdpZHRoOiB3aWR0aCAqIHBpeGVsUmF0aW8sXG4gICAgICBoZWlnaHQ6IGhlaWdodCAqIHBpeGVsUmF0aW8sXG4gICAgICBzdHlsZTogT2JqZWN0LmFzc2lnbih7fSwgc3R5bGUsIHt3aWR0aCwgaGVpZ2h0fSlcbiAgICB9KTtcbiAgfVxufVxuXG5XZWJHTFJlbmRlcmVyLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbldlYkdMUmVuZGVyZXIuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuIl19