'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class, _class2, _temp; // Copyright (c) 2015 Uber Technologies, Inc.

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

// Portions of the code below originally from:
// https://github.com/mapbox/mapbox-gl-js/blob/master/js/ui/handler/scroll_zoom.js


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _document = require('global/document');

var _document2 = _interopRequireDefault(_document);

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function noop() {}

var ua = typeof _window2.default.navigator !== 'undefined' ? _window2.default.navigator.userAgent.toLowerCase() : '';
var firefox = ua.indexOf('firefox') !== -1;

// Extract a position from a mouse event
function getMousePosition(el, event) {
  var rect = el.getBoundingClientRect();
  event = event.touches ? event.touches[0] : event;
  return [event.clientX - rect.left - el.clientLeft, event.clientY - rect.top - el.clientTop];
}

// Extract an array of touch positions from a touch event
function getTouchPositions(el, event) {
  var points = [];
  var rect = el.getBoundingClientRect();
  var touches = getTouches(event);
  for (var i = 0; i < touches.length; i++) {
    points.push([touches[i].clientX - rect.left - el.clientLeft, touches[i].clientY - rect.top - el.clientTop]);
  }
  return points;
}

// Get relevant touches from event depending on event type (for `touchend` and
// `touchcancel` the property `changedTouches` contains the relevant coordinates)
function getTouches(event) {
  var type = event.type;
  if (type === 'touchend' || type === 'touchcancel') {
    return event.changedTouches;
  }
  return event.touches;
}

// Return the centroid of an array of points
function centroid(positions) {
  var sum = positions.reduce(function (acc, elt) {
    return [acc[0] + elt[0], acc[1] + elt[1]];
  }, [0, 0]);
  return [sum[0] / positions.length, sum[1] / positions.length];
}

var Interactions = (_class = (_temp = _class2 = function (_Component) {
  _inherits(Interactions, _Component);

  function Interactions(props) {
    _classCallCheck(this, Interactions);

    var _this = _possibleConstructorReturn(this, (Interactions.__proto__ || Object.getPrototypeOf(Interactions)).call(this, props));

    _this.state = {
      didDrag: false,
      isFunctionKeyPressed: false,
      startPos: null,
      pos: null,
      mouseWheelPos: null
    };
    return _this;
  }

  _createClass(Interactions, [{
    key: '_getMousePos',
    value: function _getMousePos(event) {
      var el = this.refs.container;
      return getMousePosition(el, event);
    }
  }, {
    key: '_getTouchPos',
    value: function _getTouchPos(event) {
      var el = this.refs.container;
      var positions = getTouchPositions(el, event);
      return centroid(positions);
    }
  }, {
    key: '_isFunctionKeyPressed',
    value: function _isFunctionKeyPressed(event) {
      return Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
    }
  }, {
    key: '_onMouseDown',
    value: function _onMouseDown(event) {
      var pos = this._getMousePos(event);
      this.setState({
        didDrag: false,
        startPos: pos,
        pos: pos,
        isFunctionKeyPressed: this._isFunctionKeyPressed(event)
      });
      this.props.onMouseDown({ pos: pos });
      _document2.default.addEventListener('mousemove', this._onMouseDrag, false);
      _document2.default.addEventListener('mouseup', this._onMouseUp, false);
    }
  }, {
    key: '_onTouchStart',
    value: function _onTouchStart(event) {
      var pos = this._getTouchPos(event);
      this.setState({
        didDrag: false,
        startPos: pos,
        pos: pos,
        isFunctionKeyPressed: this._isFunctionKeyPressed(event)
      });
      this.props.onTouchStart({ pos: pos });
      _document2.default.addEventListener('touchmove', this._onTouchDrag, false);
      _document2.default.addEventListener('touchend', this._onTouchEnd, false);
    }
  }, {
    key: '_onMouseDrag',
    value: function _onMouseDrag(event) {
      var pos = this._getMousePos(event);
      this.setState({ pos: pos, didDrag: true });
      if (this.state.isFunctionKeyPressed) {
        var startPos = this.state.startPos;

        this.props.onMouseRotate({ pos: pos, startPos: startPos });
      } else {
        this.props.onMouseDrag({ pos: pos });
      }
    }
  }, {
    key: '_onTouchDrag',
    value: function _onTouchDrag(event) {
      var pos = this._getTouchPos(event);
      this.setState({ pos: pos, didDrag: true });
      if (this.state.isFunctionKeyPressed) {
        var startPos = this.state.startPos;

        this.props.onTouchRotate({ pos: pos, startPos: startPos });
      } else {
        this.props.onTouchDrag({ pos: pos });
      }
      event.preventDefault();
    }
  }, {
    key: '_onMouseUp',
    value: function _onMouseUp(event) {
      _document2.default.removeEventListener('mousemove', this._onMouseDrag, false);
      _document2.default.removeEventListener('mouseup', this._onMouseUp, false);
      var pos = this._getMousePos(event);
      this.setState({ pos: pos });
      this.props.onMouseUp({ pos: pos });
      if (!this.state.didDrag) {
        this.props.onMouseClick({ pos: pos });
      }
    }
  }, {
    key: '_onTouchEnd',
    value: function _onTouchEnd(event) {
      _document2.default.removeEventListener('touchmove', this._onTouchDrag, false);
      _document2.default.removeEventListener('touchend', this._onTouchEnd, false);
      var pos = this._getTouchPos(event);
      this.setState({ pos: pos });
      this.props.onTouchEnd({ pos: pos });
      if (!this.state.didDrag) {
        this.props.onTouchTap({ pos: pos });
      }
    }
  }, {
    key: '_onMouseMove',
    value: function _onMouseMove(event) {
      var pos = this._getMousePos(event);
      this.props.onMouseMove({ pos: pos });
    }

    /* eslint-disable complexity, max-statements */

  }, {
    key: '_onWheel',
    value: function _onWheel(event) {
      event.preventDefault();
      var value = event.deltaY;
      // Firefox doubles the values on retina screens...
      if (firefox && event.deltaMode === _window2.default.WheelEvent.DOM_DELTA_PIXEL) {
        value /= _window2.default.devicePixelRatio;
      }
      if (event.deltaMode === _window2.default.WheelEvent.DOM_DELTA_LINE) {
        value *= 40;
      }

      var type = this.state.mouseWheelType;
      var timeout = this.state.mouseWheelTimeout;
      var lastValue = this.state.mouseWheelLastValue;
      var time = this.state.mouseWheelTime;

      var now = (_window2.default.performance || Date).now();
      var timeDelta = now - (time || 0);

      var pos = this._getMousePos(event);
      time = now;

      if (value !== 0 && value % 4.000244140625 === 0) {
        // This one is definitely a mouse wheel event.
        type = 'wheel';
        // Normalize this value to match trackpad.
        value = Math.floor(value / 4);
      } else if (value !== 0 && Math.abs(value) < 4) {
        // This one is definitely a trackpad event because it is so small.
        type = 'trackpad';
      } else if (timeDelta > 400) {
        // This is likely a new scroll action.
        type = null;
        lastValue = value;

        // Start a timeout in case this was a singular event, and delay it by up
        // to 40ms.
        timeout = _window2.default.setTimeout(function setTimeout() {
          var _type = 'wheel';
          this._zoom(-this.state.mouseWheelLastValue, this.state.mouseWheelPos);
          this.setState({ mouseWheelType: _type });
        }.bind(this), 40);
      } else if (!this._type) {
        // This is a repeating event, but we don't know the type of event just
        // yet.
        // If the delta per time is small, we assume it's a fast trackpad;
        // otherwise we switch into wheel mode.
        type = Math.abs(timeDelta * value) < 200 ? 'trackpad' : 'wheel';

        // Make sure our delayed event isn't fired again, because we accumulate
        // the previous event (which was less than 40ms ago) into this event.
        if (timeout) {
          _window2.default.clearTimeout(timeout);
          timeout = null;
          value += lastValue;
        }
      }

      // Slow down zoom if shift key is held for more precise zooming
      if (event.shiftKey && value) {
        value = value / 4;
      }

      // Only fire the callback if we actually know what type of scrolling device
      // the user uses.
      if (type) {
        this._zoom(-value, pos);
      }

      this.setState({
        mouseWheelTime: time,
        mouseWheelPos: pos,
        mouseWheelType: type,
        mouseWheelTimeout: timeout,
        mouseWheelLastValue: lastValue
      });
    }
    /* eslint-enable complexity, max-statements */

  }, {
    key: '_zoom',
    value: function _zoom(delta, pos) {
      // Scale by sigmoid of scroll wheel delta.
      var scale = 2 / (1 + Math.exp(-Math.abs(delta / 100)));
      if (delta < 0 && scale !== 0) {
        scale = 1 / scale;
      }
      this.props.onZoom({ pos: pos, scale: scale });
      _window2.default.clearTimeout(this._zoomEndTimeout);
      this._zoomEndTimeout = _window2.default.setTimeout(function _setTimeout() {
        this.props.onZoomEnd();
      }.bind(this), 200);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        {
          ref: 'container',
          onMouseMove: this._onMouseMove,
          onMouseDown: this._onMouseDown,
          onTouchStart: this._onTouchStart,
          onContextMenu: this._onMouseDown,
          onWheel: this._onWheel,
          style: {
            width: this.props.width,
            height: this.props.height,
            position: 'relative'
          } },
        this.props.children
      );
    }
  }]);

  return Interactions;
}(_react.Component), _class2.displayName = 'Interactions', _class2.propTypes = {
  width: _react.PropTypes.number.isRequired,
  height: _react.PropTypes.number.isRequired,
  onMouseDown: _react.PropTypes.func,
  onMouseDrag: _react.PropTypes.func,
  onMouseRotate: _react.PropTypes.func,
  onMouseUp: _react.PropTypes.func,
  onMouseMove: _react.PropTypes.func,
  onMouseClick: _react.PropTypes.func,
  onTouchStart: _react.PropTypes.func,
  onTouchDrag: _react.PropTypes.func,
  onTouchRotate: _react.PropTypes.func,
  onTouchEnd: _react.PropTypes.func,
  onTouchTap: _react.PropTypes.func,
  onZoom: _react.PropTypes.func,
  onZoomEnd: _react.PropTypes.func
}, _class2.defaultProps = {
  onMouseDown: noop,
  onMouseDrag: noop,
  onMouseRotate: noop,
  onMouseUp: noop,
  onMouseMove: noop,
  onMouseClick: noop,
  onTouchStart: noop,
  onTouchDrag: noop,
  onTouchRotate: noop,
  onTouchEnd: noop,
  onTouchTap: noop,
  onZoom: noop,
  onZoomEnd: noop
}, _temp), (_applyDecoratedDescriptor(_class.prototype, '_onMouseDown', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseDown'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onTouchStart', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onTouchStart'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onMouseDrag', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseDrag'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onTouchDrag', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onTouchDrag'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onMouseUp', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseUp'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onTouchEnd', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onTouchEnd'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onMouseMove', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseMove'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onWheel', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onWheel'), _class.prototype)), _class);
exports.default = Interactions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXAtaW50ZXJhY3Rpb25zLnJlYWN0LmpzIl0sIm5hbWVzIjpbIm5vb3AiLCJ1YSIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInRvTG93ZXJDYXNlIiwiZmlyZWZveCIsImluZGV4T2YiLCJnZXRNb3VzZVBvc2l0aW9uIiwiZWwiLCJldmVudCIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3VjaGVzIiwiY2xpZW50WCIsImxlZnQiLCJjbGllbnRMZWZ0IiwiY2xpZW50WSIsInRvcCIsImNsaWVudFRvcCIsImdldFRvdWNoUG9zaXRpb25zIiwicG9pbnRzIiwiZ2V0VG91Y2hlcyIsImkiLCJsZW5ndGgiLCJwdXNoIiwidHlwZSIsImNoYW5nZWRUb3VjaGVzIiwiY2VudHJvaWQiLCJwb3NpdGlvbnMiLCJzdW0iLCJyZWR1Y2UiLCJhY2MiLCJlbHQiLCJJbnRlcmFjdGlvbnMiLCJwcm9wcyIsInN0YXRlIiwiZGlkRHJhZyIsImlzRnVuY3Rpb25LZXlQcmVzc2VkIiwic3RhcnRQb3MiLCJwb3MiLCJtb3VzZVdoZWVsUG9zIiwicmVmcyIsImNvbnRhaW5lciIsIkJvb2xlYW4iLCJtZXRhS2V5IiwiYWx0S2V5IiwiY3RybEtleSIsInNoaWZ0S2V5IiwiX2dldE1vdXNlUG9zIiwic2V0U3RhdGUiLCJfaXNGdW5jdGlvbktleVByZXNzZWQiLCJvbk1vdXNlRG93biIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25Nb3VzZURyYWciLCJfb25Nb3VzZVVwIiwiX2dldFRvdWNoUG9zIiwib25Ub3VjaFN0YXJ0IiwiX29uVG91Y2hEcmFnIiwiX29uVG91Y2hFbmQiLCJvbk1vdXNlUm90YXRlIiwib25Nb3VzZURyYWciLCJvblRvdWNoUm90YXRlIiwib25Ub3VjaERyYWciLCJwcmV2ZW50RGVmYXVsdCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJvbk1vdXNlVXAiLCJvbk1vdXNlQ2xpY2siLCJvblRvdWNoRW5kIiwib25Ub3VjaFRhcCIsIm9uTW91c2VNb3ZlIiwidmFsdWUiLCJkZWx0YVkiLCJkZWx0YU1vZGUiLCJXaGVlbEV2ZW50IiwiRE9NX0RFTFRBX1BJWEVMIiwiZGV2aWNlUGl4ZWxSYXRpbyIsIkRPTV9ERUxUQV9MSU5FIiwibW91c2VXaGVlbFR5cGUiLCJ0aW1lb3V0IiwibW91c2VXaGVlbFRpbWVvdXQiLCJsYXN0VmFsdWUiLCJtb3VzZVdoZWVsTGFzdFZhbHVlIiwidGltZSIsIm1vdXNlV2hlZWxUaW1lIiwibm93IiwicGVyZm9ybWFuY2UiLCJEYXRlIiwidGltZURlbHRhIiwiTWF0aCIsImZsb29yIiwiYWJzIiwic2V0VGltZW91dCIsIl90eXBlIiwiX3pvb20iLCJiaW5kIiwiY2xlYXJUaW1lb3V0IiwiZGVsdGEiLCJzY2FsZSIsImV4cCIsIm9uWm9vbSIsIl96b29tRW5kVGltZW91dCIsIl9zZXRUaW1lb3V0Iiwib25ab29tRW5kIiwiX29uTW91c2VNb3ZlIiwiX29uTW91c2VEb3duIiwiX29uVG91Y2hTdGFydCIsIl9vbldoZWVsIiwid2lkdGgiLCJoZWlnaHQiLCJwb3NpdGlvbiIsImNoaWxkcmVuIiwiZGlzcGxheU5hbWUiLCJwcm9wVHlwZXMiLCJudW1iZXIiLCJpc1JlcXVpcmVkIiwiZnVuYyIsImRlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OzJDQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLFNBQVNBLElBQVQsR0FBZ0IsQ0FBRTs7QUFFbEIsSUFBTUMsS0FBSyxPQUFPLGlCQUFPQyxTQUFkLEtBQTRCLFdBQTVCLEdBQ1QsaUJBQU9BLFNBQVAsQ0FBaUJDLFNBQWpCLENBQTJCQyxXQUEzQixFQURTLEdBQ2tDLEVBRDdDO0FBRUEsSUFBTUMsVUFBVUos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SUFQTTtBQVFwQjhELGVBQWE5RCxJQVJPO0FBU3BCNkQsaUJBQWU3RCxJQVRLO0FBVXBCbUUsY0FBWW5FLElBVlE7QUFXcEJvRSxjQUFZcEUsSUFYUTtBQVlwQm1HLFVBQVFuRyxJQVpZO0FBYXBCc0csYUFBV3RHO0FBYlMsQztrQkF0QkhpQyxZIiwiZmlsZSI6Im1hcC1pbnRlcmFjdGlvbnMucmVhY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cblxuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG4vLyBQb3J0aW9ucyBvZiB0aGUgY29kZSBiZWxvdyBvcmlnaW5hbGx5IGZyb206XG4vLyBodHRwczovL2dpdGh1Yi5jb20vbWFwYm94L21hcGJveC1nbC1qcy9ibG9iL21hc3Rlci9qcy91aS9oYW5kbGVyL3Njcm9sbF96b29tLmpzXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXMsIENvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGF1dG9iaW5kIGZyb20gJ2F1dG9iaW5kLWRlY29yYXRvcic7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5jb25zdCB1YSA9IHR5cGVvZiB3aW5kb3cubmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyA/XG4gIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkgOiAnJztcbmNvbnN0IGZpcmVmb3ggPSB1YS5pbmRleE9mKCdmaXJlZm94JykgIT09IC0xO1xuXG4vLyBFeHRyYWN0IGEgcG9zaXRpb24gZnJvbSBhIG1vdXNlIGV2ZW50XG5mdW5jdGlvbiBnZXRNb3VzZVBvc2l0aW9uKGVsLCBldmVudCkge1xuICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGV2ZW50ID0gZXZlbnQudG91Y2hlcyA/IGV2ZW50LnRvdWNoZXNbMF0gOiBldmVudDtcbiAgcmV0dXJuIFtcbiAgICBldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0IC0gZWwuY2xpZW50TGVmdCxcbiAgICBldmVudC5jbGllbnRZIC0gcmVjdC50b3AgLSBlbC5jbGllbnRUb3BcbiAgXTtcbn1cblxuLy8gRXh0cmFjdCBhbiBhcnJheSBvZiB0b3VjaCBwb3NpdGlvbnMgZnJvbSBhIHRvdWNoIGV2ZW50XG5mdW5jdGlvbiBnZXRUb3VjaFBvc2l0aW9ucyhlbCwgZXZlbnQpIHtcbiAgY29uc3QgcG9pbnRzID0gW107XG4gIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3QgdG91Y2hlcyA9IGdldFRvdWNoZXMoZXZlbnQpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICBwb2ludHMucHVzaChbXG4gICAgICB0b3VjaGVzW2ldLmNsaWVudFggLSByZWN0LmxlZnQgLSBlbC5jbGllbnRMZWZ0LFxuICAgICAgdG91Y2hlc1tpXS5jbGllbnRZIC0gcmVjdC50b3AgLSBlbC5jbGllbnRUb3BcbiAgICBdKTtcbiAgfVxuICByZXR1cm4gcG9pbnRzO1xufVxuXG4vLyBHZXQgcmVsZXZhbnQgdG91Y2hlcyBmcm9tIGV2ZW50IGRlcGVuZGluZyBvbiBldmVudCB0eXBlIChmb3IgYHRvdWNoZW5kYCBhbmRcbi8vIGB0b3VjaGNhbmNlbGAgdGhlIHByb3BlcnR5IGBjaGFuZ2VkVG91Y2hlc2AgY29udGFpbnMgdGhlIHJlbGV2YW50IGNvb3JkaW5hdGVzKVxuZnVuY3Rpb24gZ2V0VG91Y2hlcyhldmVudCkge1xuICBjb25zdCB0eXBlID0gZXZlbnQudHlwZTtcbiAgaWYgKHR5cGUgPT09ICd0b3VjaGVuZCcgfHwgdHlwZSA9PT0gJ3RvdWNoY2FuY2VsJykge1xuICAgIHJldHVybiBldmVudC5jaGFuZ2VkVG91Y2hlcztcbiAgfVxuICByZXR1cm4gZXZlbnQudG91Y2hlcztcbn1cblxuLy8gUmV0dXJuIHRoZSBjZW50cm9pZCBvZiBhbiBhcnJheSBvZiBwb2ludHNcbmZ1bmN0aW9uIGNlbnRyb2lkKHBvc2l0aW9ucykge1xuICBjb25zdCBzdW0gPSBwb3NpdGlvbnMucmVkdWNlKFxuICAgIChhY2MsIGVsdCkgPT4gW2FjY1swXSArIGVsdFswXSwgYWNjWzFdICsgZWx0WzFdXSxcbiAgICBbMCwgMF1cbiAgKTtcbiAgcmV0dXJuIFtzdW1bMF0gLyBwb3NpdGlvbnMubGVuZ3RoLCBzdW1bMV0gLyBwb3NpdGlvbnMubGVuZ3RoXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW50ZXJhY3Rpb25zIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICBzdGF0aWMgZGlzcGxheU5hbWUgPSAnSW50ZXJhY3Rpb25zJztcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgb25Nb3VzZURvd246IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uTW91c2VEcmFnOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbk1vdXNlUm90YXRlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbk1vdXNlVXA6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uTW91c2VNb3ZlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbk1vdXNlQ2xpY2s6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uVG91Y2hTdGFydDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25Ub3VjaERyYWc6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uVG91Y2hSb3RhdGU6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uVG91Y2hFbmQ6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uVG91Y2hUYXA6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uWm9vbTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25ab29tRW5kOiBQcm9wVHlwZXMuZnVuY1xuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgb25Nb3VzZURvd246IG5vb3AsXG4gICAgb25Nb3VzZURyYWc6IG5vb3AsXG4gICAgb25Nb3VzZVJvdGF0ZTogbm9vcCxcbiAgICBvbk1vdXNlVXA6IG5vb3AsXG4gICAgb25Nb3VzZU1vdmU6IG5vb3AsXG4gICAgb25Nb3VzZUNsaWNrOiBub29wLFxuICAgIG9uVG91Y2hTdGFydDogbm9vcCxcbiAgICBvblRvdWNoRHJhZzogbm9vcCxcbiAgICBvblRvdWNoUm90YXRlOiBub29wLFxuICAgIG9uVG91Y2hFbmQ6IG5vb3AsXG4gICAgb25Ub3VjaFRhcDogbm9vcCxcbiAgICBvblpvb206IG5vb3AsXG4gICAgb25ab29tRW5kOiBub29wXG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGRpZERyYWc6IGZhbHNlLFxuICAgICAgaXNGdW5jdGlvbktleVByZXNzZWQ6IGZhbHNlLFxuICAgICAgc3RhcnRQb3M6IG51bGwsXG4gICAgICBwb3M6IG51bGwsXG4gICAgICBtb3VzZVdoZWVsUG9zOiBudWxsXG4gICAgfTtcbiAgfVxuXG4gIF9nZXRNb3VzZVBvcyhldmVudCkge1xuICAgIGNvbnN0IGVsID0gdGhpcy5yZWZzLmNvbnRhaW5lcjtcbiAgICByZXR1cm4gZ2V0TW91c2VQb3NpdGlvbihlbCwgZXZlbnQpO1xuICB9XG5cbiAgX2dldFRvdWNoUG9zKGV2ZW50KSB7XG4gICAgY29uc3QgZWwgPSB0aGlzLnJlZnMuY29udGFpbmVyO1xuICAgIGNvbnN0IHBvc2l0aW9ucyA9IGdldFRvdWNoUG9zaXRpb25zKGVsLCBldmVudCk7XG4gICAgcmV0dXJuIGNlbnRyb2lkKHBvc2l0aW9ucyk7XG4gIH1cblxuICBfaXNGdW5jdGlvbktleVByZXNzZWQoZXZlbnQpIHtcbiAgICByZXR1cm4gQm9vbGVhbihldmVudC5tZXRhS2V5IHx8IGV2ZW50LmFsdEtleSB8fFxuICAgICAgZXZlbnQuY3RybEtleSB8fCBldmVudC5zaGlmdEtleSk7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgX29uTW91c2VEb3duKGV2ZW50KSB7XG4gICAgY29uc3QgcG9zID0gdGhpcy5fZ2V0TW91c2VQb3MoZXZlbnQpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZGlkRHJhZzogZmFsc2UsXG4gICAgICBzdGFydFBvczogcG9zLFxuICAgICAgcG9zLFxuICAgICAgaXNGdW5jdGlvbktleVByZXNzZWQ6IHRoaXMuX2lzRnVuY3Rpb25LZXlQcmVzc2VkKGV2ZW50KVxuICAgIH0pO1xuICAgIHRoaXMucHJvcHMub25Nb3VzZURvd24oe3Bvc30pO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX29uTW91c2VEcmFnLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX29uTW91c2VVcCwgZmFsc2UpO1xuICB9XG5cbiAgQGF1dG9iaW5kXG4gIF9vblRvdWNoU3RhcnQoZXZlbnQpIHtcbiAgICBjb25zdCBwb3MgPSB0aGlzLl9nZXRUb3VjaFBvcyhldmVudCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBkaWREcmFnOiBmYWxzZSxcbiAgICAgIHN0YXJ0UG9zOiBwb3MsXG4gICAgICBwb3MsXG4gICAgICBpc0Z1bmN0aW9uS2V5UHJlc3NlZDogdGhpcy5faXNGdW5jdGlvbktleVByZXNzZWQoZXZlbnQpXG4gICAgfSk7XG4gICAgdGhpcy5wcm9wcy5vblRvdWNoU3RhcnQoe3Bvc30pO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX29uVG91Y2hEcmFnLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl9vblRvdWNoRW5kLCBmYWxzZSk7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgX29uTW91c2VEcmFnKGV2ZW50KSB7XG4gICAgY29uc3QgcG9zID0gdGhpcy5fZ2V0TW91c2VQb3MoZXZlbnQpO1xuICAgIHRoaXMuc2V0U3RhdGUoe3BvcywgZGlkRHJhZzogdHJ1ZX0pO1xuICAgIGlmICh0aGlzLnN0YXRlLmlzRnVuY3Rpb25LZXlQcmVzc2VkKSB7XG4gICAgICBjb25zdCB7c3RhcnRQb3N9ID0gdGhpcy5zdGF0ZTtcbiAgICAgIHRoaXMucHJvcHMub25Nb3VzZVJvdGF0ZSh7cG9zLCBzdGFydFBvc30pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb3BzLm9uTW91c2VEcmFnKHtwb3N9KTtcbiAgICB9XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgX29uVG91Y2hEcmFnKGV2ZW50KSB7XG4gICAgY29uc3QgcG9zID0gdGhpcy5fZ2V0VG91Y2hQb3MoZXZlbnQpO1xuICAgIHRoaXMuc2V0U3RhdGUoe3BvcywgZGlkRHJhZzogdHJ1ZX0pO1xuICAgIGlmICh0aGlzLnN0YXRlLmlzRnVuY3Rpb25LZXlQcmVzc2VkKSB7XG4gICAgICBjb25zdCB7c3RhcnRQb3N9ID0gdGhpcy5zdGF0ZTtcbiAgICAgIHRoaXMucHJvcHMub25Ub3VjaFJvdGF0ZSh7cG9zLCBzdGFydFBvc30pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb3BzLm9uVG91Y2hEcmFnKHtwb3N9KTtcbiAgICB9XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBfb25Nb3VzZVVwKGV2ZW50KSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fb25Nb3VzZURyYWcsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fb25Nb3VzZVVwLCBmYWxzZSk7XG4gICAgY29uc3QgcG9zID0gdGhpcy5fZ2V0TW91c2VQb3MoZXZlbnQpO1xuICAgIHRoaXMuc2V0U3RhdGUoe3Bvc30pO1xuICAgIHRoaXMucHJvcHMub25Nb3VzZVVwKHtwb3N9KTtcbiAgICBpZiAoIXRoaXMuc3RhdGUuZGlkRHJhZykge1xuICAgICAgdGhpcy5wcm9wcy5vbk1vdXNlQ2xpY2soe3Bvc30pO1xuICAgIH1cbiAgfVxuXG4gIEBhdXRvYmluZFxuICBfb25Ub3VjaEVuZChldmVudCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX29uVG91Y2hEcmFnLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl9vblRvdWNoRW5kLCBmYWxzZSk7XG4gICAgY29uc3QgcG9zID0gdGhpcy5fZ2V0VG91Y2hQb3MoZXZlbnQpO1xuICAgIHRoaXMuc2V0U3RhdGUoe3Bvc30pO1xuICAgIHRoaXMucHJvcHMub25Ub3VjaEVuZCh7cG9zfSk7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmRpZERyYWcpIHtcbiAgICAgIHRoaXMucHJvcHMub25Ub3VjaFRhcCh7cG9zfSk7XG4gICAgfVxuICB9XG5cbiAgQGF1dG9iaW5kXG4gIF9vbk1vdXNlTW92ZShldmVudCkge1xuICAgIGNvbnN0IHBvcyA9IHRoaXMuX2dldE1vdXNlUG9zKGV2ZW50KTtcbiAgICB0aGlzLnByb3BzLm9uTW91c2VNb3ZlKHtwb3N9KTtcbiAgfVxuXG4gIC8qIGVzbGludC1kaXNhYmxlIGNvbXBsZXhpdHksIG1heC1zdGF0ZW1lbnRzICovXG4gIEBhdXRvYmluZFxuICBfb25XaGVlbChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgbGV0IHZhbHVlID0gZXZlbnQuZGVsdGFZO1xuICAgIC8vIEZpcmVmb3ggZG91YmxlcyB0aGUgdmFsdWVzIG9uIHJldGluYSBzY3JlZW5zLi4uXG4gICAgaWYgKGZpcmVmb3ggJiYgZXZlbnQuZGVsdGFNb2RlID09PSB3aW5kb3cuV2hlZWxFdmVudC5ET01fREVMVEFfUElYRUwpIHtcbiAgICAgIHZhbHVlIC89IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgIH1cbiAgICBpZiAoZXZlbnQuZGVsdGFNb2RlID09PSB3aW5kb3cuV2hlZWxFdmVudC5ET01fREVMVEFfTElORSkge1xuICAgICAgdmFsdWUgKj0gNDA7XG4gICAgfVxuXG4gICAgbGV0IHR5cGUgPSB0aGlzLnN0YXRlLm1vdXNlV2hlZWxUeXBlO1xuICAgIGxldCB0aW1lb3V0ID0gdGhpcy5zdGF0ZS5tb3VzZVdoZWVsVGltZW91dDtcbiAgICBsZXQgbGFzdFZhbHVlID0gdGhpcy5zdGF0ZS5tb3VzZVdoZWVsTGFzdFZhbHVlO1xuICAgIGxldCB0aW1lID0gdGhpcy5zdGF0ZS5tb3VzZVdoZWVsVGltZTtcblxuICAgIGNvbnN0IG5vdyA9ICh3aW5kb3cucGVyZm9ybWFuY2UgfHwgRGF0ZSkubm93KCk7XG4gICAgY29uc3QgdGltZURlbHRhID0gbm93IC0gKHRpbWUgfHwgMCk7XG5cbiAgICBjb25zdCBwb3MgPSB0aGlzLl9nZXRNb3VzZVBvcyhldmVudCk7XG4gICAgdGltZSA9IG5vdztcblxuICAgIGlmICh2YWx1ZSAhPT0gMCAmJiB2YWx1ZSAlIDQuMDAwMjQ0MTQwNjI1ID09PSAwKSB7XG4gICAgICAvLyBUaGlzIG9uZSBpcyBkZWZpbml0ZWx5IGEgbW91c2Ugd2hlZWwgZXZlbnQuXG4gICAgICB0eXBlID0gJ3doZWVsJztcbiAgICAgIC8vIE5vcm1hbGl6ZSB0aGlzIHZhbHVlIHRvIG1hdGNoIHRyYWNrcGFkLlxuICAgICAgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlIC8gNCk7XG4gICAgfSBlbHNlIGlmICh2YWx1ZSAhPT0gMCAmJiBNYXRoLmFicyh2YWx1ZSkgPCA0KSB7XG4gICAgICAvLyBUaGlzIG9uZSBpcyBkZWZpbml0ZWx5IGEgdHJhY2twYWQgZXZlbnQgYmVjYXVzZSBpdCBpcyBzbyBzbWFsbC5cbiAgICAgIHR5cGUgPSAndHJhY2twYWQnO1xuICAgIH0gZWxzZSBpZiAodGltZURlbHRhID4gNDAwKSB7XG4gICAgICAvLyBUaGlzIGlzIGxpa2VseSBhIG5ldyBzY3JvbGwgYWN0aW9uLlxuICAgICAgdHlwZSA9IG51bGw7XG4gICAgICBsYXN0VmFsdWUgPSB2YWx1ZTtcblxuICAgICAgLy8gU3RhcnQgYSB0aW1lb3V0IGluIGNhc2UgdGhpcyB3YXMgYSBzaW5ndWxhciBldmVudCwgYW5kIGRlbGF5IGl0IGJ5IHVwXG4gICAgICAvLyB0byA0MG1zLlxuICAgICAgdGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uIHNldFRpbWVvdXQoKSB7XG4gICAgICAgIGNvbnN0IF90eXBlID0gJ3doZWVsJztcbiAgICAgICAgdGhpcy5fem9vbSgtdGhpcy5zdGF0ZS5tb3VzZVdoZWVsTGFzdFZhbHVlLCB0aGlzLnN0YXRlLm1vdXNlV2hlZWxQb3MpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHttb3VzZVdoZWVsVHlwZTogX3R5cGV9KTtcbiAgICAgIH0uYmluZCh0aGlzKSwgNDApO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuX3R5cGUpIHtcbiAgICAgIC8vIFRoaXMgaXMgYSByZXBlYXRpbmcgZXZlbnQsIGJ1dCB3ZSBkb24ndCBrbm93IHRoZSB0eXBlIG9mIGV2ZW50IGp1c3RcbiAgICAgIC8vIHlldC5cbiAgICAgIC8vIElmIHRoZSBkZWx0YSBwZXIgdGltZSBpcyBzbWFsbCwgd2UgYXNzdW1lIGl0J3MgYSBmYXN0IHRyYWNrcGFkO1xuICAgICAgLy8gb3RoZXJ3aXNlIHdlIHN3aXRjaCBpbnRvIHdoZWVsIG1vZGUuXG4gICAgICB0eXBlID0gTWF0aC5hYnModGltZURlbHRhICogdmFsdWUpIDwgMjAwID8gJ3RyYWNrcGFkJyA6ICd3aGVlbCc7XG5cbiAgICAgIC8vIE1ha2Ugc3VyZSBvdXIgZGVsYXllZCBldmVudCBpc24ndCBmaXJlZCBhZ2FpbiwgYmVjYXVzZSB3ZSBhY2N1bXVsYXRlXG4gICAgICAvLyB0aGUgcHJldmlvdXMgZXZlbnQgKHdoaWNoIHdhcyBsZXNzIHRoYW4gNDBtcyBhZ28pIGludG8gdGhpcyBldmVudC5cbiAgICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICB2YWx1ZSArPSBsYXN0VmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU2xvdyBkb3duIHpvb20gaWYgc2hpZnQga2V5IGlzIGhlbGQgZm9yIG1vcmUgcHJlY2lzZSB6b29taW5nXG4gICAgaWYgKGV2ZW50LnNoaWZ0S2V5ICYmIHZhbHVlKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlIC8gNDtcbiAgICB9XG5cbiAgICAvLyBPbmx5IGZpcmUgdGhlIGNhbGxiYWNrIGlmIHdlIGFjdHVhbGx5IGtub3cgd2hhdCB0eXBlIG9mIHNjcm9sbGluZyBkZXZpY2VcbiAgICAvLyB0aGUgdXNlciB1c2VzLlxuICAgIGlmICh0eXBlKSB7XG4gICAgICB0aGlzLl96b29tKC12YWx1ZSwgcG9zKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vdXNlV2hlZWxUaW1lOiB0aW1lLFxuICAgICAgbW91c2VXaGVlbFBvczogcG9zLFxuICAgICAgbW91c2VXaGVlbFR5cGU6IHR5cGUsXG4gICAgICBtb3VzZVdoZWVsVGltZW91dDogdGltZW91dCxcbiAgICAgIG1vdXNlV2hlZWxMYXN0VmFsdWU6IGxhc3RWYWx1ZVxuICAgIH0pO1xuICB9XG4gIC8qIGVzbGludC1lbmFibGUgY29tcGxleGl0eSwgbWF4LXN0YXRlbWVudHMgKi9cblxuICBfem9vbShkZWx0YSwgcG9zKSB7XG4gICAgLy8gU2NhbGUgYnkgc2lnbW9pZCBvZiBzY3JvbGwgd2hlZWwgZGVsdGEuXG4gICAgbGV0IHNjYWxlID0gMiAvICgxICsgTWF0aC5leHAoLU1hdGguYWJzKGRlbHRhIC8gMTAwKSkpO1xuICAgIGlmIChkZWx0YSA8IDAgJiYgc2NhbGUgIT09IDApIHtcbiAgICAgIHNjYWxlID0gMSAvIHNjYWxlO1xuICAgIH1cbiAgICB0aGlzLnByb3BzLm9uWm9vbSh7cG9zLCBzY2FsZX0pO1xuICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5fem9vbUVuZFRpbWVvdXQpO1xuICAgIHRoaXMuX3pvb21FbmRUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gX3NldFRpbWVvdXQoKSB7XG4gICAgICB0aGlzLnByb3BzLm9uWm9vbUVuZCgpO1xuICAgIH0uYmluZCh0aGlzKSwgMjAwKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICByZWY9XCJjb250YWluZXJcIlxuICAgICAgICBvbk1vdXNlTW92ZT17IHRoaXMuX29uTW91c2VNb3ZlIH1cbiAgICAgICAgb25Nb3VzZURvd249eyB0aGlzLl9vbk1vdXNlRG93biB9XG4gICAgICAgIG9uVG91Y2hTdGFydD17IHRoaXMuX29uVG91Y2hTdGFydCB9XG4gICAgICAgIG9uQ29udGV4dE1lbnU9eyB0aGlzLl9vbk1vdXNlRG93biB9XG4gICAgICAgIG9uV2hlZWw9eyB0aGlzLl9vbldoZWVsIH1cbiAgICAgICAgc3R5bGU9eyB7XG4gICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICB9IH0+XG5cbiAgICAgICAgeyB0aGlzLnByb3BzLmNoaWxkcmVuIH1cblxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIl19