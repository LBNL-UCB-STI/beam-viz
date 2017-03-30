"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Note: The numeric values here are matched by shader code in the
// "project" and "project64" shader modules. Both places need to be
// updated.

// TODO: Maybe "POSITIONS" would be a better name?
var COORDINATE_SYSTEM = exports.COORDINATE_SYSTEM = {
  // Positions are interpreted as [lng, lat, elevation]
  // lng lat are degrees, elevation is meters. distances as meters.
  LNGLAT: 1.0,

  // Positions are interpreted as lng lat offsets: [deltaLng, deltaLat, elevation]
  // deltaLng, deltaLat are delta degrees, elevation is meters.
  // distances as meters.
  LNGLAT_OFFSETS: 3.0,

  // Positions are interpreted as meter offsets, distances as meters
  METER_OFFSETS: 2.0,
  METERS: 2.0,

  // Positions and distances are not transformed: [x, y, z] in unit coordinates
  IDENTITY: 0.0
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvY29uc3RhbnRzLmpzIl0sIm5hbWVzIjpbIkNPT1JESU5BVEVfU1lTVEVNIiwiTE5HTEFUIiwiTE5HTEFUX09GRlNFVFMiLCJNRVRFUl9PRkZTRVRTIiwiTUVURVJTIiwiSURFTlRJVFkiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBOztBQUVBO0FBQ08sSUFBTUEsZ0RBQW9CO0FBQy9CO0FBQ0E7QUFDQUMsVUFBUSxHQUh1Qjs7QUFLL0I7QUFDQTtBQUNBO0FBQ0FDLGtCQUFnQixHQVJlOztBQVUvQjtBQUNBQyxpQkFBZSxHQVhnQjtBQVkvQkMsVUFBUSxHQVp1Qjs7QUFjL0I7QUFDQUMsWUFBVTtBQWZxQixDQUExQiIsImZpbGUiOiJjb25zdGFudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBOb3RlOiBUaGUgbnVtZXJpYyB2YWx1ZXMgaGVyZSBhcmUgbWF0Y2hlZCBieSBzaGFkZXIgY29kZSBpbiB0aGVcbi8vIFwicHJvamVjdFwiIGFuZCBcInByb2plY3Q2NFwiIHNoYWRlciBtb2R1bGVzLiBCb3RoIHBsYWNlcyBuZWVkIHRvIGJlXG4vLyB1cGRhdGVkLlxuXG4vLyBUT0RPOiBNYXliZSBcIlBPU0lUSU9OU1wiIHdvdWxkIGJlIGEgYmV0dGVyIG5hbWU/XG5leHBvcnQgY29uc3QgQ09PUkRJTkFURV9TWVNURU0gPSB7XG4gIC8vIFBvc2l0aW9ucyBhcmUgaW50ZXJwcmV0ZWQgYXMgW2xuZywgbGF0LCBlbGV2YXRpb25dXG4gIC8vIGxuZyBsYXQgYXJlIGRlZ3JlZXMsIGVsZXZhdGlvbiBpcyBtZXRlcnMuIGRpc3RhbmNlcyBhcyBtZXRlcnMuXG4gIExOR0xBVDogMS4wLFxuXG4gIC8vIFBvc2l0aW9ucyBhcmUgaW50ZXJwcmV0ZWQgYXMgbG5nIGxhdCBvZmZzZXRzOiBbZGVsdGFMbmcsIGRlbHRhTGF0LCBlbGV2YXRpb25dXG4gIC8vIGRlbHRhTG5nLCBkZWx0YUxhdCBhcmUgZGVsdGEgZGVncmVlcywgZWxldmF0aW9uIGlzIG1ldGVycy5cbiAgLy8gZGlzdGFuY2VzIGFzIG1ldGVycy5cbiAgTE5HTEFUX09GRlNFVFM6IDMuMCxcblxuICAvLyBQb3NpdGlvbnMgYXJlIGludGVycHJldGVkIGFzIG1ldGVyIG9mZnNldHMsIGRpc3RhbmNlcyBhcyBtZXRlcnNcbiAgTUVURVJfT0ZGU0VUUzogMi4wLFxuICBNRVRFUlM6IDIuMCxcblxuICAvLyBQb3NpdGlvbnMgYW5kIGRpc3RhbmNlcyBhcmUgbm90IHRyYW5zZm9ybWVkOiBbeCwgeSwgel0gaW4gdW5pdCBjb29yZGluYXRlc1xuICBJREVOVElUWTogMC4wXG59O1xuIl19