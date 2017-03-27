'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkRendererVendor = checkRendererVendor;
exports.getPlatformShaderDefines = getPlatformShaderDefines;
exports.assembleShaders = assembleShaders;

var _luma = require('luma.gl');

var _shaderChunks = require('./shader-chunks');

var SHADER_CHUNKS = _interopRequireWildcard(_shaderChunks);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function checkRendererVendor(debugInfo, gpuVendor) {
  var vendor = debugInfo.vendor,
      renderer = debugInfo.renderer;

  var result = void 0;
  switch (gpuVendor) {
    case 'nvidia':
      result = vendor.match(/NVIDIA/i) || renderer.match(/NVIDIA/i);
      break;
    case 'intel':
      result = vendor.match(/INTEL/i) || renderer.match(/INTEL/i);
      break;
    case 'amd':
      result = vendor.match(/AMD/i) || renderer.match(/AMD/i) || vendor.match(/ATI/i) || renderer.match(/ATI/i);
      break;
    default:
      result = false;
  }
  return result;
}

// Load shader chunks
// import SHADER_CHUNKS from '../../dist/shaderlib/shader-chunks';
function getPlatformShaderDefines(gl) {
  /* eslint-disable */
  var platformDefines = '';
  var debugInfo = (0, _luma.glGetDebugInfo)(gl);

  if (checkRendererVendor(debugInfo, 'nvidia')) {
    platformDefines += '#define NVIDIA_GPU\n#define NVIDIA_FP64_WORKAROUND 1\n#define NVIDIA_EQUATION_WORKAROUND 1\n';
  } else if (checkRendererVendor(debugInfo, 'intel')) {
    platformDefines += '#define INTEL_GPU\n#define INTEL_FP64_WORKAROUND 1\n#define NVIDIA_EQUATION_WORKAROUND 1\n #define INTEL_TAN_WORKAROUND 1\n';
  } else if (checkRendererVendor(debugInfo, 'amd')) {
    platformDefines += '#define AMD_GPU\n';
  } else {
    platformDefines += '#define DEFAULT_GPU\n';
  }

  return platformDefines;
}

function assembleShader(gl) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _opts = opts,
      vs = _opts.vs,
      _opts$project = _opts.project,
      project = _opts$project === undefined ? true : _opts$project,
      _opts$project2 = _opts.project64,
      project64 = _opts$project2 === undefined ? false : _opts$project2;
  var _opts2 = opts,
      _opts2$fp = _opts2.fp64,
      fp64 = _opts2$fp === undefined ? false : _opts2$fp;

  if (project64 === true) {
    fp64 = true;
  }
  var source = getPlatformShaderDefines(gl) + '\n';
  opts = Object.assign({}, opts, { project: project, project64: project64, fp64: fp64 });
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(SHADER_CHUNKS)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var chunkName = _step.value;

      if (opts[chunkName]) {
        source += SHADER_CHUNKS[chunkName].source + '\n';
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

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = (opts.modules || [])[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _chunkName = _step2.value;

      if (SHADER_CHUNKS[_chunkName]) {
        source += SHADER_CHUNKS[_chunkName].source + '\n';
      } else {
        throw new Error('Shader module ' + _chunkName + ' not found');
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  source += vs;
  return source;
}

function assembleShaders(gl, opts) {
  return {
    gl: gl,
    vs: assembleShader(gl, opts),
    fs: opts.fs
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zaGFkZXItdXRpbHMvYXNzZW1ibGUtc2hhZGVycy5qcyJdLCJuYW1lcyI6WyJjaGVja1JlbmRlcmVyVmVuZG9yIiwiZ2V0UGxhdGZvcm1TaGFkZXJEZWZpbmVzIiwiYXNzZW1ibGVTaGFkZXJzIiwiU0hBREVSX0NIVU5LUyIsImRlYnVnSW5mbyIsImdwdVZlbmRvciIsInZlbmRvciIsInJlbmRlcmVyIiwicmVzdWx0IiwibWF0Y2giLCJnbCIsInBsYXRmb3JtRGVmaW5lcyIsImFzc2VtYmxlU2hhZGVyIiwib3B0cyIsInZzIiwicHJvamVjdCIsInByb2plY3Q2NCIsImZwNjQiLCJzb3VyY2UiLCJPYmplY3QiLCJhc3NpZ24iLCJrZXlzIiwiY2h1bmtOYW1lIiwibW9kdWxlcyIsIkVycm9yIiwiZnMiXSwibWFwcGluZ3MiOiI7Ozs7O1FBTWdCQSxtQixHQUFBQSxtQjtRQXFCQUMsd0IsR0FBQUEsd0I7UUF1REFDLGUsR0FBQUEsZTs7QUFsRmhCOztBQUlBOztJQUFZQyxhOzs7O0FBRUwsU0FBU0gsbUJBQVQsQ0FBNkJJLFNBQTdCLEVBQXdDQyxTQUF4QyxFQUFtRDtBQUFBLE1BQ2pEQyxNQURpRCxHQUM3QkYsU0FENkIsQ0FDakRFLE1BRGlEO0FBQUEsTUFDekNDLFFBRHlDLEdBQzdCSCxTQUQ2QixDQUN6Q0csUUFEeUM7O0FBRXhELE1BQUlDLGVBQUo7QUFDQSxVQUFRSCxTQUFSO0FBQ0EsU0FBSyxRQUFMO0FBQ0VHLGVBQVNGLE9BQU9HLEtBQVAsQ0FBYSxTQUFiLEtBQTJCRixTQUFTRSxLQUFULENBQWUsU0FBZixDQUFwQztBQUNBO0FBQ0YsU0FBSyxPQUFMO0FBQ0VELGVBQVNGLE9BQU9HLEtBQVAsQ0FBYSxRQUFiLEtBQTBCRixTQUFTRSxLQUFULENBQWUsUUFBZixDQUFuQztBQUNBO0FBQ0YsU0FBSyxLQUFMO0FBQ0VELGVBQ0VGLE9BQU9HLEtBQVAsQ0FBYSxNQUFiLEtBQXdCRixTQUFTRSxLQUFULENBQWUsTUFBZixDQUF4QixJQUNBSCxPQUFPRyxLQUFQLENBQWEsTUFBYixDQURBLElBQ3dCRixTQUFTRSxLQUFULENBQWUsTUFBZixDQUYxQjtBQUdBO0FBQ0Y7QUFDRUQsZUFBUyxLQUFUO0FBYkY7QUFlQSxTQUFPQSxNQUFQO0FBQ0Q7O0FBdkJEO0FBQ0E7QUF3Qk8sU0FBU1Asd0JBQVQsQ0FBa0NTLEVBQWxDLEVBQXNDO0FBQzNDO0FBQ0EsTUFBSUMsa0JBQWtCLEVBQXRCO0FBQ0EsTUFBTVAsWUFBWSwwQkFBZU0sRUFBZixDQUFsQjs7QUFFQSxNQUFJVixvQkFBb0JJLFNBQXBCLEVBQStCLFFBQS9CLENBQUosRUFBOEM7QUFDNUNPO0FBS0QsR0FORCxNQU1PLElBQUlYLG9CQUFvQkksU0FBcEIsRUFBK0IsT0FBL0IsQ0FBSixFQUE2QztBQUNsRE87QUFNRCxHQVBNLE1BT0EsSUFBSVgsb0JBQW9CSSxTQUFwQixFQUErQixLQUEvQixDQUFKLEVBQTJDO0FBQ2hETztBQUdELEdBSk0sTUFJQTtBQUNMQTtBQUdEOztBQUVELFNBQU9BLGVBQVA7QUFDRDs7QUFFRCxTQUFTQyxjQUFULENBQXdCRixFQUF4QixFQUF1QztBQUFBLE1BQVhHLElBQVcsdUVBQUosRUFBSTtBQUFBLGNBQ1dBLElBRFg7QUFBQSxNQUM5QkMsRUFEOEIsU0FDOUJBLEVBRDhCO0FBQUEsNEJBQzFCQyxPQUQwQjtBQUFBLE1BQzFCQSxPQUQwQixpQ0FDaEIsSUFEZ0I7QUFBQSw2QkFDVkMsU0FEVTtBQUFBLE1BQ1ZBLFNBRFUsa0NBQ0UsS0FERjtBQUFBLGVBRWhCSCxJQUZnQjtBQUFBLHlCQUVoQ0ksSUFGZ0M7QUFBQSxNQUVoQ0EsSUFGZ0MsNkJBRXpCLEtBRnlCOztBQUdyQyxNQUFJRCxjQUFjLElBQWxCLEVBQXdCO0FBQ3RCQyxXQUFPLElBQVA7QUFDRDtBQUNELE1BQUlDLFNBQVlqQix5QkFBeUJTLEVBQXpCLENBQVosT0FBSjtBQUNBRyxTQUFPTSxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQlAsSUFBbEIsRUFBd0IsRUFBQ0UsZ0JBQUQsRUFBVUMsb0JBQVYsRUFBcUJDLFVBQXJCLEVBQXhCLENBQVA7QUFQcUM7QUFBQTtBQUFBOztBQUFBO0FBUXJDLHlCQUF3QkUsT0FBT0UsSUFBUCxDQUFZbEIsYUFBWixDQUF4Qiw4SEFBb0Q7QUFBQSxVQUF6Q21CLFNBQXlDOztBQUNsRCxVQUFJVCxLQUFLUyxTQUFMLENBQUosRUFBcUI7QUFDbkJKLGtCQUFhZixjQUFjbUIsU0FBZCxFQUF5QkosTUFBdEM7QUFDRDtBQUNGO0FBWm9DO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBYXJDLDJCQUF3QkwsS0FBS1UsT0FBTCxJQUFnQixFQUF4QyxvSUFBNEM7QUFBQSxVQUFqQ0QsVUFBaUM7O0FBQzFDLFVBQUluQixjQUFjbUIsVUFBZCxDQUFKLEVBQThCO0FBQzVCSixrQkFBYWYsY0FBY21CLFVBQWQsRUFBeUJKLE1BQXRDO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsY0FBTSxJQUFJTSxLQUFKLG9CQUEyQkYsVUFBM0IsZ0JBQU47QUFDRDtBQUNGO0FBbkJvQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQW9CckNKLFlBQVVKLEVBQVY7QUFDQSxTQUFPSSxNQUFQO0FBQ0Q7O0FBRU0sU0FBU2hCLGVBQVQsQ0FBeUJRLEVBQXpCLEVBQTZCRyxJQUE3QixFQUFtQztBQUN4QyxTQUFPO0FBQ0xILFVBREs7QUFFTEksUUFBSUYsZUFBZUYsRUFBZixFQUFtQkcsSUFBbkIsQ0FGQztBQUdMWSxRQUFJWixLQUFLWTtBQUhKLEdBQVA7QUFLRCIsImZpbGUiOiJhc3NlbWJsZS1zaGFkZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtnbEdldERlYnVnSW5mb30gZnJvbSAnbHVtYS5nbCc7XG5cbi8vIExvYWQgc2hhZGVyIGNodW5rc1xuLy8gaW1wb3J0IFNIQURFUl9DSFVOS1MgZnJvbSAnLi4vLi4vZGlzdC9zaGFkZXJsaWIvc2hhZGVyLWNodW5rcyc7XG5pbXBvcnQgKiBhcyBTSEFERVJfQ0hVTktTIGZyb20gJy4vc2hhZGVyLWNodW5rcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1JlbmRlcmVyVmVuZG9yKGRlYnVnSW5mbywgZ3B1VmVuZG9yKSB7XG4gIGNvbnN0IHt2ZW5kb3IsIHJlbmRlcmVyfSA9IGRlYnVnSW5mbztcbiAgbGV0IHJlc3VsdDtcbiAgc3dpdGNoIChncHVWZW5kb3IpIHtcbiAgY2FzZSAnbnZpZGlhJzpcbiAgICByZXN1bHQgPSB2ZW5kb3IubWF0Y2goL05WSURJQS9pKSB8fCByZW5kZXJlci5tYXRjaCgvTlZJRElBL2kpO1xuICAgIGJyZWFrO1xuICBjYXNlICdpbnRlbCc6XG4gICAgcmVzdWx0ID0gdmVuZG9yLm1hdGNoKC9JTlRFTC9pKSB8fCByZW5kZXJlci5tYXRjaCgvSU5URUwvaSk7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ2FtZCc6XG4gICAgcmVzdWx0ID1cbiAgICAgIHZlbmRvci5tYXRjaCgvQU1EL2kpIHx8IHJlbmRlcmVyLm1hdGNoKC9BTUQvaSkgfHxcbiAgICAgIHZlbmRvci5tYXRjaCgvQVRJL2kpIHx8IHJlbmRlcmVyLm1hdGNoKC9BVEkvaSk7XG4gICAgYnJlYWs7XG4gIGRlZmF1bHQ6XG4gICAgcmVzdWx0ID0gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBsYXRmb3JtU2hhZGVyRGVmaW5lcyhnbCkge1xuICAvKiBlc2xpbnQtZGlzYWJsZSAqL1xuICBsZXQgcGxhdGZvcm1EZWZpbmVzID0gJyc7XG4gIGNvbnN0IGRlYnVnSW5mbyA9IGdsR2V0RGVidWdJbmZvKGdsKTtcblxuICBpZiAoY2hlY2tSZW5kZXJlclZlbmRvcihkZWJ1Z0luZm8sICdudmlkaWEnKSkge1xuICAgIHBsYXRmb3JtRGVmaW5lcyArPSBgXFxcbiNkZWZpbmUgTlZJRElBX0dQVVxuI2RlZmluZSBOVklESUFfRlA2NF9XT1JLQVJPVU5EIDFcbiNkZWZpbmUgTlZJRElBX0VRVUFUSU9OX1dPUktBUk9VTkQgMVxuYDtcbiAgfSBlbHNlIGlmIChjaGVja1JlbmRlcmVyVmVuZG9yKGRlYnVnSW5mbywgJ2ludGVsJykpIHtcbiAgICBwbGF0Zm9ybURlZmluZXMgKz0gYFxcXG4jZGVmaW5lIElOVEVMX0dQVVxuI2RlZmluZSBJTlRFTF9GUDY0X1dPUktBUk9VTkQgMVxuI2RlZmluZSBOVklESUFfRVFVQVRJT05fV09SS0FST1VORCAxXFxuIFxcXG4jZGVmaW5lIElOVEVMX1RBTl9XT1JLQVJPVU5EIDFcbmA7XG4gIH0gZWxzZSBpZiAoY2hlY2tSZW5kZXJlclZlbmRvcihkZWJ1Z0luZm8sICdhbWQnKSkge1xuICAgIHBsYXRmb3JtRGVmaW5lcyArPSBgXFxcbiNkZWZpbmUgQU1EX0dQVVxuYDtcbiAgfSBlbHNlIHtcbiAgICBwbGF0Zm9ybURlZmluZXMgKz0gYFxcXG4jZGVmaW5lIERFRkFVTFRfR1BVXG5gO1xuICB9XG5cbiAgcmV0dXJuIHBsYXRmb3JtRGVmaW5lcztcbn1cblxuZnVuY3Rpb24gYXNzZW1ibGVTaGFkZXIoZ2wsIG9wdHMgPSB7fSkge1xuICBjb25zdCB7dnMsIHByb2plY3QgPSB0cnVlLCBwcm9qZWN0NjQgPSBmYWxzZX0gPSBvcHRzO1xuICBsZXQge2ZwNjQgPSBmYWxzZX0gPSBvcHRzO1xuICBpZiAocHJvamVjdDY0ID09PSB0cnVlKSB7XG4gICAgZnA2NCA9IHRydWU7XG4gIH1cbiAgbGV0IHNvdXJjZSA9IGAke2dldFBsYXRmb3JtU2hhZGVyRGVmaW5lcyhnbCl9XFxuYDtcbiAgb3B0cyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdHMsIHtwcm9qZWN0LCBwcm9qZWN0NjQsIGZwNjR9KTtcbiAgZm9yIChjb25zdCBjaHVua05hbWUgb2YgT2JqZWN0LmtleXMoU0hBREVSX0NIVU5LUykpIHtcbiAgICBpZiAob3B0c1tjaHVua05hbWVdKSB7XG4gICAgICBzb3VyY2UgKz0gYCR7U0hBREVSX0NIVU5LU1tjaHVua05hbWVdLnNvdXJjZX1cXG5gO1xuICAgIH1cbiAgfVxuICBmb3IgKGNvbnN0IGNodW5rTmFtZSBvZiBvcHRzLm1vZHVsZXMgfHwgW10pIHtcbiAgICBpZiAoU0hBREVSX0NIVU5LU1tjaHVua05hbWVdKSB7XG4gICAgICBzb3VyY2UgKz0gYCR7U0hBREVSX0NIVU5LU1tjaHVua05hbWVdLnNvdXJjZX1cXG5gO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFNoYWRlciBtb2R1bGUgJHtjaHVua05hbWV9IG5vdCBmb3VuZGApO1xuICAgIH1cbiAgfVxuICBzb3VyY2UgKz0gdnM7XG4gIHJldHVybiBzb3VyY2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZVNoYWRlcnMoZ2wsIG9wdHMpIHtcbiAgcmV0dXJuIHtcbiAgICBnbCxcbiAgICB2czogYXNzZW1ibGVTaGFkZXIoZ2wsIG9wdHMpLFxuICAgIGZzOiBvcHRzLmZzXG4gIH07XG59XG4iXX0=