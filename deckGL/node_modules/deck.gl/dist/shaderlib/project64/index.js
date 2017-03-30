'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.project64 = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var project64 = exports.project64 = {
  interface: 'project64',
  source: 'const vec2 WORLD_SCALE_FP64 = vec2(81.4873275756836, 0.0000032873668232014097);\n\nuniform vec2 projectionScaleFP64;\nuniform vec2 projectionFP64[16];\n\nvoid mercatorProject_fp64(vec4 lnglat_fp64, out vec2 out_val[2]) { //longitude: lnglat_fp64.xy; latitude: lnglat_fp64.zw\n\n#if defined(NVIDIA_FP64_WORKAROUND)\n  out_val[0] = sum_fp64(radians_fp64(lnglat_fp64.xy), PI_FP64 * ONE);\n#else\n  out_val[0] = sum_fp64(radians_fp64(lnglat_fp64.xy), PI_FP64);\n#endif\n  out_val[1] = sub_fp64(PI_FP64, log_fp64(tan_fp64(sum_fp64(PI_4_FP64, radians_fp64(lnglat_fp64.zw) / 2.0))));\n  return;\n}\n\nvoid project_position_fp64(vec4 position_fp64, out vec2 out_val[2]) {\n\n  vec2 pos_fp64[2];\n  mercatorProject_fp64(position_fp64, pos_fp64);\n  vec2 x_fp64 = mul_fp64(pos_fp64[0], projectionScaleFP64);\n  vec2 y_fp64 = mul_fp64(pos_fp64[1], projectionScaleFP64);\n  out_val[0] = mul_fp64(x_fp64, WORLD_SCALE_FP64);\n  out_val[1] = mul_fp64(y_fp64, WORLD_SCALE_FP64);\n\n  return;\n}\n\nvec4 project_to_clipspace_fp64(vec2 vertex_pos_modelspace[4]) {\n  vec2 vertex_pos_clipspace[4];\n  mat4_vec4_mul_fp64(projectionFP64, vertex_pos_modelspace, vertex_pos_clipspace);\n  return vec4(\n    vertex_pos_clipspace[0].x,\n    vertex_pos_clipspace[1].x,\n    vertex_pos_clipspace[2].x,\n    vertex_pos_clipspace[3].x\n    );\n}\n'
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zaGFkZXJsaWIvcHJvamVjdDY0L2luZGV4LmpzIl0sIm5hbWVzIjpbInByb2plY3Q2NCIsImludGVyZmFjZSIsInNvdXJjZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOzs7Ozs7QUFDTyxJQUFNQSxnQ0FBWTtBQUN2QkMsYUFBVyxXQURZO0FBRXZCQztBQUZ1QixDQUFsQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmV4cG9ydCBjb25zdCBwcm9qZWN0NjQgPSB7XG4gIGludGVyZmFjZTogJ3Byb2plY3Q2NCcsXG4gIHNvdXJjZTogZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihfX2Rpcm5hbWUsICdwcm9qZWN0NjQuZ2xzbCcpLCAndXRmOCcpXG59O1xuIl19