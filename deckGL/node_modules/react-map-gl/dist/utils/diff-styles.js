'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diffSources = diffSources;
exports.diffLayers = diffLayers;
exports.default = diffStyle;
// Copyright (c) 2015 Uber Technologies, Inc.

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

/* eslint-disable max-statements */
function diffSources(prevStyle, nextStyle) {
  var prevSources = prevStyle.get('sources');
  var nextSources = nextStyle.get('sources');
  var enter = [];
  var update = [];
  var exit = [];
  var prevIds = prevSources.keySeq().toArray();
  var nextIds = nextSources.keySeq().toArray();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = prevIds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var id = _step.value;

      var nextSource = nextSources.get(id);
      if (nextSource) {
        if (!nextSource.equals(prevSources.get(id))) {
          update.push({ id: id, source: nextSources.get(id) });
        }
      } else {
        exit.push({ id: id, source: prevSources.get(id) });
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
    for (var _iterator2 = nextIds[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _id = _step2.value;

      var prevSource = prevSources.get(_id);
      if (!prevSource) {
        enter.push({ id: _id, source: nextSources.get(_id) });
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

  return { enter: enter, update: update, exit: exit };
}
/* eslint-enable max-statements */

function diffLayers(prevStyle, nextStyle) {
  var prevLayers = prevStyle.get('layers');
  var nextLayers = nextStyle.get('layers');
  var updates = [];
  var exiting = [];
  var prevMap = {};
  var nextMap = {};
  nextLayers.forEach(function (layer, index) {
    var id = layer.get('id');
    var layerImBehind = nextLayers.get(index + 1);
    nextMap[id] = {
      layer: layer,
      id: id,
      // The `id` of the layer before this one.
      before: layerImBehind ? layerImBehind.get('id') : null,
      enter: true
    };
  });
  prevLayers.forEach(function (layer, index) {
    var id = layer.get('id');
    var layerImBehind = prevLayers.get(index + 1);
    prevMap[id] = {
      layer: layer,
      id: id,
      before: layerImBehind ? layerImBehind.get('id') : null
    };
    if (nextMap[id]) {
      // Not a new layer.
      nextMap[id].enter = false;
    } else {
      // This layer is being removed.
      exiting.push(prevMap[id]);
    }
  });
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = nextLayers.reverse()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var layer = _step3.value;

      var id = layer.get('id');
      if (!prevMap[id] || !prevMap[id].layer.equals(nextMap[id].layer) || prevMap[id].before !== nextMap[id].before) {
        // This layer is being changed.
        updates.push(nextMap[id]);
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return { updates: updates, exiting: exiting };
}

function diffStyle(prevStyle, nextStyle) {
  return {
    sourcesDiff: diffSources(prevStyle, nextStyle),
    layersDiff: diffLayers(prevStyle, nextStyle)
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9kaWZmLXN0eWxlcy5qcyJdLCJuYW1lcyI6WyJkaWZmU291cmNlcyIsImRpZmZMYXllcnMiLCJkaWZmU3R5bGUiLCJwcmV2U3R5bGUiLCJuZXh0U3R5bGUiLCJwcmV2U291cmNlcyIsImdldCIsIm5leHRTb3VyY2VzIiwiZW50ZXIiLCJ1cGRhdGUiLCJleGl0IiwicHJldklkcyIsImtleVNlcSIsInRvQXJyYXkiLCJuZXh0SWRzIiwiaWQiLCJuZXh0U291cmNlIiwiZXF1YWxzIiwicHVzaCIsInNvdXJjZSIsInByZXZTb3VyY2UiLCJwcmV2TGF5ZXJzIiwibmV4dExheWVycyIsInVwZGF0ZXMiLCJleGl0aW5nIiwicHJldk1hcCIsIm5leHRNYXAiLCJmb3JFYWNoIiwibGF5ZXIiLCJpbmRleCIsImxheWVySW1CZWhpbmQiLCJiZWZvcmUiLCJyZXZlcnNlIiwic291cmNlc0RpZmYiLCJsYXllcnNEaWZmIl0sIm1hcHBpbmdzIjoiOzs7OztRQXFCZ0JBLFcsR0FBQUEsVztRQTRCQUMsVSxHQUFBQSxVO2tCQWdEUUMsUztBQWpHeEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDTyxTQUFTRixXQUFULENBQXFCRyxTQUFyQixFQUFnQ0MsU0FBaEMsRUFBMkM7QUFDaEQsTUFBTUMsY0FBY0YsVUFBVUcsR0FBVixDQUFjLFNBQWQsQ0FBcEI7QUFDQSxNQUFNQyxjQUFjSCxVQUFVRSxHQUFWLENBQWMsU0FBZCxDQUFwQjtBQUNBLE1BQU1FLFFBQVEsRUFBZDtBQUNBLE1BQU1DLFNBQVMsRUFBZjtBQUNBLE1BQU1DLE9BQU8sRUFBYjtBQUNBLE1BQU1DLFVBQVVOLFlBQVlPLE1BQVosR0FBcUJDLE9BQXJCLEVBQWhCO0FBQ0EsTUFBTUMsVUFBVVAsWUFBWUssTUFBWixHQUFxQkMsT0FBckIsRUFBaEI7QUFQZ0Q7QUFBQTtBQUFB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QkFBb0JPLFdBQVdVLE9BQVgsRUFBcEIsbUlBQTBDO0FBQUEsVUFBL0JKLEtBQStCOztBQUN4QyxVQUFNYixLQUFLYSxNQUFNdEIsR0FBTixDQUFVLElBQVYsQ0FBWDtBQUNBLFVBQ0UsQ0FBQ21CLFFBQVFWLEVBQVIsQ0FBRCxJQUNBLENBQUNVLFFBQVFWLEVBQVIsRUFBWWEsS0FBWixDQUFrQlgsTUFBbEIsQ0FBeUJTLFFBQVFYLEVBQVIsRUFBWWEsS0FBckMsQ0FERCxJQUVBSCxRQUFRVixFQUFSLEVBQVlnQixNQUFaLEtBQXVCTCxRQUFRWCxFQUFSLEVBQVlnQixNQUhyQyxFQUlFO0FBQ0E7QUFDQVIsZ0JBQVFMLElBQVIsQ0FBYVEsUUFBUVgsRUFBUixDQUFiO0FBQ0Q7QUFDRjtBQTVDOEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUE2Qy9DLFNBQU8sRUFBQ1EsZ0JBQUQsRUFBVUMsZ0JBQVYsRUFBUDtBQUNEOztBQUVjLFNBQVN0QixTQUFULENBQW1CQyxTQUFuQixFQUE4QkMsU0FBOUIsRUFBeUM7QUFDdEQsU0FBTztBQUNMNkIsaUJBQWFqQyxZQUFZRyxTQUFaLEVBQXVCQyxTQUF2QixDQURSO0FBRUw4QixnQkFBWWpDLFdBQVdFLFNBQVgsRUFBc0JDLFNBQXRCO0FBRlAsR0FBUDtBQUlEIiwiZmlsZSI6ImRpZmYtc3R5bGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG5cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuLyogZXNsaW50LWRpc2FibGUgbWF4LXN0YXRlbWVudHMgKi9cbmV4cG9ydCBmdW5jdGlvbiBkaWZmU291cmNlcyhwcmV2U3R5bGUsIG5leHRTdHlsZSkge1xuICBjb25zdCBwcmV2U291cmNlcyA9IHByZXZTdHlsZS5nZXQoJ3NvdXJjZXMnKTtcbiAgY29uc3QgbmV4dFNvdXJjZXMgPSBuZXh0U3R5bGUuZ2V0KCdzb3VyY2VzJyk7XG4gIGNvbnN0IGVudGVyID0gW107XG4gIGNvbnN0IHVwZGF0ZSA9IFtdO1xuICBjb25zdCBleGl0ID0gW107XG4gIGNvbnN0IHByZXZJZHMgPSBwcmV2U291cmNlcy5rZXlTZXEoKS50b0FycmF5KCk7XG4gIGNvbnN0IG5leHRJZHMgPSBuZXh0U291cmNlcy5rZXlTZXEoKS50b0FycmF5KCk7XG4gIGZvciAoY29uc3QgaWQgb2YgcHJldklkcykge1xuICAgIGNvbnN0IG5leHRTb3VyY2UgPSBuZXh0U291cmNlcy5nZXQoaWQpO1xuICAgIGlmIChuZXh0U291cmNlKSB7XG4gICAgICBpZiAoIW5leHRTb3VyY2UuZXF1YWxzKHByZXZTb3VyY2VzLmdldChpZCkpKSB7XG4gICAgICAgIHVwZGF0ZS5wdXNoKHtpZCwgc291cmNlOiBuZXh0U291cmNlcy5nZXQoaWQpfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4aXQucHVzaCh7aWQsIHNvdXJjZTogcHJldlNvdXJjZXMuZ2V0KGlkKX0pO1xuICAgIH1cbiAgfVxuICBmb3IgKGNvbnN0IGlkIG9mIG5leHRJZHMpIHtcbiAgICBjb25zdCBwcmV2U291cmNlID0gcHJldlNvdXJjZXMuZ2V0KGlkKTtcbiAgICBpZiAoIXByZXZTb3VyY2UpIHtcbiAgICAgIGVudGVyLnB1c2goe2lkLCBzb3VyY2U6IG5leHRTb3VyY2VzLmdldChpZCl9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtlbnRlciwgdXBkYXRlLCBleGl0fTtcbn1cbi8qIGVzbGludC1lbmFibGUgbWF4LXN0YXRlbWVudHMgKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZMYXllcnMocHJldlN0eWxlLCBuZXh0U3R5bGUpIHtcbiAgY29uc3QgcHJldkxheWVycyA9IHByZXZTdHlsZS5nZXQoJ2xheWVycycpO1xuICBjb25zdCBuZXh0TGF5ZXJzID0gbmV4dFN0eWxlLmdldCgnbGF5ZXJzJyk7XG4gIGNvbnN0IHVwZGF0ZXMgPSBbXTtcbiAgY29uc3QgZXhpdGluZyA9IFtdO1xuICBjb25zdCBwcmV2TWFwID0ge307XG4gIGNvbnN0IG5leHRNYXAgPSB7fTtcbiAgbmV4dExheWVycy5mb3JFYWNoKChsYXllciwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBpZCA9IGxheWVyLmdldCgnaWQnKTtcbiAgICBjb25zdCBsYXllckltQmVoaW5kID0gbmV4dExheWVycy5nZXQoaW5kZXggKyAxKTtcbiAgICBuZXh0TWFwW2lkXSA9IHtcbiAgICAgIGxheWVyLFxuICAgICAgaWQsXG4gICAgICAvLyBUaGUgYGlkYCBvZiB0aGUgbGF5ZXIgYmVmb3JlIHRoaXMgb25lLlxuICAgICAgYmVmb3JlOiBsYXllckltQmVoaW5kID8gbGF5ZXJJbUJlaGluZC5nZXQoJ2lkJykgOiBudWxsLFxuICAgICAgZW50ZXI6IHRydWVcbiAgICB9O1xuICB9KTtcbiAgcHJldkxheWVycy5mb3JFYWNoKChsYXllciwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBpZCA9IGxheWVyLmdldCgnaWQnKTtcbiAgICBjb25zdCBsYXllckltQmVoaW5kID0gcHJldkxheWVycy5nZXQoaW5kZXggKyAxKTtcbiAgICBwcmV2TWFwW2lkXSA9IHtcbiAgICAgIGxheWVyLFxuICAgICAgaWQsXG4gICAgICBiZWZvcmU6IGxheWVySW1CZWhpbmQgPyBsYXllckltQmVoaW5kLmdldCgnaWQnKSA6IG51bGxcbiAgICB9O1xuICAgIGlmIChuZXh0TWFwW2lkXSkge1xuICAgICAgLy8gTm90IGEgbmV3IGxheWVyLlxuICAgICAgbmV4dE1hcFtpZF0uZW50ZXIgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhpcyBsYXllciBpcyBiZWluZyByZW1vdmVkLlxuICAgICAgZXhpdGluZy5wdXNoKHByZXZNYXBbaWRdKTtcbiAgICB9XG4gIH0pO1xuICBmb3IgKGNvbnN0IGxheWVyIG9mIG5leHRMYXllcnMucmV2ZXJzZSgpKSB7XG4gICAgY29uc3QgaWQgPSBsYXllci5nZXQoJ2lkJyk7XG4gICAgaWYgKFxuICAgICAgIXByZXZNYXBbaWRdIHx8XG4gICAgICAhcHJldk1hcFtpZF0ubGF5ZXIuZXF1YWxzKG5leHRNYXBbaWRdLmxheWVyKSB8fFxuICAgICAgcHJldk1hcFtpZF0uYmVmb3JlICE9PSBuZXh0TWFwW2lkXS5iZWZvcmVcbiAgICApIHtcbiAgICAgIC8vIFRoaXMgbGF5ZXIgaXMgYmVpbmcgY2hhbmdlZC5cbiAgICAgIHVwZGF0ZXMucHVzaChuZXh0TWFwW2lkXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB7dXBkYXRlcywgZXhpdGluZ307XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRpZmZTdHlsZShwcmV2U3R5bGUsIG5leHRTdHlsZSkge1xuICByZXR1cm4ge1xuICAgIHNvdXJjZXNEaWZmOiBkaWZmU291cmNlcyhwcmV2U3R5bGUsIG5leHRTdHlsZSksXG4gICAgbGF5ZXJzRGlmZjogZGlmZkxheWVycyhwcmV2U3R5bGUsIG5leHRTdHlsZSlcbiAgfTtcbn1cbiJdfQ==