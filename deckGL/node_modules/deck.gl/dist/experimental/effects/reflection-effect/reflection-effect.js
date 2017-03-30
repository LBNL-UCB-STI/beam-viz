'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _luma = require('luma.gl');

var _shaderUtils = require('../../../shader-utils');

var _lib = require('../../lib');

var _path = require('path');

var _viewports = require('../../../lib/viewports');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global window */

// import {WebMercatorViewport} from 'viewport-mercator-project';


var ReflectionEffect = function (_Effect) {
  _inherits(ReflectionEffect, _Effect);

  /**
   * @classdesc
   * ReflectionEffect
   *
   * @class
   * @param reflectivity How visible reflections should be over the map, between 0 and 1
   * @param blur how blurry the reflection should be, between 0 and 1
   */

  function ReflectionEffect() {
    var reflectivity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;
    var blur = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;

    _classCallCheck(this, ReflectionEffect);

    var _this = _possibleConstructorReturn(this, (ReflectionEffect.__proto__ || Object.getPrototypeOf(ReflectionEffect)).call(this));

    _this.reflectivity = reflectivity;
    _this.blur = blur;
    _this.framebuffer = null;
    _this.setNeedsRedraw();
    return _this;
  }

  _createClass(ReflectionEffect, [{
    key: 'getShaders',
    value: function getShaders() {
      return {
        vs: '// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n#define SHADER_NAME reflection-effect-vs\n\nattribute vec3 vertices;\n\nvarying vec2 uv;\n\nvoid main(void) {\n  uv = vertices.xy;\n  gl_Position = vec4(2. * vertices.xy - vec2(1., 1.), 1., 1.);\n}\n',
        fs: '// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n#define SHADER_NAME reflection-effect-fs\n\n#ifdef GL_ES\nprecision highp float;\n#endif\n\nuniform sampler2D reflectionTexture;\nuniform int reflectionTextureWidth;\nuniform int reflectionTextureHeight;\n\nuniform float reflectivity;\nuniform float blur;\n\n\nvarying vec2 uv;\n\n#define KERNEL_SIZE 7\n\n/*\n * Samples from tex with a gaussian-shaped patch, centered at uv and\n * with standard deviation sigma.  The size of the texture in\n * pixels must be specified by dim\n */\nvec4 sample_gaussian(sampler2D tex, vec2 dim, vec2 uv, float sigma) {\n  if (sigma == 0.0) {\n    return texture2D(tex, uv);\n  }\n  \n  vec2 delta = 1.0 / dim;\n  vec2 top_left = uv - delta * float(KERNEL_SIZE+1) / 2.0;\n  \n  vec4 color = vec4(0);\n  float sum = 0.0;\n  for (int i = 0; i <  KERNEL_SIZE; ++i) {\n    for (int j = 0; j < KERNEL_SIZE; ++j) {\n      vec2 uv2 = top_left + vec2(i, j) * delta;\n      float d = length((uv2 - uv) * dim);\n      float f = exp(-(d*d) / (2.0*sigma * sigma));\n      color += f * texture2D(tex, uv2);\n      sum += f;\n    }\n  }\n  return color / sum;\n}\n\nvoid main(void) {\n  //map blur in [0, 1] to sigma in [0, inf]\n  //alpha will determine the "steepness" of our curve.\n  //this was picked just to make the scale feel "natural"\n  //if our image is 1000 pixels wide, a blur of 0.5 should correspond\n  //to a sigma of 1 pixels\n  float alpha = 1000.0;\n  float sigma = blur / (alpha * (1.0 - blur));\n  //let this be our standard deviation in terms of screen-widths.\n  //rewrite this in terms of pixels.\n  sigma *= float(reflectionTextureWidth);\n  \n  \n  gl_FragColor = sample_gaussian(reflectionTexture, vec2(reflectionTextureWidth, reflectionTextureHeight), vec2(uv.x, 1. - uv.y), sigma);\n  //because our canvas expects alphas to be pre-multiplied, we multiply by whole\n  //color vector by reflectivity, not just the alpha channel\n  gl_FragColor *= reflectivity;\n}\n'
      };
    }
  }, {
    key: 'initialize',
    value: function initialize(_ref) {
      var gl = _ref.gl,
          layerManager = _ref.layerManager;

      var shaders = (0, _shaderUtils.assembleShaders)(gl, this.getShaders());

      this.unitQuad = new _luma.Model({
        gl: gl,
        id: 'reflection-effect',
        vs: shaders.vs,
        fs: shaders.fs,
        geometry: new _luma.Geometry({
          drawMode: _luma.GL.TRIANGLE_FAN,
          vertices: new Float32Array([0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0])
        })
      });
      this.framebuffer = new _luma.Framebuffer(gl, { depth: true });
    }
  }, {
    key: 'preDraw',
    value: function preDraw(_ref2) {
      var gl = _ref2.gl,
          layerManager = _ref2.layerManager;
      var viewport = layerManager.context.viewport;
      /*
       * the renderer already has a reference to this, but we don't have a reference to the renderer.
       * when we refactor the camera code, we should make sure we get a reference to the renderer so
       * that we can keep this in one place.
       */

      var dpi = typeof window !== 'undefined' && window.devicePixelRatio || 1;
      this.framebuffer.resize({ width: dpi * viewport.width, height: dpi * viewport.height });
      var pitch = viewport.pitch;
      this.framebuffer.bind();
      /* this is a huge hack around the existing viewport class.
       * TODO in the future, once we implement bona-fide cameras, we really need to fix this.
       */
      layerManager.setViewport(new _viewports.WebMercatorViewport(Object.assign({}, viewport, { pitch: -180 - pitch })));
      gl.clear(_luma.GL.COLOR_BUFFER_BIT | _luma.GL.DEPTH_BUFFER_BIT);

      layerManager.drawLayers({ pass: 'reflection' });
      layerManager.setViewport(viewport);
      this.framebuffer.unbind();
    }
  }, {
    key: 'draw',
    value: function draw(_ref3) {
      var gl = _ref3.gl,
          layerManager = _ref3.layerManager;

      /*
       * Render our unit quad.
       * This will cover the entire screen, but will lie behind all other geometry.
       * This quad will sample the previously generated reflection texture
       * in order to create the reflection effect
       */
      this.unitQuad.render({
        reflectionTexture: this.framebuffer.texture,
        reflectionTextureWidth: this.framebuffer.width,
        reflectionTextureHeight: this.framebuffer.height,
        reflectivity: this.reflectivity,
        blur: this.blur
      });
    }
  }, {
    key: 'finalize',
    value: function finalize(_ref4) {
      /* TODO: Free resources? */

      var gl = _ref4.gl,
          layerManager = _ref4.layerManager;
    }
  }]);

  return ReflectionEffect;
}(_lib.Effect);

exports.default = ReflectionEffect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9leHBlcmltZW50YWwvZWZmZWN0cy9yZWZsZWN0aW9uLWVmZmVjdC9yZWZsZWN0aW9uLWVmZmVjdC5qcyJdLCJuYW1lcyI6WyJSZWZsZWN0aW9uRWZmZWN0IiwicmVmbGVjdGl2aXR5IiwiYmx1ciIsImZyYW1lYnVmZmVyIiwic2V0TmVlZHNSZWRyYXciLCJ2cyIsImZzIiwiZ2wiLCJsYXllck1hbmFnZXIiLCJzaGFkZXJzIiwiZ2V0U2hhZGVycyIsInVuaXRRdWFkIiwiaWQiLCJnZW9tZXRyeSIsImRyYXdNb2RlIiwiVFJJQU5HTEVfRkFOIiwidmVydGljZXMiLCJGbG9hdDMyQXJyYXkiLCJkZXB0aCIsInZpZXdwb3J0IiwiY29udGV4dCIsImRwaSIsIndpbmRvdyIsImRldmljZVBpeGVsUmF0aW8iLCJyZXNpemUiLCJ3aWR0aCIsImhlaWdodCIsInBpdGNoIiwiYmluZCIsInNldFZpZXdwb3J0IiwiT2JqZWN0IiwiYXNzaWduIiwiY2xlYXIiLCJDT0xPUl9CVUZGRVJfQklUIiwiREVQVEhfQlVGRkVSX0JJVCIsImRyYXdMYXllcnMiLCJwYXNzIiwidW5iaW5kIiwicmVuZGVyIiwicmVmbGVjdGlvblRleHR1cmUiLCJ0ZXh0dXJlIiwicmVmbGVjdGlvblRleHR1cmVXaWR0aCIsInJlZmxlY3Rpb25UZXh0dXJlSGVpZ2h0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUVBOzs7Ozs7K2VBUEE7O0FBTUE7OztJQUdxQkEsZ0I7OztBQUVuQjs7Ozs7Ozs7O0FBU0EsOEJBQTRDO0FBQUEsUUFBaENDLFlBQWdDLHVFQUFqQixHQUFpQjtBQUFBLFFBQVpDLElBQVksdUVBQUwsR0FBSzs7QUFBQTs7QUFBQTs7QUFFMUMsVUFBS0QsWUFBTCxHQUFvQkEsWUFBcEI7QUFDQSxVQUFLQyxJQUFMLEdBQVlBLElBQVo7QUFDQSxVQUFLQyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsVUFBS0MsY0FBTDtBQUwwQztBQU0zQzs7OztpQ0FFWTtBQUNYLGFBQU87QUFDTEMsMjBDQURLO0FBRUxDO0FBRkssT0FBUDtBQUlEOzs7cUNBRThCO0FBQUEsVUFBbkJDLEVBQW1CLFFBQW5CQSxFQUFtQjtBQUFBLFVBQWZDLFlBQWUsUUFBZkEsWUFBZTs7QUFDN0IsVUFBTUMsVUFBVSxrQ0FBZ0JGLEVBQWhCLEVBQW9CLEtBQUtHLFVBQUwsRUFBcEIsQ0FBaEI7O0FBRUEsV0FBS0MsUUFBTCxHQUFnQixnQkFBVTtBQUN4QkosY0FEd0I7QUFFeEJLLFlBQUksbUJBRm9CO0FBR3hCUCxZQUFJSSxRQUFRSixFQUhZO0FBSXhCQyxZQUFJRyxRQUFRSCxFQUpZO0FBS3hCTyxrQkFBVSxtQkFBYTtBQUNyQkMsb0JBQVUsU0FBR0MsWUFEUTtBQUVyQkMsb0JBQVUsSUFBSUMsWUFBSixDQUFpQixDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCLENBQXpCLEVBQTRCLENBQTVCLEVBQStCLENBQS9CLEVBQWtDLENBQWxDLENBQWpCO0FBRlcsU0FBYjtBQUxjLE9BQVYsQ0FBaEI7QUFVQSxXQUFLZCxXQUFMLEdBQW1CLHNCQUFnQkksRUFBaEIsRUFBb0IsRUFBQ1csT0FBTyxJQUFSLEVBQXBCLENBQW5CO0FBRUQ7OzttQ0FFMkI7QUFBQSxVQUFuQlgsRUFBbUIsU0FBbkJBLEVBQW1CO0FBQUEsVUFBZkMsWUFBZSxTQUFmQSxZQUFlO0FBQUEsVUFDbkJXLFFBRG1CLEdBQ1BYLGFBQWFZLE9BRE4sQ0FDbkJELFFBRG1CO0FBRTFCOzs7Ozs7QUFLQSxVQUFNRSxNQUFPLE9BQU9DLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLE9BQU9DLGdCQUF6QyxJQUE4RCxDQUExRTtBQUNBLFdBQUtwQixXQUFMLENBQWlCcUIsTUFBakIsQ0FBd0IsRUFBQ0MsT0FBT0osTUFBTUYsU0FBU00sS0FBdkIsRUFBOEJDLFFBQVFMLE1BQU1GLFNBQVNPLE1BQXJELEVBQXhCO0FBQ0EsVUFBTUMsUUFBUVIsU0FBU1EsS0FBdkI7QUFDQSxXQUFLeEIsV0FBTCxDQUFpQnlCLElBQWpCO0FBQ0E7OztBQUdBcEIsbUJBQWFxQixXQUFiLENBQ0UsbUNBQXdCQyxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQlosUUFBbEIsRUFBNEIsRUFBQ1EsT0FBTyxDQUFDLEdBQUQsR0FBT0EsS0FBZixFQUE1QixDQUF4QixDQURGO0FBR0FwQixTQUFHeUIsS0FBSCxDQUFTLFNBQUdDLGdCQUFILEdBQXNCLFNBQUdDLGdCQUFsQzs7QUFFQTFCLG1CQUFhMkIsVUFBYixDQUF3QixFQUFDQyxNQUFNLFlBQVAsRUFBeEI7QUFDQTVCLG1CQUFhcUIsV0FBYixDQUF5QlYsUUFBekI7QUFDQSxXQUFLaEIsV0FBTCxDQUFpQmtDLE1BQWpCO0FBQ0Q7OztnQ0FFd0I7QUFBQSxVQUFuQjlCLEVBQW1CLFNBQW5CQSxFQUFtQjtBQUFBLFVBQWZDLFlBQWUsU0FBZkEsWUFBZTs7QUFDdkI7Ozs7OztBQU1BLFdBQUtHLFFBQUwsQ0FBYzJCLE1BQWQsQ0FBcUI7QUFDbkJDLDJCQUFtQixLQUFLcEMsV0FBTCxDQUFpQnFDLE9BRGpCO0FBRW5CQyxnQ0FBd0IsS0FBS3RDLFdBQUwsQ0FBaUJzQixLQUZ0QjtBQUduQmlCLGlDQUF5QixLQUFLdkMsV0FBTCxDQUFpQnVCLE1BSHZCO0FBSW5CekIsc0JBQWMsS0FBS0EsWUFKQTtBQUtuQkMsY0FBTSxLQUFLQTtBQUxRLE9BQXJCO0FBT0Q7OztvQ0FFNEI7QUFDM0I7O0FBRDJCLFVBQW5CSyxFQUFtQixTQUFuQkEsRUFBbUI7QUFBQSxVQUFmQyxZQUFlLFNBQWZBLFlBQWU7QUFFNUI7Ozs7OztrQkFyRmtCUixnQiIsImZpbGUiOiJyZWZsZWN0aW9uLWVmZmVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCB3aW5kb3cgKi9cbmltcG9ydCB7R0wsIEZyYW1lYnVmZmVyLCBNb2RlbCwgR2VvbWV0cnl9IGZyb20gJ2x1bWEuZ2wnO1xuaW1wb3J0IHthc3NlbWJsZVNoYWRlcnN9IGZyb20gJy4uLy4uLy4uL3NoYWRlci11dGlscyc7XG5pbXBvcnQge0VmZmVjdH0gZnJvbSAnLi4vLi4vbGliJztcbmltcG9ydCB7cmVhZEZpbGVTeW5jfSBmcm9tICdmcyc7XG5pbXBvcnQge2pvaW59IGZyb20gJ3BhdGgnO1xuLy8gaW1wb3J0IHtXZWJNZXJjYXRvclZpZXdwb3J0fSBmcm9tICd2aWV3cG9ydC1tZXJjYXRvci1wcm9qZWN0JztcbmltcG9ydCB7V2ViTWVyY2F0b3JWaWV3cG9ydH0gZnJvbSAnLi4vLi4vLi4vbGliL3ZpZXdwb3J0cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlZmxlY3Rpb25FZmZlY3QgZXh0ZW5kcyBFZmZlY3Qge1xuXG4gIC8qKlxuICAgKiBAY2xhc3NkZXNjXG4gICAqIFJlZmxlY3Rpb25FZmZlY3RcbiAgICpcbiAgICogQGNsYXNzXG4gICAqIEBwYXJhbSByZWZsZWN0aXZpdHkgSG93IHZpc2libGUgcmVmbGVjdGlvbnMgc2hvdWxkIGJlIG92ZXIgdGhlIG1hcCwgYmV0d2VlbiAwIGFuZCAxXG4gICAqIEBwYXJhbSBibHVyIGhvdyBibHVycnkgdGhlIHJlZmxlY3Rpb24gc2hvdWxkIGJlLCBiZXR3ZWVuIDAgYW5kIDFcbiAgICovXG5cbiAgY29uc3RydWN0b3IocmVmbGVjdGl2aXR5ID0gMC41LCBibHVyID0gMC41KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnJlZmxlY3Rpdml0eSA9IHJlZmxlY3Rpdml0eTtcbiAgICB0aGlzLmJsdXIgPSBibHVyO1xuICAgIHRoaXMuZnJhbWVidWZmZXIgPSBudWxsO1xuICAgIHRoaXMuc2V0TmVlZHNSZWRyYXcoKTtcbiAgfVxuXG4gIGdldFNoYWRlcnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZzOiByZWFkRmlsZVN5bmMoam9pbihfX2Rpcm5hbWUsICcuL3JlZmxlY3Rpb24tZWZmZWN0LXZlcnRleC5nbHNsJyksICd1dGY4JyksXG4gICAgICBmczogcmVhZEZpbGVTeW5jKGpvaW4oX19kaXJuYW1lLCAnLi9yZWZsZWN0aW9uLWVmZmVjdC1mcmFnbWVudC5nbHNsJyksICd1dGY4JylcbiAgICB9O1xuICB9XG5cbiAgaW5pdGlhbGl6ZSh7Z2wsIGxheWVyTWFuYWdlcn0pIHtcbiAgICBjb25zdCBzaGFkZXJzID0gYXNzZW1ibGVTaGFkZXJzKGdsLCB0aGlzLmdldFNoYWRlcnMoKSk7XG5cbiAgICB0aGlzLnVuaXRRdWFkID0gbmV3IE1vZGVsKHtcbiAgICAgIGdsLFxuICAgICAgaWQ6ICdyZWZsZWN0aW9uLWVmZmVjdCcsXG4gICAgICB2czogc2hhZGVycy52cyxcbiAgICAgIGZzOiBzaGFkZXJzLmZzLFxuICAgICAgZ2VvbWV0cnk6IG5ldyBHZW9tZXRyeSh7XG4gICAgICAgIGRyYXdNb2RlOiBHTC5UUklBTkdMRV9GQU4sXG4gICAgICAgIHZlcnRpY2VzOiBuZXcgRmxvYXQzMkFycmF5KFswLCAwLCAwLCAxLCAwLCAwLCAxLCAxLCAwLCAwLCAxLCAwXSlcbiAgICAgIH0pXG4gICAgfSk7XG4gICAgdGhpcy5mcmFtZWJ1ZmZlciA9IG5ldyBGcmFtZWJ1ZmZlcihnbCwge2RlcHRoOiB0cnVlfSk7XG5cbiAgfVxuXG4gIHByZURyYXcoe2dsLCBsYXllck1hbmFnZXJ9KSB7XG4gICAgY29uc3Qge3ZpZXdwb3J0fSA9IGxheWVyTWFuYWdlci5jb250ZXh0O1xuICAgIC8qXG4gICAgICogdGhlIHJlbmRlcmVyIGFscmVhZHkgaGFzIGEgcmVmZXJlbmNlIHRvIHRoaXMsIGJ1dCB3ZSBkb24ndCBoYXZlIGEgcmVmZXJlbmNlIHRvIHRoZSByZW5kZXJlci5cbiAgICAgKiB3aGVuIHdlIHJlZmFjdG9yIHRoZSBjYW1lcmEgY29kZSwgd2Ugc2hvdWxkIG1ha2Ugc3VyZSB3ZSBnZXQgYSByZWZlcmVuY2UgdG8gdGhlIHJlbmRlcmVyIHNvXG4gICAgICogdGhhdCB3ZSBjYW4ga2VlcCB0aGlzIGluIG9uZSBwbGFjZS5cbiAgICAgKi9cbiAgICBjb25zdCBkcGkgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmRldmljZVBpeGVsUmF0aW8pIHx8IDE7XG4gICAgdGhpcy5mcmFtZWJ1ZmZlci5yZXNpemUoe3dpZHRoOiBkcGkgKiB2aWV3cG9ydC53aWR0aCwgaGVpZ2h0OiBkcGkgKiB2aWV3cG9ydC5oZWlnaHR9KTtcbiAgICBjb25zdCBwaXRjaCA9IHZpZXdwb3J0LnBpdGNoO1xuICAgIHRoaXMuZnJhbWVidWZmZXIuYmluZCgpO1xuICAgIC8qIHRoaXMgaXMgYSBodWdlIGhhY2sgYXJvdW5kIHRoZSBleGlzdGluZyB2aWV3cG9ydCBjbGFzcy5cbiAgICAgKiBUT0RPIGluIHRoZSBmdXR1cmUsIG9uY2Ugd2UgaW1wbGVtZW50IGJvbmEtZmlkZSBjYW1lcmFzLCB3ZSByZWFsbHkgbmVlZCB0byBmaXggdGhpcy5cbiAgICAgKi9cbiAgICBsYXllck1hbmFnZXIuc2V0Vmlld3BvcnQoXG4gICAgICBuZXcgV2ViTWVyY2F0b3JWaWV3cG9ydChPYmplY3QuYXNzaWduKHt9LCB2aWV3cG9ydCwge3BpdGNoOiAtMTgwIC0gcGl0Y2h9KSlcbiAgICApO1xuICAgIGdsLmNsZWFyKEdMLkNPTE9SX0JVRkZFUl9CSVQgfCBHTC5ERVBUSF9CVUZGRVJfQklUKTtcblxuICAgIGxheWVyTWFuYWdlci5kcmF3TGF5ZXJzKHtwYXNzOiAncmVmbGVjdGlvbid9KTtcbiAgICBsYXllck1hbmFnZXIuc2V0Vmlld3BvcnQodmlld3BvcnQpO1xuICAgIHRoaXMuZnJhbWVidWZmZXIudW5iaW5kKCk7XG4gIH1cblxuICBkcmF3KHtnbCwgbGF5ZXJNYW5hZ2VyfSkge1xuICAgIC8qXG4gICAgICogUmVuZGVyIG91ciB1bml0IHF1YWQuXG4gICAgICogVGhpcyB3aWxsIGNvdmVyIHRoZSBlbnRpcmUgc2NyZWVuLCBidXQgd2lsbCBsaWUgYmVoaW5kIGFsbCBvdGhlciBnZW9tZXRyeS5cbiAgICAgKiBUaGlzIHF1YWQgd2lsbCBzYW1wbGUgdGhlIHByZXZpb3VzbHkgZ2VuZXJhdGVkIHJlZmxlY3Rpb24gdGV4dHVyZVxuICAgICAqIGluIG9yZGVyIHRvIGNyZWF0ZSB0aGUgcmVmbGVjdGlvbiBlZmZlY3RcbiAgICAgKi9cbiAgICB0aGlzLnVuaXRRdWFkLnJlbmRlcih7XG4gICAgICByZWZsZWN0aW9uVGV4dHVyZTogdGhpcy5mcmFtZWJ1ZmZlci50ZXh0dXJlLFxuICAgICAgcmVmbGVjdGlvblRleHR1cmVXaWR0aDogdGhpcy5mcmFtZWJ1ZmZlci53aWR0aCxcbiAgICAgIHJlZmxlY3Rpb25UZXh0dXJlSGVpZ2h0OiB0aGlzLmZyYW1lYnVmZmVyLmhlaWdodCxcbiAgICAgIHJlZmxlY3Rpdml0eTogdGhpcy5yZWZsZWN0aXZpdHksXG4gICAgICBibHVyOiB0aGlzLmJsdXJcbiAgICB9KTtcbiAgfVxuXG4gIGZpbmFsaXplKHtnbCwgbGF5ZXJNYW5hZ2VyfSkge1xuICAgIC8qIFRPRE86IEZyZWUgcmVzb3VyY2VzPyAqL1xuICB9XG59XG4iXX0=