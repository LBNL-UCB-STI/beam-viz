'use strict';

module.exports = {
  project: {
    interface: 'project',
    source: 'uniform bool pickingEnabled;\nvarying vec4 vPickingColor;\n\nvoid picking_set_color(vec4 normalColor, vec3 pickingColor) {\n  vPickingColor = mix(normalColor, vec4(pickingColor.rgb, 1.), pickingEnabled);\n}\n',
    fragmentSource: 'uniform bool pickingEnabled;\n\nvarying vec4 vPickingColor;\n\nvec4 picking_get_color() {\n  return vPickingColor;\n}'
  }
}; /* eslint-disable */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zaGFkZXJsaWIvcGljay9pbmRleC5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwicHJvamVjdCIsImludGVyZmFjZSIsInNvdXJjZSIsImZyYWdtZW50U291cmNlIl0sIm1hcHBpbmdzIjoiOztBQUVBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFdBQVM7QUFDUkMsZUFBVyxTQURIO0FBRVJDLDhOQUZRO0FBR1JDO0FBSFE7QUFETSxDQUFqQixDLENBRkEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSAqL1xudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICBwcm9qZWN0OiB7XG4gIFx0aW50ZXJmYWNlOiAncHJvamVjdCcsXG4gIFx0c291cmNlOiBmcy5yZWFkRmlsZVN5bmMoX19kaXJuYW1lICsgJy9waWNraW5nLnZlcnRleC5nbHNsJywgJ3V0ZjgnKSxcbiAgXHRmcmFnbWVudFNvdXJjZTogZnMucmVhZEZpbGVTeW5jKF9fZGlybmFtZSArICcvcGlja2luZy5mcmFnbWVudC5nbHNsJywgJ3V0ZjgnKVxuICB9XG59O1xuIl19