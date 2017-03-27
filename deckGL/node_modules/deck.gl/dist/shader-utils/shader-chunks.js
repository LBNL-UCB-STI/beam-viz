'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fp = require('../shaderlib/fp64');

Object.keys(_fp).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _fp[key];
    }
  });
});

var _project = require('../shaderlib/project');

Object.keys(_project).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _project[key];
    }
  });
});

var _project2 = require('../shaderlib/project64');

Object.keys(_project2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _project2[key];
    }
  });
});

var _lighting = require('../shaderlib/lighting');

Object.keys(_lighting).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _lighting[key];
    }
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zaGFkZXItdXRpbHMvc2hhZGVyLWNodW5rcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSIsImZpbGUiOiJzaGFkZXItY2h1bmtzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTG9hZCBzaGFkZXIgY2h1bmtzXG5leHBvcnQgKiBmcm9tICcuLi9zaGFkZXJsaWIvZnA2NCc7XG5leHBvcnQgKiBmcm9tICcuLi9zaGFkZXJsaWIvcHJvamVjdCc7XG5leHBvcnQgKiBmcm9tICcuLi9zaGFkZXJsaWIvcHJvamVjdDY0JztcbmV4cG9ydCAqIGZyb20gJy4uL3NoYWRlcmxpYi9saWdodGluZyc7XG4iXX0=