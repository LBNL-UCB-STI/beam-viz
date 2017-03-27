'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lib = require('../../../lib');

var _shaderUtils = require('../../../shader-utils');

var _luma = require('luma.gl');

var _path = require('path');

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

var defaultProps = {
  // @type {number} opts.unitWidth - width of the unit rectangle
  unitWidth: 100,
  // @type {number} opts.unitHeight - height of the unit rectangle
  unitHeight: 100,
  minColor: [0, 0, 0, 255],
  maxColor: [0, 255, 0, 255],
  getPosition: function getPosition(d) {
    return d.position;
  },
  getWeight: function getWeight(d) {
    return 1;
  }
};

var ScreenGridLayer = function (_Layer) {
  _inherits(ScreenGridLayer, _Layer);

  function ScreenGridLayer() {
    _classCallCheck(this, ScreenGridLayer);

    return _possibleConstructorReturn(this, (ScreenGridLayer.__proto__ || Object.getPrototypeOf(ScreenGridLayer)).apply(this, arguments));
  }

  _createClass(ScreenGridLayer, [{
    key: 'getShaders',
    value: function getShaders() {
      return {
        vs: '// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n#define SHADER_NAME grid-layer-vs\n\nattribute vec3 vertices;\nattribute vec3 instancePositions;\nattribute float instanceCount;\nattribute vec3 instancePickingColors;\n\nuniform float maxCount;\nuniform float opacity;\nuniform vec4 minColor;\nuniform vec4 maxColor;\nuniform float renderPickingBuffer;\nuniform vec3 cellScale;\nuniform vec3 selectedPickingColor;\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  vec4 color = mix(minColor, maxColor, instanceCount / maxCount) / 255.;\n\n  vColor = mix(\n    vec4(color.rgb, color.a * opacity),\n    vec4(instancePickingColors / 255., 1.),\n    renderPickingBuffer\n  );\n\n  gl_Position = vec4(instancePositions + vertices * cellScale, 1.);\n}\n',
        fs: '// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* fragment shader for the grid-layer */\n#define SHADER_NAME grid-layer-fs\n\n#ifdef GL_ES\nprecision highp float;\n#endif\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  gl_FragColor = vColor;\n}\n'
      };
    }
  }, {
    key: 'initializeState',
    value: function initializeState() {
      var attributeManager = this.state.attributeManager;
      /* eslint-disable max-len */

      attributeManager.addInstanced({
        instancePositions: { size: 3, update: this.calculateInstancePositions },
        instanceCount: { size: 1, accessor: ['getPosition', 'getWeight'], update: this.calculateInstanceCount }
      });
      /* eslint-disable max-len */

      var gl = this.context.gl;

      this.setState({ model: this.getModel(gl) });
    }
  }, {
    key: 'updateState',
    value: function updateState(_ref) {
      var oldProps = _ref.oldProps,
          props = _ref.props,
          changeFlags = _ref.changeFlags;

      var cellSizeChanged = props.unitWidth !== oldProps.unitWidth || props.unitHeight !== oldProps.unitHeight;

      if (cellSizeChanged || changeFlags.viewportChanged) {
        this.updateCell();
      }
    }
  }, {
    key: 'draw',
    value: function draw(_ref2) {
      var uniforms = _ref2.uniforms;
      var _props = this.props,
          minColor = _props.minColor,
          maxColor = _props.maxColor;
      var _state = this.state,
          model = _state.model,
          cellScale = _state.cellScale,
          maxCount = _state.maxCount;
      var gl = this.context.gl;

      gl.depthMask(true);
      uniforms = Object.assign({}, uniforms, { minColor: minColor, maxColor: maxColor, cellScale: cellScale, maxCount: maxCount });
      model.render(uniforms);
    }
  }, {
    key: 'getModel',
    value: function getModel(gl) {
      var shaders = (0, _shaderUtils.assembleShaders)(gl, this.getShaders());

      return new _luma.Model({
        gl: gl,
        id: this.props.id,
        vs: shaders.vs,
        fs: shaders.fs,
        geometry: new _luma.Geometry({
          drawMode: _luma.GL.TRIANGLE_FAN,
          vertices: new Float32Array([0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0])
        }),
        isInstanced: true
      });
    }
  }, {
    key: 'updateCell',
    value: function updateCell() {
      var _context$viewport = this.context.viewport,
          width = _context$viewport.width,
          height = _context$viewport.height;
      var _props2 = this.props,
          unitWidth = _props2.unitWidth,
          unitHeight = _props2.unitHeight;


      var MARGIN = 2;
      var cellScale = new Float32Array([(unitWidth - MARGIN) / width * 2, -(unitHeight - MARGIN) / height * 2, 1]);
      var numCol = Math.ceil(width / unitWidth);
      var numRow = Math.ceil(height / unitHeight);

      this.setState({
        cellScale: cellScale,
        numCol: numCol,
        numRow: numRow,
        numInstances: numCol * numRow
      });

      var attributeManager = this.state.attributeManager;

      attributeManager.invalidateAll();
    }
  }, {
    key: 'calculateInstancePositions',
    value: function calculateInstancePositions(attribute, _ref3) {
      var numInstances = _ref3.numInstances;
      var _context$viewport2 = this.context.viewport,
          width = _context$viewport2.width,
          height = _context$viewport2.height;
      var _props3 = this.props,
          unitWidth = _props3.unitWidth,
          unitHeight = _props3.unitHeight;
      var numCol = this.state.numCol;
      var value = attribute.value,
          size = attribute.size;


      for (var i = 0; i < numInstances; i++) {
        var x = i % numCol;
        var y = Math.floor(i / numCol);
        value[i * size + 0] = x * unitWidth / width * 2 - 1;
        value[i * size + 1] = 1 - y * unitHeight / height * 2;
        value[i * size + 2] = 0;
      }
    }
  }, {
    key: 'calculateInstanceCount',
    value: function calculateInstanceCount(attribute) {
      var _props4 = this.props,
          data = _props4.data,
          unitWidth = _props4.unitWidth,
          unitHeight = _props4.unitHeight,
          getPosition = _props4.getPosition,
          getWeight = _props4.getWeight;
      var _state2 = this.state,
          numCol = _state2.numCol,
          numRow = _state2.numRow;
      var value = attribute.value;

      var maxCount = 0;

      value.fill(0.0);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var point = _step.value;

          var pixel = this.project(getPosition(point));
          var colId = Math.floor(pixel[0] / unitWidth);
          var rowId = Math.floor(pixel[1] / unitHeight);
          if (colId >= 0 && colId < numCol && rowId >= 0 && rowId < numRow) {
            var i = colId + rowId * numCol;
            value[i] += getWeight(point);
            if (value[i] > maxCount) {
              maxCount = value[i];
            }
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

      this.setState({ maxCount: maxCount });
    }
  }]);

  return ScreenGridLayer;
}(_lib.Layer);

exports.default = ScreenGridLayer;


ScreenGridLayer.layerName = 'ScreenGridLayer';
ScreenGridLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9sYXllcnMvY29yZS9zY3JlZW4tZ3JpZC1sYXllci9zY3JlZW4tZ3JpZC1sYXllci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UHJvcHMiLCJ1bml0V2lkdGgiLCJ1bml0SGVpZ2h0IiwibWluQ29sb3IiLCJtYXhDb2xvciIsImdldFBvc2l0aW9uIiwiZCIsInBvc2l0aW9uIiwiZ2V0V2VpZ2h0IiwiU2NyZWVuR3JpZExheWVyIiwidnMiLCJmcyIsImF0dHJpYnV0ZU1hbmFnZXIiLCJzdGF0ZSIsImFkZEluc3RhbmNlZCIsImluc3RhbmNlUG9zaXRpb25zIiwic2l6ZSIsInVwZGF0ZSIsImNhbGN1bGF0ZUluc3RhbmNlUG9zaXRpb25zIiwiaW5zdGFuY2VDb3VudCIsImFjY2Vzc29yIiwiY2FsY3VsYXRlSW5zdGFuY2VDb3VudCIsImdsIiwiY29udGV4dCIsInNldFN0YXRlIiwibW9kZWwiLCJnZXRNb2RlbCIsIm9sZFByb3BzIiwicHJvcHMiLCJjaGFuZ2VGbGFncyIsImNlbGxTaXplQ2hhbmdlZCIsInZpZXdwb3J0Q2hhbmdlZCIsInVwZGF0ZUNlbGwiLCJ1bmlmb3JtcyIsImNlbGxTY2FsZSIsIm1heENvdW50IiwiZGVwdGhNYXNrIiwiT2JqZWN0IiwiYXNzaWduIiwicmVuZGVyIiwic2hhZGVycyIsImdldFNoYWRlcnMiLCJpZCIsImdlb21ldHJ5IiwiZHJhd01vZGUiLCJUUklBTkdMRV9GQU4iLCJ2ZXJ0aWNlcyIsIkZsb2F0MzJBcnJheSIsImlzSW5zdGFuY2VkIiwidmlld3BvcnQiLCJ3aWR0aCIsImhlaWdodCIsIk1BUkdJTiIsIm51bUNvbCIsIk1hdGgiLCJjZWlsIiwibnVtUm93IiwibnVtSW5zdGFuY2VzIiwiaW52YWxpZGF0ZUFsbCIsImF0dHJpYnV0ZSIsInZhbHVlIiwiaSIsIngiLCJ5IiwiZmxvb3IiLCJkYXRhIiwiZmlsbCIsInBvaW50IiwicGl4ZWwiLCJwcm9qZWN0IiwiY29sSWQiLCJyb3dJZCIsImxheWVy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ZW4tZ3JpZC1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7TGF5ZXJ9IGZyb20gJy4uLy4uLy4uL2xpYic7XG5pbXBvcnQge2Fzc2VtYmxlU2hhZGVyc30gZnJvbSAnLi4vLi4vLi4vc2hhZGVyLXV0aWxzJztcbmltcG9ydCB7R0wsIE1vZGVsLCBHZW9tZXRyeX0gZnJvbSAnbHVtYS5nbCc7XG5pbXBvcnQge3JlYWRGaWxlU3luY30gZnJvbSAnZnMnO1xuaW1wb3J0IHtqb2lufSBmcm9tICdwYXRoJztcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAvLyBAdHlwZSB7bnVtYmVyfSBvcHRzLnVuaXRXaWR0aCAtIHdpZHRoIG9mIHRoZSB1bml0IHJlY3RhbmdsZVxuICB1bml0V2lkdGg6IDEwMCxcbiAgLy8gQHR5cGUge251bWJlcn0gb3B0cy51bml0SGVpZ2h0IC0gaGVpZ2h0IG9mIHRoZSB1bml0IHJlY3RhbmdsZVxuICB1bml0SGVpZ2h0OiAxMDAsXG4gIG1pbkNvbG9yOiBbMCwgMCwgMCwgMjU1XSxcbiAgbWF4Q29sb3I6IFswLCAyNTUsIDAsIDI1NV0sXG4gIGdldFBvc2l0aW9uOiBkID0+IGQucG9zaXRpb24sXG4gIGdldFdlaWdodDogZCA9PiAxXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JlZW5HcmlkTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGdldFNoYWRlcnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZzOiByZWFkRmlsZVN5bmMoam9pbihfX2Rpcm5hbWUsICcuL3NjcmVlbi1ncmlkLWxheWVyLXZlcnRleC5nbHNsJyksICd1dGY4JyksXG4gICAgICBmczogcmVhZEZpbGVTeW5jKGpvaW4oX19kaXJuYW1lLCAnLi9zY3JlZW4tZ3JpZC1sYXllci1mcmFnbWVudC5nbHNsJyksICd1dGY4JylcbiAgICB9O1xuICB9XG5cbiAgaW5pdGlhbGl6ZVN0YXRlKCkge1xuICAgIGNvbnN0IHthdHRyaWJ1dGVNYW5hZ2VyfSA9IHRoaXMuc3RhdGU7XG4gICAgLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuICAgIGF0dHJpYnV0ZU1hbmFnZXIuYWRkSW5zdGFuY2VkKHtcbiAgICAgIGluc3RhbmNlUG9zaXRpb25zOiB7c2l6ZTogMywgdXBkYXRlOiB0aGlzLmNhbGN1bGF0ZUluc3RhbmNlUG9zaXRpb25zfSxcbiAgICAgIGluc3RhbmNlQ291bnQ6IHtzaXplOiAxLCBhY2Nlc3NvcjogWydnZXRQb3NpdGlvbicsICdnZXRXZWlnaHQnXSwgdXBkYXRlOiB0aGlzLmNhbGN1bGF0ZUluc3RhbmNlQ291bnR9XG4gICAgfSk7XG4gICAgLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuXG4gICAgY29uc3Qge2dsfSA9IHRoaXMuY29udGV4dDtcbiAgICB0aGlzLnNldFN0YXRlKHttb2RlbDogdGhpcy5nZXRNb2RlbChnbCl9KTtcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlKHtvbGRQcm9wcywgcHJvcHMsIGNoYW5nZUZsYWdzfSkge1xuICAgIGNvbnN0IGNlbGxTaXplQ2hhbmdlZCA9XG4gICAgICBwcm9wcy51bml0V2lkdGggIT09IG9sZFByb3BzLnVuaXRXaWR0aCB8fFxuICAgICAgcHJvcHMudW5pdEhlaWdodCAhPT0gb2xkUHJvcHMudW5pdEhlaWdodDtcblxuICAgIGlmIChjZWxsU2l6ZUNoYW5nZWQgfHwgY2hhbmdlRmxhZ3Mudmlld3BvcnRDaGFuZ2VkKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNlbGwoKTtcbiAgICB9XG4gIH1cblxuICBkcmF3KHt1bmlmb3Jtc30pIHtcbiAgICBjb25zdCB7bWluQ29sb3IsIG1heENvbG9yfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge21vZGVsLCBjZWxsU2NhbGUsIG1heENvdW50fSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qge2dsfSA9IHRoaXMuY29udGV4dDtcbiAgICBnbC5kZXB0aE1hc2sodHJ1ZSk7XG4gICAgdW5pZm9ybXMgPSBPYmplY3QuYXNzaWduKHt9LCB1bmlmb3Jtcywge21pbkNvbG9yLCBtYXhDb2xvciwgY2VsbFNjYWxlLCBtYXhDb3VudH0pO1xuICAgIG1vZGVsLnJlbmRlcih1bmlmb3Jtcyk7XG4gIH1cblxuICBnZXRNb2RlbChnbCkge1xuICAgIGNvbnN0IHNoYWRlcnMgPSBhc3NlbWJsZVNoYWRlcnMoZ2wsIHRoaXMuZ2V0U2hhZGVycygpKTtcblxuICAgIHJldHVybiBuZXcgTW9kZWwoe1xuICAgICAgZ2wsXG4gICAgICBpZDogdGhpcy5wcm9wcy5pZCxcbiAgICAgIHZzOiBzaGFkZXJzLnZzLFxuICAgICAgZnM6IHNoYWRlcnMuZnMsXG4gICAgICBnZW9tZXRyeTogbmV3IEdlb21ldHJ5KHtcbiAgICAgICAgZHJhd01vZGU6IEdMLlRSSUFOR0xFX0ZBTixcbiAgICAgICAgdmVydGljZXM6IG5ldyBGbG9hdDMyQXJyYXkoWzAsIDAsIDAsIDEsIDAsIDAsIDEsIDEsIDAsIDAsIDEsIDBdKVxuICAgICAgfSksXG4gICAgICBpc0luc3RhbmNlZDogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlQ2VsbCgpIHtcbiAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSB0aGlzLmNvbnRleHQudmlld3BvcnQ7XG4gICAgY29uc3Qge3VuaXRXaWR0aCwgdW5pdEhlaWdodH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgTUFSR0lOID0gMjtcbiAgICBjb25zdCBjZWxsU2NhbGUgPSBuZXcgRmxvYXQzMkFycmF5KFtcbiAgICAgICh1bml0V2lkdGggLSBNQVJHSU4pIC8gd2lkdGggKiAyLFxuICAgICAgLSh1bml0SGVpZ2h0IC0gTUFSR0lOKSAvIGhlaWdodCAqIDIsXG4gICAgICAxXG4gICAgXSk7XG4gICAgY29uc3QgbnVtQ29sID0gTWF0aC5jZWlsKHdpZHRoIC8gdW5pdFdpZHRoKTtcbiAgICBjb25zdCBudW1Sb3cgPSBNYXRoLmNlaWwoaGVpZ2h0IC8gdW5pdEhlaWdodCk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGNlbGxTY2FsZSxcbiAgICAgIG51bUNvbCxcbiAgICAgIG51bVJvdyxcbiAgICAgIG51bUluc3RhbmNlczogbnVtQ29sICogbnVtUm93XG4gICAgfSk7XG5cbiAgICBjb25zdCB7YXR0cmlidXRlTWFuYWdlcn0gPSB0aGlzLnN0YXRlO1xuICAgIGF0dHJpYnV0ZU1hbmFnZXIuaW52YWxpZGF0ZUFsbCgpO1xuICB9XG5cbiAgY2FsY3VsYXRlSW5zdGFuY2VQb3NpdGlvbnMoYXR0cmlidXRlLCB7bnVtSW5zdGFuY2VzfSkge1xuICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0fSA9IHRoaXMuY29udGV4dC52aWV3cG9ydDtcbiAgICBjb25zdCB7dW5pdFdpZHRoLCB1bml0SGVpZ2h0fSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge251bUNvbH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHt2YWx1ZSwgc2l6ZX0gPSBhdHRyaWJ1dGU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bUluc3RhbmNlczsgaSsrKSB7XG4gICAgICBjb25zdCB4ID0gaSAlIG51bUNvbDtcbiAgICAgIGNvbnN0IHkgPSBNYXRoLmZsb29yKGkgLyBudW1Db2wpO1xuICAgICAgdmFsdWVbaSAqIHNpemUgKyAwXSA9IHggKiB1bml0V2lkdGggLyB3aWR0aCAqIDIgLSAxO1xuICAgICAgdmFsdWVbaSAqIHNpemUgKyAxXSA9IDEgLSB5ICogdW5pdEhlaWdodCAvIGhlaWdodCAqIDI7XG4gICAgICB2YWx1ZVtpICogc2l6ZSArIDJdID0gMDtcbiAgICB9XG4gIH1cblxuICBjYWxjdWxhdGVJbnN0YW5jZUNvdW50KGF0dHJpYnV0ZSkge1xuICAgIGNvbnN0IHtkYXRhLCB1bml0V2lkdGgsIHVuaXRIZWlnaHQsIGdldFBvc2l0aW9uLCBnZXRXZWlnaHR9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7bnVtQ29sLCBudW1Sb3d9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCB7dmFsdWV9ID0gYXR0cmlidXRlO1xuICAgIGxldCBtYXhDb3VudCA9IDA7XG5cbiAgICB2YWx1ZS5maWxsKDAuMCk7XG5cbiAgICBmb3IgKGNvbnN0IHBvaW50IG9mIGRhdGEpIHtcbiAgICAgIGNvbnN0IHBpeGVsID0gdGhpcy5wcm9qZWN0KGdldFBvc2l0aW9uKHBvaW50KSk7XG4gICAgICBjb25zdCBjb2xJZCA9IE1hdGguZmxvb3IocGl4ZWxbMF0gLyB1bml0V2lkdGgpO1xuICAgICAgY29uc3Qgcm93SWQgPSBNYXRoLmZsb29yKHBpeGVsWzFdIC8gdW5pdEhlaWdodCk7XG4gICAgICBpZiAoY29sSWQgPj0gMCAmJiBjb2xJZCA8IG51bUNvbCAmJiByb3dJZCA+PSAwICYmIHJvd0lkIDwgbnVtUm93KSB7XG4gICAgICAgIGNvbnN0IGkgPSBjb2xJZCArIHJvd0lkICogbnVtQ29sO1xuICAgICAgICB2YWx1ZVtpXSArPSBnZXRXZWlnaHQocG9pbnQpO1xuICAgICAgICBpZiAodmFsdWVbaV0gPiBtYXhDb3VudCkge1xuICAgICAgICAgIG1heENvdW50ID0gdmFsdWVbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHttYXhDb3VudH0pO1xuICB9XG59XG5cblNjcmVlbkdyaWRMYXllci5sYXllck5hbWUgPSAnU2NyZWVuR3JpZExheWVyJztcblNjcmVlbkdyaWRMYXllci5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG4iXX0=