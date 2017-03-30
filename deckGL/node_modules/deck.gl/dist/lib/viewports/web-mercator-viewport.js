'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _viewport = require('./viewport');

var _viewport2 = _interopRequireDefault(_viewport);

var _glMatrix = require('gl-matrix');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // View and Projection Matrix calculations for mapbox-js style
// map view properties


// CONSTANTS
var PI = Math.PI;
var PI_4 = PI / 4;
var DEGREES_TO_RADIANS = PI / 180;
var RADIANS_TO_DEGREES = 180 / PI;
var TILE_SIZE = 512;
var WORLD_SCALE = TILE_SIZE / (2 * PI);

var DEFAULT_MAP_STATE = {
  latitude: 37,
  longitude: -122,
  zoom: 11,
  pitch: 0,
  bearing: 0,
  altitude: 1.5
};

var WebMercatorViewport = function (_Viewport) {
  _inherits(WebMercatorViewport, _Viewport);

  /**
   * @classdesc
   * Creates view/projection matrices from mercator params
   * Note: The Viewport is immutable in the sense that it only has accessors.
   * A new viewport instance should be created if any parameters have changed.
   *
   * @class
   * @param {Object} opt - options
   * @param {Boolean} mercator=true - Whether to use mercator projection
   *
   * @param {Number} opt.width=1 - Width of "viewport" or window
   * @param {Number} opt.height=1 - Height of "viewport" or window
   * @param {Array} opt.center=[0, 0] - Center of viewport
   *   [longitude, latitude] or [x, y]
   * @param {Number} opt.scale=1 - Either use scale or zoom
   * @param {Number} opt.pitch=0 - Camera angle in degrees (0 is straight down)
   * @param {Number} opt.bearing=0 - Map rotation in degrees (0 means north is up)
   * @param {Number} opt.altitude= - Altitude of camera in screen units
   *
   * Web mercator projection short-hand parameters
   * @param {Number} opt.latitude - Center of viewport on map (alternative to opt.center)
   * @param {Number} opt.longitude - Center of viewport on map (alternative to opt.center)
   * @param {Number} opt.zoom - Scale = Math.pow(2,zoom) on map (alternative to opt.scale)
    * Notes:
   *  - Only one of center or [latitude, longitude] can be specified
   *  - [latitude, longitude] can only be specified when "mercator" is true
   *  - Altitude has a default value that matches assumptions in mapbox-gl
   *  - width and height are forced to 1 if supplied as 0, to avoid
   *    division by zero. This is intended to reduce the burden of apps to
   *    to check values before instantiating a Viewport.
   */
  /* eslint-disable complexity, max-statements */
  function WebMercatorViewport() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        width = _ref.width,
        height = _ref.height,
        latitude = _ref.latitude,
        longitude = _ref.longitude,
        zoom = _ref.zoom,
        pitch = _ref.pitch,
        bearing = _ref.bearing,
        altitude = _ref.altitude,
        mercatorEnabled = _ref.mercatorEnabled;

    _classCallCheck(this, WebMercatorViewport);

    // Viewport - support undefined arguments
    width = width !== undefined ? width : DEFAULT_MAP_STATE.width;
    height = height !== undefined ? height : DEFAULT_MAP_STATE.height;
    zoom = zoom !== undefined ? zoom : DEFAULT_MAP_STATE.zoom;
    latitude = latitude !== undefined ? latitude : DEFAULT_MAP_STATE.latitude;
    longitude = longitude !== undefined ? longitude : DEFAULT_MAP_STATE.longitude;
    bearing = bearing !== undefined ? bearing : DEFAULT_MAP_STATE.bearing;
    pitch = pitch !== undefined ? pitch : DEFAULT_MAP_STATE.pitch;
    altitude = altitude !== undefined ? altitude : DEFAULT_MAP_STATE.altitude;

    // Silently allow apps to send in 0,0 to facilitate isomorphic render etc
    width = width || 1;
    height = height || 1;

    var scale = Math.pow(2, zoom);
    // Altitude - prevent division by 0
    // TODO - just throw an Error instead?
    altitude = Math.max(0.75, altitude);

    var distanceScales = calculateDistanceScales({ latitude: latitude, longitude: longitude, scale: scale });

    var projectionMatrix = makeProjectionMatrixFromMercatorParams({
      width: width,
      height: height,
      pitch: pitch,
      bearing: bearing,
      altitude: altitude
    });

    var _makeViewMatrixFromMe = makeViewMatrixFromMercatorParams({
      width: width,
      height: height,
      longitude: longitude,
      latitude: latitude,
      zoom: zoom,
      pitch: pitch,
      bearing: bearing,
      altitude: altitude,
      distanceScales: distanceScales
    }),
        viewMatrix = _makeViewMatrixFromMe.viewMatrix,
        viewMatrixUncentered = _makeViewMatrixFromMe.viewMatrixUncentered,
        viewCenter = _makeViewMatrixFromMe.viewCenter;

    // Add additional matrices
    var _this = _possibleConstructorReturn(this, (WebMercatorViewport.__proto__ || Object.getPrototypeOf(WebMercatorViewport)).call(this, { width: width, height: height, viewMatrix: viewMatrix, projectionMatrix: projectionMatrix }));

    _this.viewMatrixUncentered = viewMatrixUncentered;
    _this.viewCenter = viewCenter;

    // Save parameters
    _this.latitude = latitude;
    _this.longitude = longitude;
    _this.zoom = zoom;
    _this.pitch = pitch;
    _this.bearing = bearing;
    _this.altitude = altitude;

    _this.scale = scale;

    _this._distanceScales = distanceScales;

    _this.getDistanceScales = _this.getDistanceScales.bind(_this);
    _this.metersToLngLatDelta = _this.metersToLngLatDelta.bind(_this);
    _this.lngLatDeltaToMeters = _this.lngLatDeltaToMeters.bind(_this);
    _this.addMetersToLngLat = _this.addMetersToLngLat.bind(_this);
    return _this;
  }
  /* eslint-enable complexity, max-statements */

  /**
   * Project [lng,lat] on sphere onto [x,y] on 512*512 Mercator Zoom 0 tile.
   * Performs the nonlinear part of the web mercator projection.
   * Remaining projection is done with 4x4 matrices which also handles
   * perspective.
   *
   * @param {Array} lngLat - [lng, lat] coordinates
   *   Specifies a point on the sphere to project onto the map.
   * @return {Array} [x,y] coordinates.
   */


  _createClass(WebMercatorViewport, [{
    key: '_projectFlat',
    value: function _projectFlat(lngLat) {
      var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.scale;

      return projectFlat(lngLat, scale);
    }

    /**
     * Unproject world point [x,y] on map onto {lat, lon} on sphere
     *
     * @param {object|Vector} xy - object with {x,y} members
     *  representing point on projected map plane
     * @return {GeoCoordinates} - object with {lat,lon} of point on sphere.
     *   Has toArray method if you need a GeoJSON Array.
     *   Per cartographic tradition, lat and lon are specified as degrees.
     */

  }, {
    key: '_unprojectFlat',
    value: function _unprojectFlat(xy) {
      var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.scale;

      return unprojectFlat(xy, scale);
    }
  }, {
    key: 'getDistanceScales',
    value: function getDistanceScales() {
      return this._distanceScales;
    }

    /**
     * Converts a meter offset to a lnglat offset
     *
     * Note: Uses simple linear approximation around the viewport center
     * Error increases with size of offset (roughly 1% per 100km)
     *
     * @param {[Number,Number]|[Number,Number,Number]) xyz - array of meter deltas
     * @return {[Number,Number]|[Number,Number,Number]) - array of [lng,lat,z] deltas
     */

  }, {
    key: 'metersToLngLatDelta',
    value: function metersToLngLatDelta(xyz) {
      var _xyz = _slicedToArray(xyz, 3),
          x = _xyz[0],
          y = _xyz[1],
          _xyz$ = _xyz[2],
          z = _xyz$ === undefined ? 0 : _xyz$;

      var _distanceScales = this._distanceScales,
          pixelsPerMeter = _distanceScales.pixelsPerMeter,
          degreesPerPixel = _distanceScales.degreesPerPixel;

      var deltaLng = x * pixelsPerMeter[0] * degreesPerPixel[0];
      var deltaLat = y * pixelsPerMeter[1] * degreesPerPixel[1];
      return xyz.length === 2 ? [deltaLng, deltaLat] : [deltaLng, deltaLat, z];
    }

    /**
     * Converts a lnglat offset to a meter offset
     *
     * Note: Uses simple linear approximation around the viewport center
     * Error increases with size of offset (roughly 1% per 100km)
     *
     * @param {[Number,Number]|[Number,Number,Number]) deltaLngLatZ - array of [lng,lat,z] deltas
     * @return {[Number,Number]|[Number,Number,Number]) - array of meter deltas
     */

  }, {
    key: 'lngLatDeltaToMeters',
    value: function lngLatDeltaToMeters(deltaLngLatZ) {
      var _deltaLngLatZ = _slicedToArray(deltaLngLatZ, 3),
          deltaLng = _deltaLngLatZ[0],
          deltaLat = _deltaLngLatZ[1],
          _deltaLngLatZ$ = _deltaLngLatZ[2],
          deltaZ = _deltaLngLatZ$ === undefined ? 0 : _deltaLngLatZ$;

      var _distanceScales2 = this._distanceScales,
          pixelsPerDegree = _distanceScales2.pixelsPerDegree,
          metersPerPixel = _distanceScales2.metersPerPixel;

      var deltaX = deltaLng * pixelsPerDegree[0] * metersPerPixel[0];
      var deltaY = deltaLat * pixelsPerDegree[1] * metersPerPixel[1];
      return deltaLngLatZ.length === 2 ? [deltaX, deltaY] : [deltaX, deltaY, deltaZ];
    }

    /**
     * Add a meter delta to a base lnglat coordinate, returning a new lnglat array
     *
     * Note: Uses simple linear approximation around the viewport center
     * Error increases with size of offset (roughly 1% per 100km)
     *
     * @param {[Number,Number]|[Number,Number,Number]) lngLatZ - base coordinate
     * @param {[Number,Number]|[Number,Number,Number]) xyz - array of meter deltas
     * @return {[Number,Number]|[Number,Number,Number]) array of [lng,lat,z] deltas
     */

  }, {
    key: 'addMetersToLngLat',
    value: function addMetersToLngLat(lngLatZ, xyz) {
      var _lngLatZ = _slicedToArray(lngLatZ, 3),
          lng = _lngLatZ[0],
          lat = _lngLatZ[1],
          _lngLatZ$ = _lngLatZ[2],
          Z = _lngLatZ$ === undefined ? 0 : _lngLatZ$;

      var _metersToLngLatDelta = this.metersToLngLatDelta(xyz),
          _metersToLngLatDelta2 = _slicedToArray(_metersToLngLatDelta, 3),
          deltaLng = _metersToLngLatDelta2[0],
          deltaLat = _metersToLngLatDelta2[1],
          _metersToLngLatDelta3 = _metersToLngLatDelta2[2],
          deltaZ = _metersToLngLatDelta3 === undefined ? 0 : _metersToLngLatDelta3;

      return lngLatZ.length === 2 ? [lng + deltaLng, lat + deltaLat] : [lng + deltaLng, lat + deltaLat, Z + deltaZ];
    }

    // INTERNAL METHODS

  }, {
    key: '_getParams',
    value: function _getParams() {
      return this._distanceScales;
    }
  }]);

  return WebMercatorViewport;
}(_viewport2.default);

/**
 * Project [lng,lat] on sphere onto [x,y] on 512*512 Mercator Zoom 0 tile.
 * Performs the nonlinear part of the web mercator projection.
 * Remaining projection is done with 4x4 matrices which also handles
 * perspective.
 *
 * @param {Array} lngLat - [lng, lat] coordinates
 *   Specifies a point on the sphere to project onto the map.
 * @return {Array} [x,y] coordinates.
 */


exports.default = WebMercatorViewport;
function projectFlat(_ref2, scale) {
  var _ref3 = _slicedToArray(_ref2, 2),
      lng = _ref3[0],
      lat = _ref3[1];

  scale = scale * WORLD_SCALE;
  var lambda2 = lng * DEGREES_TO_RADIANS;
  var phi2 = lat * DEGREES_TO_RADIANS;
  var x = scale * (lambda2 + PI);
  var y = scale * (PI - Math.log(Math.tan(PI_4 + phi2 * 0.5)));
  return [x, y];
}

/**
 * Unproject world point [x,y] on map onto {lat, lon} on sphere
 *
 * @param {object|Vector} xy - object with {x,y} members
 *  representing point on projected map plane
 * @return {GeoCoordinates} - object with {lat,lon} of point on sphere.
 *   Has toArray method if you need a GeoJSON Array.
 *   Per cartographic tradition, lat and lon are specified as degrees.
 */
function unprojectFlat(_ref4, scale) {
  var _ref5 = _slicedToArray(_ref4, 2),
      x = _ref5[0],
      y = _ref5[1];

  scale = scale * WORLD_SCALE;
  var lambda2 = x / scale - PI;
  var phi2 = 2 * (Math.atan(Math.exp(PI - y / scale)) - PI_4);
  return [lambda2 * RADIANS_TO_DEGREES, phi2 * RADIANS_TO_DEGREES];
}

/**
 * Calculate distance scales in meters around current lat/lon, both for
 * degrees and pixels.
 * In mercator projection mode, the distance scales vary significantly
 * with latitude.
 */
function calculateDistanceScales(_ref6) {
  var latitude = _ref6.latitude,
      longitude = _ref6.longitude,
      scale = _ref6.scale;

  // Approximately 111km per degree at equator
  var METERS_PER_DEGREE = 111000;

  var latCosine = Math.cos(latitude * Math.PI / 180);

  var metersPerDegree = METERS_PER_DEGREE * latCosine;

  // Calculate number of pixels occupied by one degree longitude
  // around current lat/lon
  var pixelsPerDegreeX = _glMatrix.vec2.distance(projectFlat([longitude + 0.5, latitude]), projectFlat([longitude - 0.5, latitude]));
  // Calculate number of pixels occupied by one degree latitude
  // around current lat/lon
  var pixelsPerDegreeY = _glMatrix.vec2.distance(projectFlat([longitude, latitude + 0.5]), projectFlat([longitude, latitude - 0.5]));

  var pixelsPerMeterX = pixelsPerDegreeX / metersPerDegree;
  var pixelsPerMeterY = pixelsPerDegreeY / metersPerDegree;
  var pixelsPerMeterZ = (pixelsPerMeterX + pixelsPerMeterY) / 2;
  // const pixelsPerMeter = [pixelsPerMeterX, pixelsPerMeterY, pixelsPerMeterZ];

  var worldSize = TILE_SIZE * scale;
  var altPixelsPerMeter = worldSize / (4e7 * latCosine);
  var pixelsPerMeter = [altPixelsPerMeter, altPixelsPerMeter, altPixelsPerMeter];
  var metersPerPixel = [1 / altPixelsPerMeter, 1 / altPixelsPerMeter, 1 / pixelsPerMeterZ];

  var pixelsPerDegree = [pixelsPerDegreeX, pixelsPerDegreeY, pixelsPerMeterZ];
  var degreesPerPixel = [1 / pixelsPerDegreeX, 1 / pixelsPerDegreeY, 1 / pixelsPerMeterZ];

  // Main results, used for converting meters to latlng deltas and scaling offsets
  return {
    pixelsPerMeter: pixelsPerMeter,
    metersPerPixel: metersPerPixel,
    pixelsPerDegree: pixelsPerDegree,
    degreesPerPixel: degreesPerPixel
  };
}

// ATTRIBUTION:
// view and projection matrix creation is intentionally kept compatible with
// mapbox-gl's implementation to ensure that seamless interoperation
// with mapbox and react-map-gl. See: https://github.com/mapbox/mapbox-gl-js
function makeProjectionMatrixFromMercatorParams(_ref7) {
  var width = _ref7.width,
      height = _ref7.height,
      pitch = _ref7.pitch,
      altitude = _ref7.altitude;

  var pitchRadians = pitch * DEGREES_TO_RADIANS;

  // PROJECTION MATRIX: PROJECTS FROM CAMERA SPACE TO CLIPSPACE
  // Find the distance from the center point to the center top
  // in altitude units using law of sines.
  var halfFov = Math.atan(0.5 / altitude);
  var topHalfSurfaceDistance = Math.sin(halfFov) * altitude / Math.sin(Math.PI / 2 - pitchRadians - halfFov);

  // Calculate z value of the farthest fragment that should be rendered.
  var farZ = Math.cos(Math.PI / 2 - pitchRadians) * topHalfSurfaceDistance + altitude;

  var projectionMatrix = _glMatrix.mat4.perspective((0, _viewport.createMat4)(), 2 * Math.atan(height / 2 / altitude), // fov in radians
  width / height, // aspect ratio
  0.1, // near plane
  farZ * 10.0 // far plane
  );

  return projectionMatrix;
}

function makeViewMatrixFromMercatorParams(_ref8) {
  var width = _ref8.width,
      height = _ref8.height,
      longitude = _ref8.longitude,
      latitude = _ref8.latitude,
      zoom = _ref8.zoom,
      pitch = _ref8.pitch,
      bearing = _ref8.bearing,
      altitude = _ref8.altitude;

  // Center x, y
  var scale = Math.pow(2, zoom);
  // VIEW MATRIX: PROJECTS FROM VIRTUAL PIXELS TO CAMERA SPACE
  // Note: As usual, matrix operation orders should be read in reverse
  // since vectors will be multiplied from the right during transformation
  var vm = (0, _viewport.createMat4)();

  // Move camera to altitude
  _glMatrix.mat4.translate(vm, vm, [0, 0, -altitude]);

  // After the rotateX, z values are in pixel units. Convert them to
  // altitude units. 1 altitude unit = the screen height.
  _glMatrix.mat4.scale(vm, vm, [1, -1, 1 / height]);

  // Rotate by bearing, and then by pitch (which tilts the view)
  _glMatrix.mat4.rotateX(vm, vm, pitch * DEGREES_TO_RADIANS);
  _glMatrix.mat4.rotateZ(vm, vm, -bearing * DEGREES_TO_RADIANS);

  var _projectFlat2 = projectFlat([longitude, latitude], scale),
      _projectFlat3 = _slicedToArray(_projectFlat2, 2),
      centerX = _projectFlat3[0],
      centerY = _projectFlat3[1];

  var center = [-centerX, -centerY, 0, 1];
  var viewCenter = _glMatrix.vec4.transformMat4([], center, vm);

  var vmCentered = _glMatrix.mat4.translate([], vm, [-centerX, -centerY, 0]);

  return {
    viewMatrix: vmCentered,
    viewMatrixUncentered: vm,
    viewCenter: viewCenter
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdmlld3BvcnRzL3dlYi1tZXJjYXRvci12aWV3cG9ydC5qcyJdLCJuYW1lcyI6WyJQSSIsIk1hdGgiLCJQSV80IiwiREVHUkVFU19UT19SQURJQU5TIiwiUkFESUFOU19UT19ERUdSRUVTIiwiVElMRV9TSVpFIiwiV09STERfU0NBTEUiLCJERUZBVUxUX01BUF9TVEFURSIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwiem9vbSIsInBpdGNoIiwiYmVhcmluZyIsImFsdGl0dWRlIiwiV2ViTWVyY2F0b3JWaWV3cG9ydCIsIndpZHRoIiwiaGVpZ2h0IiwibWVyY2F0b3JFbmFibGVkIiwidW5kZWZpbmVkIiwic2NhbGUiLCJwb3ciLCJtYXgiLCJkaXN0YW5jZVNjYWxlcyIsImNhbGN1bGF0ZURpc3RhbmNlU2NhbGVzIiwicHJvamVjdGlvbk1hdHJpeCIsIm1ha2VQcm9qZWN0aW9uTWF0cml4RnJvbU1lcmNhdG9yUGFyYW1zIiwibWFrZVZpZXdNYXRyaXhGcm9tTWVyY2F0b3JQYXJhbXMiLCJ2aWV3TWF0cml4Iiwidmlld01hdHJpeFVuY2VudGVyZWQiLCJ2aWV3Q2VudGVyIiwiX2Rpc3RhbmNlU2NhbGVzIiwiZ2V0RGlzdGFuY2VTY2FsZXMiLCJiaW5kIiwibWV0ZXJzVG9MbmdMYXREZWx0YSIsImxuZ0xhdERlbHRhVG9NZXRlcnMiLCJhZGRNZXRlcnNUb0xuZ0xhdCIsImxuZ0xhdCIsInByb2plY3RGbGF0IiwieHkiLCJ1bnByb2plY3RGbGF0IiwieHl6IiwieCIsInkiLCJ6IiwicGl4ZWxzUGVyTWV0ZXIiLCJkZWdyZWVzUGVyUGl4ZWwiLCJkZWx0YUxuZyIsImRlbHRhTGF0IiwibGVuZ3RoIiwiZGVsdGFMbmdMYXRaIiwiZGVsdGFaIiwicGl4ZWxzUGVyRGVncmVlIiwibWV0ZXJzUGVyUGl4ZWwiLCJkZWx0YVgiLCJkZWx0YVkiLCJsbmdMYXRaIiwibG5nIiwibGF0IiwiWiIsImxhbWJkYTIiLCJwaGkyIiwibG9nIiwidGFuIiwiYXRhbiIsImV4cCIsIk1FVEVSU19QRVJfREVHUkVFIiwibGF0Q29zaW5lIiwiY29zIiwibWV0ZXJzUGVyRGVncmVlIiwicGl4ZWxzUGVyRGVncmVlWCIsImRpc3RhbmNlIiwicGl4ZWxzUGVyRGVncmVlWSIsInBpeGVsc1Blck1ldGVyWCIsInBpeGVsc1Blck1ldGVyWSIsInBpeGVsc1Blck1ldGVyWiIsIndvcmxkU2l6ZSIsImFsdFBpeGVsc1Blck1ldGVyIiwicGl0Y2hSYWRpYW5zIiwiaGFsZkZvdiIsInRvcEhhbGZTdXJmYWNlRGlzdGFuY2UiLCJzaW4iLCJmYXJaIiwicGVyc3BlY3RpdmUiLCJ2bSIsInRyYW5zbGF0ZSIsInJvdGF0ZVgiLCJyb3RhdGVaIiwiY2VudGVyWCIsImNlbnRlclkiLCJjZW50ZXIiLCJ0cmFuc2Zvcm1NYXQ0Iiwidm1DZW50ZXJlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7OytlQUhBO0FBQ0E7OztBQUlBO0FBQ0EsSUFBTUEsS0FBS0MsS0FBS0QsRUFBaEI7QUFDQSxJQUFNRSxPQUFPRixLQUFLLENBQWxCO0FBQ0EsSUFBTUcscUJBQXFCSCxLQUFLLEdBQWhDO0FBQ0EsSUFBTUkscUJBQXFCLE1BQU1KLEVBQWpDO0FBQ0EsSUFBTUssWUFBWSxHQUFsQjtBQUNBLElBQU1DLGNBQWNELGFBQWEsSUFBSUwsRUFBakIsQ0FBcEI7O0FBRUEsSUFBTU8sb0JBQW9CO0FBQ3hCQyxZQUFVLEVBRGM7QUFFeEJDLGFBQVcsQ0FBQyxHQUZZO0FBR3hCQyxRQUFNLEVBSGtCO0FBSXhCQyxTQUFPLENBSmlCO0FBS3hCQyxXQUFTLENBTGU7QUFNeEJDLFlBQVU7QUFOYyxDQUExQjs7SUFTcUJDLG1COzs7QUFDbkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQ0E7QUFDQSxpQ0FXUTtBQUFBLG1GQUFKLEVBQUk7QUFBQSxRQVROQyxLQVNNLFFBVE5BLEtBU007QUFBQSxRQVJOQyxNQVFNLFFBUk5BLE1BUU07QUFBQSxRQVBOUixRQU9N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InNvdXJjZXNDb250ZW50IjpbIi8vIFZpZXcgYW5kIFByb2plY3Rpb24gTWF0cml4IGNhbGN1bGF0aW9ucyBmb3IgbWFwYm94LWpzIHN0eWxlXG4vLyBtYXAgdmlldyBwcm9wZXJ0aWVzXG5pbXBvcnQgVmlld3BvcnQsIHtjcmVhdGVNYXQ0fSBmcm9tICcuL3ZpZXdwb3J0JztcbmltcG9ydCB7bWF0NCwgdmVjNCwgdmVjMn0gZnJvbSAnZ2wtbWF0cml4JztcblxuLy8gQ09OU1RBTlRTXG5jb25zdCBQSSA9IE1hdGguUEk7XG5jb25zdCBQSV80ID0gUEkgLyA0O1xuY29uc3QgREVHUkVFU19UT19SQURJQU5TID0gUEkgLyAxODA7XG5jb25zdCBSQURJQU5TX1RPX0RFR1JFRVMgPSAxODAgLyBQSTtcbmNvbnN0IFRJTEVfU0laRSA9IDUxMjtcbmNvbnN0IFdPUkxEX1NDQUxFID0gVElMRV9TSVpFIC8gKDIgKiBQSSk7XG5cbmNvbnN0IERFRkFVTFRfTUFQX1NUQVRFID0ge1xuICBsYXRpdHVkZTogMzcsXG4gIGxvbmdpdHVkZTogLTEyMixcbiAgem9vbTogMTEsXG4gIHBpdGNoOiAwLFxuICBiZWFyaW5nOiAwLFxuICBhbHRpdHVkZTogMS41XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJNZXJjYXRvclZpZXdwb3J0IGV4dGVuZHMgVmlld3BvcnQge1xuICAvKipcbiAgICogQGNsYXNzZGVzY1xuICAgKiBDcmVhdGVzIHZpZXcvcHJvamVjdGlvbiBtYXRyaWNlcyBmcm9tIG1lcmNhdG9yIHBhcmFtc1xuICAgKiBOb3RlOiBUaGUgVmlld3BvcnQgaXMgaW1tdXRhYmxlIGluIHRoZSBzZW5zZSB0aGF0IGl0IG9ubHkgaGFzIGFjY2Vzc29ycy5cbiAgICogQSBuZXcgdmlld3BvcnQgaW5zdGFuY2Ugc2hvdWxkIGJlIGNyZWF0ZWQgaWYgYW55IHBhcmFtZXRlcnMgaGF2ZSBjaGFuZ2VkLlxuICAgKlxuICAgKiBAY2xhc3NcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdCAtIG9wdGlvbnNcbiAgICogQHBhcmFtIHtCb29sZWFufSBtZXJjYXRvcj10cnVlIC0gV2hldGhlciB0byB1c2UgbWVyY2F0b3IgcHJvamVjdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gb3B0LndpZHRoPTEgLSBXaWR0aCBvZiBcInZpZXdwb3J0XCIgb3Igd2luZG93XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcHQuaGVpZ2h0PTEgLSBIZWlnaHQgb2YgXCJ2aWV3cG9ydFwiIG9yIHdpbmRvd1xuICAgKiBAcGFyYW0ge0FycmF5fSBvcHQuY2VudGVyPVswLCAwXSAtIENlbnRlciBvZiB2aWV3cG9ydFxuICAgKiAgIFtsb25naXR1ZGUsIGxhdGl0dWRlXSBvciBbeCwgeV1cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdC5zY2FsZT0xIC0gRWl0aGVyIHVzZSBzY2FsZSBvciB6b29tXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcHQucGl0Y2g9MCAtIENhbWVyYSBhbmdsZSBpbiBkZWdyZWVzICgwIGlzIHN0cmFpZ2h0IGRvd24pXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcHQuYmVhcmluZz0wIC0gTWFwIHJvdGF0aW9uIGluIGRlZ3JlZXMgKDAgbWVhbnMgbm9ydGggaXMgdXApXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcHQuYWx0aXR1ZGU9IC0gQWx0aXR1ZGUgb2YgY2FtZXJhIGluIHNjcmVlbiB1bml0c1xuICAgKlxuICAgKiBXZWIgbWVyY2F0b3IgcHJvamVjdGlvbiBzaG9ydC1oYW5kIHBhcmFtZXRlcnNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdC5sYXRpdHVkZSAtIENlbnRlciBvZiB2aWV3cG9ydCBvbiBtYXAgKGFsdGVybmF0aXZlIHRvIG9wdC5jZW50ZXIpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcHQubG9uZ2l0dWRlIC0gQ2VudGVyIG9mIHZpZXdwb3J0IG9uIG1hcCAoYWx0ZXJuYXRpdmUgdG8gb3B0LmNlbnRlcilcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdC56b29tIC0gU2NhbGUgPSBNYXRoLnBvdygyLHpvb20pIG9uIG1hcCAoYWx0ZXJuYXRpdmUgdG8gb3B0LnNjYWxlKVxuXG4gICAqIE5vdGVzOlxuICAgKiAgLSBPbmx5IG9uZSBvZiBjZW50ZXIgb3IgW2xhdGl0dWRlLCBsb25naXR1ZGVdIGNhbiBiZSBzcGVjaWZpZWRcbiAgICogIC0gW2xhdGl0dWRlLCBsb25naXR1ZGVdIGNhbiBvbmx5IGJlIHNwZWNpZmllZCB3aGVuIFwibWVyY2F0b3JcIiBpcyB0cnVlXG4gICAqICAtIEFsdGl0dWRlIGhhcyBhIGRlZmF1bHQgdmFsdWUgdGhhdCBtYXRjaGVzIGFzc3VtcHRpb25zIGluIG1hcGJveC1nbFxuICAgKiAgLSB3aWR0aCBhbmQgaGVpZ2h0IGFyZSBmb3JjZWQgdG8gMSBpZiBzdXBwbGllZCBhcyAwLCB0byBhdm9pZFxuICAgKiAgICBkaXZpc2lvbiBieSB6ZXJvLiBUaGlzIGlzIGludGVuZGVkIHRvIHJlZHVjZSB0aGUgYnVyZGVuIG9mIGFwcHMgdG9cbiAgICogICAgdG8gY2hlY2sgdmFsdWVzIGJlZm9yZSBpbnN0YW50aWF0aW5nIGEgVmlld3BvcnQuXG4gICAqL1xuICAvKiBlc2xpbnQtZGlzYWJsZSBjb21wbGV4aXR5LCBtYXgtc3RhdGVtZW50cyAqL1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgLy8gTWFwIHN0YXRlXG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0LFxuICAgIGxhdGl0dWRlLFxuICAgIGxvbmdpdHVkZSxcbiAgICB6b29tLFxuICAgIHBpdGNoLFxuICAgIGJlYXJpbmcsXG4gICAgYWx0aXR1ZGUsXG4gICAgbWVyY2F0b3JFbmFibGVkXG4gIH0gPSB7fSkge1xuICAgIC8vIFZpZXdwb3J0IC0gc3VwcG9ydCB1bmRlZmluZWQgYXJndW1lbnRzXG4gICAgd2lkdGggPSB3aWR0aCAhPT0gdW5kZWZpbmVkID8gd2lkdGggOiBERUZBVUxUX01BUF9TVEFURS53aWR0aDtcbiAgICBoZWlnaHQgPSBoZWlnaHQgIT09IHVuZGVmaW5lZCA/IGhlaWdodCA6IERFRkFVTFRfTUFQX1NUQVRFLmhlaWdodDtcbiAgICB6b29tID0gem9vbSAhPT0gdW5kZWZpbmVkID8gem9vbSA6IERFRkFVTFRfTUFQX1NUQVRFLnpvb207XG4gICAgbGF0aXR1ZGUgPSBsYXRpdHVkZSAhPT0gdW5kZWZpbmVkID8gbGF0aXR1ZGUgOiBERUZBVUxUX01BUF9TVEFURS5sYXRpdHVkZTtcbiAgICBsb25naXR1ZGUgPSBsb25naXR1ZGUgIT09IHVuZGVmaW5lZCA/IGxvbmdpdHVkZSA6IERFRkFVTFRfTUFQX1NUQVRFLmxvbmdpdHVkZTtcbiAgICBiZWFyaW5nID0gYmVhcmluZyAhPT0gdW5kZWZpbmVkID8gYmVhcmluZyA6IERFRkFVTFRfTUFQX1NUQVRFLmJlYXJpbmc7XG4gICAgcGl0Y2ggPSBwaXRjaCAhPT0gdW5kZWZpbmVkID8gcGl0Y2ggOiBERUZBVUxUX01BUF9TVEFURS5waXRjaDtcbiAgICBhbHRpdHVkZSA9IGFsdGl0dWRlICE9PSB1bmRlZmluZWQgPyBhbHRpdHVkZSA6IERFRkFVTFRfTUFQX1NUQVRFLmFsdGl0dWRlO1xuXG4gICAgLy8gU2lsZW50bHkgYWxsb3cgYXBwcyB0byBzZW5kIGluIDAsMCB0byBmYWNpbGl0YXRlIGlzb21vcnBoaWMgcmVuZGVyIGV0Y1xuICAgIHdpZHRoID0gd2lkdGggfHwgMTtcbiAgICBoZWlnaHQgPSBoZWlnaHQgfHwgMTtcblxuICAgIGNvbnN0IHNjYWxlID0gTWF0aC5wb3coMiwgem9vbSk7XG4gICAgLy8gQWx0aXR1ZGUgLSBwcmV2ZW50IGRpdmlzaW9uIGJ5IDBcbiAgICAvLyBUT0RPIC0ganVzdCB0aHJvdyBhbiBFcnJvciBpbnN0ZWFkP1xuICAgIGFsdGl0dWRlID0gTWF0aC5tYXgoMC43NSwgYWx0aXR1ZGUpO1xuXG4gICAgY29uc3QgZGlzdGFuY2VTY2FsZXMgPSBjYWxjdWxhdGVEaXN0YW5jZVNjYWxlcyh7bGF0aXR1ZGUsIGxvbmdpdHVkZSwgc2NhbGV9KTtcblxuICAgIGNvbnN0IHByb2plY3Rpb25NYXRyaXggPSBtYWtlUHJvamVjdGlvbk1hdHJpeEZyb21NZXJjYXRvclBhcmFtcyh7XG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIHBpdGNoLFxuICAgICAgYmVhcmluZyxcbiAgICAgIGFsdGl0dWRlXG4gICAgfSk7XG5cbiAgICBjb25zdCB7dmlld01hdHJpeCwgdmlld01hdHJpeFVuY2VudGVyZWQsIHZpZXdDZW50ZXJ9ID1cbiAgICAgIG1ha2VWaWV3TWF0cml4RnJvbU1lcmNhdG9yUGFyYW1zKHtcbiAgICAgICAgd2lkdGgsXG4gICAgICAgIGhlaWdodCxcbiAgICAgICAgbG9uZ2l0dWRlLFxuICAgICAgICBsYXRpdHVkZSxcbiAgICAgICAgem9vbSxcbiAgICAgICAgcGl0Y2gsXG4gICAgICAgIGJlYXJpbmcsXG4gICAgICAgIGFsdGl0dWRlLFxuICAgICAgICBkaXN0YW5jZVNjYWxlc1xuICAgICAgfSk7XG5cbiAgICBzdXBlcih7d2lkdGgsIGhlaWdodCwgdmlld01hdHJpeCwgcHJvamVjdGlvbk1hdHJpeH0pO1xuXG4gICAgLy8gQWRkIGFkZGl0aW9uYWwgbWF0cmljZXNcbiAgICB0aGlzLnZpZXdNYXRyaXhVbmNlbnRlcmVkID0gdmlld01hdHJpeFVuY2VudGVyZWQ7XG4gICAgdGhpcy52aWV3Q2VudGVyID0gdmlld0NlbnRlcjtcblxuICAgIC8vIFNhdmUgcGFyYW1ldGVyc1xuICAgIHRoaXMubGF0aXR1ZGUgPSBsYXRpdHVkZTtcbiAgICB0aGlzLmxvbmdpdHVkZSA9IGxvbmdpdHVkZTtcbiAgICB0aGlzLnpvb20gPSB6b29tO1xuICAgIHRoaXMucGl0Y2ggPSBwaXRjaDtcbiAgICB0aGlzLmJlYXJpbmcgPSBiZWFyaW5nO1xuICAgIHRoaXMuYWx0aXR1ZGUgPSBhbHRpdHVkZTtcblxuICAgIHRoaXMuc2NhbGUgPSBzY2FsZTtcblxuICAgIHRoaXMuX2Rpc3RhbmNlU2NhbGVzID0gZGlzdGFuY2VTY2FsZXM7XG5cbiAgICB0aGlzLmdldERpc3RhbmNlU2NhbGVzID0gdGhpcy5nZXREaXN0YW5jZVNjYWxlcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMubWV0ZXJzVG9MbmdMYXREZWx0YSA9IHRoaXMubWV0ZXJzVG9MbmdMYXREZWx0YS5iaW5kKHRoaXMpO1xuICAgIHRoaXMubG5nTGF0RGVsdGFUb01ldGVycyA9IHRoaXMubG5nTGF0RGVsdGFUb01ldGVycy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYWRkTWV0ZXJzVG9MbmdMYXQgPSB0aGlzLmFkZE1ldGVyc1RvTG5nTGF0LmJpbmQodGhpcyk7XG4gIH1cbiAgLyogZXNsaW50LWVuYWJsZSBjb21wbGV4aXR5LCBtYXgtc3RhdGVtZW50cyAqL1xuXG4gIC8qKlxuICAgKiBQcm9qZWN0IFtsbmcsbGF0XSBvbiBzcGhlcmUgb250byBbeCx5XSBvbiA1MTIqNTEyIE1lcmNhdG9yIFpvb20gMCB0aWxlLlxuICAgKiBQZXJmb3JtcyB0aGUgbm9ubGluZWFyIHBhcnQgb2YgdGhlIHdlYiBtZXJjYXRvciBwcm9qZWN0aW9uLlxuICAgKiBSZW1haW5pbmcgcHJvamVjdGlvbiBpcyBkb25lIHdpdGggNHg0IG1hdHJpY2VzIHdoaWNoIGFsc28gaGFuZGxlc1xuICAgKiBwZXJzcGVjdGl2ZS5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gbG5nTGF0IC0gW2xuZywgbGF0XSBjb29yZGluYXRlc1xuICAgKiAgIFNwZWNpZmllcyBhIHBvaW50IG9uIHRoZSBzcGhlcmUgdG8gcHJvamVjdCBvbnRvIHRoZSBtYXAuXG4gICAqIEByZXR1cm4ge0FycmF5fSBbeCx5XSBjb29yZGluYXRlcy5cbiAgICovXG4gIF9wcm9qZWN0RmxhdChsbmdMYXQsIHNjYWxlID0gdGhpcy5zY2FsZSkge1xuICAgIHJldHVybiBwcm9qZWN0RmxhdChsbmdMYXQsIHNjYWxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVbnByb2plY3Qgd29ybGQgcG9pbnQgW3gseV0gb24gbWFwIG9udG8ge2xhdCwgbG9ufSBvbiBzcGhlcmVcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R8VmVjdG9yfSB4eSAtIG9iamVjdCB3aXRoIHt4LHl9IG1lbWJlcnNcbiAgICogIHJlcHJlc2VudGluZyBwb2ludCBvbiBwcm9qZWN0ZWQgbWFwIHBsYW5lXG4gICAqIEByZXR1cm4ge0dlb0Nvb3JkaW5hdGVzfSAtIG9iamVjdCB3aXRoIHtsYXQsbG9ufSBvZiBwb2ludCBvbiBzcGhlcmUuXG4gICAqICAgSGFzIHRvQXJyYXkgbWV0aG9kIGlmIHlvdSBuZWVkIGEgR2VvSlNPTiBBcnJheS5cbiAgICogICBQZXIgY2FydG9ncmFwaGljIHRyYWRpdGlvbiwgbGF0IGFuZCBsb24gYXJlIHNwZWNpZmllZCBhcyBkZWdyZWVzLlxuICAgKi9cbiAgX3VucHJvamVjdEZsYXQoeHksIHNjYWxlID0gdGhpcy5zY2FsZSkge1xuICAgIHJldHVybiB1bnByb2plY3RGbGF0KHh5LCBzY2FsZSk7XG4gIH1cblxuICBnZXREaXN0YW5jZVNjYWxlcygpIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzdGFuY2VTY2FsZXM7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYSBtZXRlciBvZmZzZXQgdG8gYSBsbmdsYXQgb2Zmc2V0XG4gICAqXG4gICAqIE5vdGU6IFVzZXMgc2ltcGxlIGxpbmVhciBhcHByb3hpbWF0aW9uIGFyb3VuZCB0aGUgdmlld3BvcnQgY2VudGVyXG4gICAqIEVycm9yIGluY3JlYXNlcyB3aXRoIHNpemUgb2Ygb2Zmc2V0IChyb3VnaGx5IDElIHBlciAxMDBrbSlcbiAgICpcbiAgICogQHBhcmFtIHtbTnVtYmVyLE51bWJlcl18W051bWJlcixOdW1iZXIsTnVtYmVyXSkgeHl6IC0gYXJyYXkgb2YgbWV0ZXIgZGVsdGFzXG4gICAqIEByZXR1cm4ge1tOdW1iZXIsTnVtYmVyXXxbTnVtYmVyLE51bWJlcixOdW1iZXJdKSAtIGFycmF5IG9mIFtsbmcsbGF0LHpdIGRlbHRhc1xuICAgKi9cbiAgbWV0ZXJzVG9MbmdMYXREZWx0YSh4eXopIHtcbiAgICBjb25zdCBbeCwgeSwgeiA9IDBdID0geHl6O1xuICAgIGNvbnN0IHtwaXhlbHNQZXJNZXRlciwgZGVncmVlc1BlclBpeGVsfSA9IHRoaXMuX2Rpc3RhbmNlU2NhbGVzO1xuICAgIGNvbnN0IGRlbHRhTG5nID0geCAqIHBpeGVsc1Blck1ldGVyWzBdICogZGVncmVlc1BlclBpeGVsWzBdO1xuICAgIGNvbnN0IGRlbHRhTGF0ID0geSAqIHBpeGVsc1Blck1ldGVyWzFdICogZGVncmVlc1BlclBpeGVsWzFdO1xuICAgIHJldHVybiB4eXoubGVuZ3RoID09PSAyID8gW2RlbHRhTG5nLCBkZWx0YUxhdF0gOiBbZGVsdGFMbmcsIGRlbHRhTGF0LCB6XTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhIGxuZ2xhdCBvZmZzZXQgdG8gYSBtZXRlciBvZmZzZXRcbiAgICpcbiAgICogTm90ZTogVXNlcyBzaW1wbGUgbGluZWFyIGFwcHJveGltYXRpb24gYXJvdW5kIHRoZSB2aWV3cG9ydCBjZW50ZXJcbiAgICogRXJyb3IgaW5jcmVhc2VzIHdpdGggc2l6ZSBvZiBvZmZzZXQgKHJvdWdobHkgMSUgcGVyIDEwMGttKVxuICAgKlxuICAgKiBAcGFyYW0ge1tOdW1iZXIsTnVtYmVyXXxbTnVtYmVyLE51bWJlcixOdW1iZXJdKSBkZWx0YUxuZ0xhdFogLSBhcnJheSBvZiBbbG5nLGxhdCx6XSBkZWx0YXNcbiAgICogQHJldHVybiB7W051bWJlcixOdW1iZXJdfFtOdW1iZXIsTnVtYmVyLE51bWJlcl0pIC0gYXJyYXkgb2YgbWV0ZXIgZGVsdGFzXG4gICAqL1xuICBsbmdMYXREZWx0YVRvTWV0ZXJzKGRlbHRhTG5nTGF0Wikge1xuICAgIGNvbnN0IFtkZWx0YUxuZywgZGVsdGFMYXQsIGRlbHRhWiA9IDBdID0gZGVsdGFMbmdMYXRaO1xuICAgIGNvbnN0IHtwaXhlbHNQZXJEZWdyZWUsIG1ldGVyc1BlclBpeGVsfSA9IHRoaXMuX2Rpc3RhbmNlU2NhbGVzO1xuICAgIGNvbnN0IGRlbHRhWCA9IGRlbHRhTG5nICogcGl4ZWxzUGVyRGVncmVlWzBdICogbWV0ZXJzUGVyUGl4ZWxbMF07XG4gICAgY29uc3QgZGVsdGFZID0gZGVsdGFMYXQgKiBwaXhlbHNQZXJEZWdyZWVbMV0gKiBtZXRlcnNQZXJQaXhlbFsxXTtcbiAgICByZXR1cm4gZGVsdGFMbmdMYXRaLmxlbmd0aCA9PT0gMiA/IFtkZWx0YVgsIGRlbHRhWV0gOiBbZGVsdGFYLCBkZWx0YVksIGRlbHRhWl07XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbWV0ZXIgZGVsdGEgdG8gYSBiYXNlIGxuZ2xhdCBjb29yZGluYXRlLCByZXR1cm5pbmcgYSBuZXcgbG5nbGF0IGFycmF5XG4gICAqXG4gICAqIE5vdGU6IFVzZXMgc2ltcGxlIGxpbmVhciBhcHByb3hpbWF0aW9uIGFyb3VuZCB0aGUgdmlld3BvcnQgY2VudGVyXG4gICAqIEVycm9yIGluY3JlYXNlcyB3aXRoIHNpemUgb2Ygb2Zmc2V0IChyb3VnaGx5IDElIHBlciAxMDBrbSlcbiAgICpcbiAgICogQHBhcmFtIHtbTnVtYmVyLE51bWJlcl18W051bWJlcixOdW1iZXIsTnVtYmVyXSkgbG5nTGF0WiAtIGJhc2UgY29vcmRpbmF0ZVxuICAgKiBAcGFyYW0ge1tOdW1iZXIsTnVtYmVyXXxbTnVtYmVyLE51bWJlcixOdW1iZXJdKSB4eXogLSBhcnJheSBvZiBtZXRlciBkZWx0YXNcbiAgICogQHJldHVybiB7W051bWJlcixOdW1iZXJdfFtOdW1iZXIsTnVtYmVyLE51bWJlcl0pIGFycmF5IG9mIFtsbmcsbGF0LHpdIGRlbHRhc1xuICAgKi9cbiAgYWRkTWV0ZXJzVG9MbmdMYXQobG5nTGF0WiwgeHl6KSB7XG4gICAgY29uc3QgW2xuZywgbGF0LCBaID0gMF0gPSBsbmdMYXRaO1xuICAgIGNvbnN0IFtkZWx0YUxuZywgZGVsdGFMYXQsIGRlbHRhWiA9IDBdID0gdGhpcy5tZXRlcnNUb0xuZ0xhdERlbHRhKHh5eik7XG4gICAgcmV0dXJuIGxuZ0xhdFoubGVuZ3RoID09PSAyID9cbiAgICAgIFtsbmcgKyBkZWx0YUxuZywgbGF0ICsgZGVsdGFMYXRdIDpcbiAgICAgIFtsbmcgKyBkZWx0YUxuZywgbGF0ICsgZGVsdGFMYXQsIFogKyBkZWx0YVpdO1xuICB9XG5cbiAgLy8gSU5URVJOQUwgTUVUSE9EU1xuXG4gIF9nZXRQYXJhbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc3RhbmNlU2NhbGVzO1xuICB9XG59XG5cbi8qKlxuICogUHJvamVjdCBbbG5nLGxhdF0gb24gc3BoZXJlIG9udG8gW3gseV0gb24gNTEyKjUxMiBNZXJjYXRvciBab29tIDAgdGlsZS5cbiAqIFBlcmZvcm1zIHRoZSBub25saW5lYXIgcGFydCBvZiB0aGUgd2ViIG1lcmNhdG9yIHByb2plY3Rpb24uXG4gKiBSZW1haW5pbmcgcHJvamVjdGlvbiBpcyBkb25lIHdpdGggNHg0IG1hdHJpY2VzIHdoaWNoIGFsc28gaGFuZGxlc1xuICogcGVyc3BlY3RpdmUuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gbG5nTGF0IC0gW2xuZywgbGF0XSBjb29yZGluYXRlc1xuICogICBTcGVjaWZpZXMgYSBwb2ludCBvbiB0aGUgc3BoZXJlIHRvIHByb2plY3Qgb250byB0aGUgbWFwLlxuICogQHJldHVybiB7QXJyYXl9IFt4LHldIGNvb3JkaW5hdGVzLlxuICovXG5mdW5jdGlvbiBwcm9qZWN0RmxhdChbbG5nLCBsYXRdLCBzY2FsZSkge1xuICBzY2FsZSA9IHNjYWxlICogV09STERfU0NBTEU7XG4gIGNvbnN0IGxhbWJkYTIgPSBsbmcgKiBERUdSRUVTX1RPX1JBRElBTlM7XG4gIGNvbnN0IHBoaTIgPSBsYXQgKiBERUdSRUVTX1RPX1JBRElBTlM7XG4gIGNvbnN0IHggPSBzY2FsZSAqIChsYW1iZGEyICsgUEkpO1xuICBjb25zdCB5ID0gc2NhbGUgKiAoUEkgLSBNYXRoLmxvZyhNYXRoLnRhbihQSV80ICsgcGhpMiAqIDAuNSkpKTtcbiAgcmV0dXJuIFt4LCB5XTtcbn1cblxuLyoqXG4gKiBVbnByb2plY3Qgd29ybGQgcG9pbnQgW3gseV0gb24gbWFwIG9udG8ge2xhdCwgbG9ufSBvbiBzcGhlcmVcbiAqXG4gKiBAcGFyYW0ge29iamVjdHxWZWN0b3J9IHh5IC0gb2JqZWN0IHdpdGgge3gseX0gbWVtYmVyc1xuICogIHJlcHJlc2VudGluZyBwb2ludCBvbiBwcm9qZWN0ZWQgbWFwIHBsYW5lXG4gKiBAcmV0dXJuIHtHZW9Db29yZGluYXRlc30gLSBvYmplY3Qgd2l0aCB7bGF0LGxvbn0gb2YgcG9pbnQgb24gc3BoZXJlLlxuICogICBIYXMgdG9BcnJheSBtZXRob2QgaWYgeW91IG5lZWQgYSBHZW9KU09OIEFycmF5LlxuICogICBQZXIgY2FydG9ncmFwaGljIHRyYWRpdGlvbiwgbGF0IGFuZCBsb24gYXJlIHNwZWNpZmllZCBhcyBkZWdyZWVzLlxuICovXG5mdW5jdGlvbiB1bnByb2plY3RGbGF0KFt4LCB5XSwgc2NhbGUpIHtcbiAgc2NhbGUgPSBzY2FsZSAqIFdPUkxEX1NDQUxFO1xuICBjb25zdCBsYW1iZGEyID0geCAvIHNjYWxlIC0gUEk7XG4gIGNvbnN0IHBoaTIgPSAyICogKE1hdGguYXRhbihNYXRoLmV4cChQSSAtIHkgLyBzY2FsZSkpIC0gUElfNCk7XG4gIHJldHVybiBbbGFtYmRhMiAqIFJBRElBTlNfVE9fREVHUkVFUywgcGhpMiAqIFJBRElBTlNfVE9fREVHUkVFU107XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlIGRpc3RhbmNlIHNjYWxlcyBpbiBtZXRlcnMgYXJvdW5kIGN1cnJlbnQgbGF0L2xvbiwgYm90aCBmb3JcbiAqIGRlZ3JlZXMgYW5kIHBpeGVscy5cbiAqIEluIG1lcmNhdG9yIHByb2plY3Rpb24gbW9kZSwgdGhlIGRpc3RhbmNlIHNjYWxlcyB2YXJ5IHNpZ25pZmljYW50bHlcbiAqIHdpdGggbGF0aXR1ZGUuXG4gKi9cbmZ1bmN0aW9uIGNhbGN1bGF0ZURpc3RhbmNlU2NhbGVzKHtsYXRpdHVkZSwgbG9uZ2l0dWRlLCBzY2FsZX0pIHtcbiAgLy8gQXBwcm94aW1hdGVseSAxMTFrbSBwZXIgZGVncmVlIGF0IGVxdWF0b3JcbiAgY29uc3QgTUVURVJTX1BFUl9ERUdSRUUgPSAxMTEwMDA7XG5cbiAgY29uc3QgbGF0Q29zaW5lID0gTWF0aC5jb3MobGF0aXR1ZGUgKiBNYXRoLlBJIC8gMTgwKTtcblxuICBjb25zdCBtZXRlcnNQZXJEZWdyZWUgPSBNRVRFUlNfUEVSX0RFR1JFRSAqIGxhdENvc2luZTtcblxuICAvLyBDYWxjdWxhdGUgbnVtYmVyIG9mIHBpeGVscyBvY2N1cGllZCBieSBvbmUgZGVncmVlIGxvbmdpdHVkZVxuICAvLyBhcm91bmQgY3VycmVudCBsYXQvbG9uXG4gIGNvbnN0IHBpeGVsc1BlckRlZ3JlZVggPSB2ZWMyLmRpc3RhbmNlKFxuICAgIHByb2plY3RGbGF0KFtsb25naXR1ZGUgKyAwLjUsIGxhdGl0dWRlXSksXG4gICAgcHJvamVjdEZsYXQoW2xvbmdpdHVkZSAtIDAuNSwgbGF0aXR1ZGVdKVxuICApO1xuICAvLyBDYWxjdWxhdGUgbnVtYmVyIG9mIHBpeGVscyBvY2N1cGllZCBieSBvbmUgZGVncmVlIGxhdGl0dWRlXG4gIC8vIGFyb3VuZCBjdXJyZW50IGxhdC9sb25cbiAgY29uc3QgcGl4ZWxzUGVyRGVncmVlWSA9IHZlYzIuZGlzdGFuY2UoXG4gICAgcHJvamVjdEZsYXQoW2xvbmdpdHVkZSwgbGF0aXR1ZGUgKyAwLjVdKSxcbiAgICBwcm9qZWN0RmxhdChbbG9uZ2l0dWRlLCBsYXRpdHVkZSAtIDAuNV0pXG4gICk7XG5cbiAgY29uc3QgcGl4ZWxzUGVyTWV0ZXJYID0gcGl4ZWxzUGVyRGVncmVlWCAvIG1ldGVyc1BlckRlZ3JlZTtcbiAgY29uc3QgcGl4ZWxzUGVyTWV0ZXJZID0gcGl4ZWxzUGVyRGVncmVlWSAvIG1ldGVyc1BlckRlZ3JlZTtcbiAgY29uc3QgcGl4ZWxzUGVyTWV0ZXJaID0gKHBpeGVsc1Blck1ldGVyWCArIHBpeGVsc1Blck1ldGVyWSkgLyAyO1xuICAvLyBjb25zdCBwaXhlbHNQZXJNZXRlciA9IFtwaXhlbHNQZXJNZXRlclgsIHBpeGVsc1Blck1ldGVyWSwgcGl4ZWxzUGVyTWV0ZXJaXTtcblxuICBjb25zdCB3b3JsZFNpemUgPSBUSUxFX1NJWkUgKiBzY2FsZTtcbiAgY29uc3QgYWx0UGl4ZWxzUGVyTWV0ZXIgPSB3b3JsZFNpemUgLyAoNGU3ICogbGF0Q29zaW5lKTtcbiAgY29uc3QgcGl4ZWxzUGVyTWV0ZXIgPSBbYWx0UGl4ZWxzUGVyTWV0ZXIsIGFsdFBpeGVsc1Blck1ldGVyLCBhbHRQaXhlbHNQZXJNZXRlcl07XG4gIGNvbnN0IG1ldGVyc1BlclBpeGVsID0gWzEgLyBhbHRQaXhlbHNQZXJNZXRlciwgMSAvIGFsdFBpeGVsc1Blck1ldGVyLCAxIC8gcGl4ZWxzUGVyTWV0ZXJaXTtcblxuICBjb25zdCBwaXhlbHNQZXJEZWdyZWUgPSBbcGl4ZWxzUGVyRGVncmVlWCwgcGl4ZWxzUGVyRGVncmVlWSwgcGl4ZWxzUGVyTWV0ZXJaXTtcbiAgY29uc3QgZGVncmVlc1BlclBpeGVsID0gWzEgLyBwaXhlbHNQZXJEZWdyZWVYLCAxIC8gcGl4ZWxzUGVyRGVncmVlWSwgMSAvIHBpeGVsc1Blck1ldGVyWl07XG5cbiAgLy8gTWFpbiByZXN1bHRzLCB1c2VkIGZvciBjb252ZXJ0aW5nIG1ldGVycyB0byBsYXRsbmcgZGVsdGFzIGFuZCBzY2FsaW5nIG9mZnNldHNcbiAgcmV0dXJuIHtcbiAgICBwaXhlbHNQZXJNZXRlcixcbiAgICBtZXRlcnNQZXJQaXhlbCxcbiAgICBwaXhlbHNQZXJEZWdyZWUsXG4gICAgZGVncmVlc1BlclBpeGVsXG4gIH07XG59XG5cbi8vIEFUVFJJQlVUSU9OOlxuLy8gdmlldyBhbmQgcHJvamVjdGlvbiBtYXRyaXggY3JlYXRpb24gaXMgaW50ZW50aW9uYWxseSBrZXB0IGNvbXBhdGlibGUgd2l0aFxuLy8gbWFwYm94LWdsJ3MgaW1wbGVtZW50YXRpb24gdG8gZW5zdXJlIHRoYXQgc2VhbWxlc3MgaW50ZXJvcGVyYXRpb25cbi8vIHdpdGggbWFwYm94IGFuZCByZWFjdC1tYXAtZ2wuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL21hcGJveC9tYXBib3gtZ2wtanNcbmZ1bmN0aW9uIG1ha2VQcm9qZWN0aW9uTWF0cml4RnJvbU1lcmNhdG9yUGFyYW1zKHtcbiAgd2lkdGgsXG4gIGhlaWdodCxcbiAgcGl0Y2gsXG4gIGFsdGl0dWRlXG59KSB7XG4gIGNvbnN0IHBpdGNoUmFkaWFucyA9IHBpdGNoICogREVHUkVFU19UT19SQURJQU5TO1xuXG4gIC8vIFBST0pFQ1RJT04gTUFUUklYOiBQUk9KRUNUUyBGUk9NIENBTUVSQSBTUEFDRSBUTyBDTElQU1BBQ0VcbiAgLy8gRmluZCB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgY2VudGVyIHBvaW50IHRvIHRoZSBjZW50ZXIgdG9wXG4gIC8vIGluIGFsdGl0dWRlIHVuaXRzIHVzaW5nIGxhdyBvZiBzaW5lcy5cbiAgY29uc3QgaGFsZkZvdiA9IE1hdGguYXRhbigwLjUgLyBhbHRpdHVkZSk7XG4gIGNvbnN0IHRvcEhhbGZTdXJmYWNlRGlzdGFuY2UgPVxuICAgIE1hdGguc2luKGhhbGZGb3YpICogYWx0aXR1ZGUgLyBNYXRoLnNpbihNYXRoLlBJIC8gMiAtIHBpdGNoUmFkaWFucyAtIGhhbGZGb3YpO1xuXG4gIC8vIENhbGN1bGF0ZSB6IHZhbHVlIG9mIHRoZSBmYXJ0aGVzdCBmcmFnbWVudCB0aGF0IHNob3VsZCBiZSByZW5kZXJlZC5cbiAgY29uc3QgZmFyWiA9IE1hdGguY29zKE1hdGguUEkgLyAyIC0gcGl0Y2hSYWRpYW5zKSAqIHRvcEhhbGZTdXJmYWNlRGlzdGFuY2UgKyBhbHRpdHVkZTtcblxuICBjb25zdCBwcm9qZWN0aW9uTWF0cml4ID0gbWF0NC5wZXJzcGVjdGl2ZShcbiAgICBjcmVhdGVNYXQ0KCksXG4gICAgMiAqIE1hdGguYXRhbigoaGVpZ2h0IC8gMikgLyBhbHRpdHVkZSksIC8vIGZvdiBpbiByYWRpYW5zXG4gICAgd2lkdGggLyBoZWlnaHQsICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFzcGVjdCByYXRpb1xuICAgIDAuMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBuZWFyIHBsYW5lXG4gICAgZmFyWiAqIDEwLjAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZhciBwbGFuZVxuICApO1xuXG4gIHJldHVybiBwcm9qZWN0aW9uTWF0cml4O1xufVxuXG5mdW5jdGlvbiBtYWtlVmlld01hdHJpeEZyb21NZXJjYXRvclBhcmFtcyh7XG4gIHdpZHRoLFxuICBoZWlnaHQsXG4gIGxvbmdpdHVkZSxcbiAgbGF0aXR1ZGUsXG4gIHpvb20sXG4gIHBpdGNoLFxuICBiZWFyaW5nLFxuICBhbHRpdHVkZVxufSkge1xuICAvLyBDZW50ZXIgeCwgeVxuICBjb25zdCBzY2FsZSA9IE1hdGgucG93KDIsIHpvb20pO1xuICAvLyBWSUVXIE1BVFJJWDogUFJPSkVDVFMgRlJPTSBWSVJUVUFMIFBJWEVMUyBUTyBDQU1FUkEgU1BBQ0VcbiAgLy8gTm90ZTogQXMgdXN1YWwsIG1hdHJpeCBvcGVyYXRpb24gb3JkZXJzIHNob3VsZCBiZSByZWFkIGluIHJldmVyc2VcbiAgLy8gc2luY2UgdmVjdG9ycyB3aWxsIGJlIG11bHRpcGxpZWQgZnJvbSB0aGUgcmlnaHQgZHVyaW5nIHRyYW5zZm9ybWF0aW9uXG4gIGNvbnN0IHZtID0gY3JlYXRlTWF0NCgpO1xuXG4gIC8vIE1vdmUgY2FtZXJhIHRvIGFsdGl0dWRlXG4gIG1hdDQudHJhbnNsYXRlKHZtLCB2bSwgWzAsIDAsIC1hbHRpdHVkZV0pO1xuXG4gIC8vIEFmdGVyIHRoZSByb3RhdGVYLCB6IHZhbHVlcyBhcmUgaW4gcGl4ZWwgdW5pdHMuIENvbnZlcnQgdGhlbSB0b1xuICAvLyBhbHRpdHVkZSB1bml0cy4gMSBhbHRpdHVkZSB1bml0ID0gdGhlIHNjcmVlbiBoZWlnaHQuXG4gIG1hdDQuc2NhbGUodm0sIHZtLCBbMSwgLTEsIDEgLyBoZWlnaHRdKTtcblxuICAvLyBSb3RhdGUgYnkgYmVhcmluZywgYW5kIHRoZW4gYnkgcGl0Y2ggKHdoaWNoIHRpbHRzIHRoZSB2aWV3KVxuICBtYXQ0LnJvdGF0ZVgodm0sIHZtLCBwaXRjaCAqIERFR1JFRVNfVE9fUkFESUFOUyk7XG4gIG1hdDQucm90YXRlWih2bSwgdm0sIC1iZWFyaW5nICogREVHUkVFU19UT19SQURJQU5TKTtcblxuICBjb25zdCBbY2VudGVyWCwgY2VudGVyWV0gPSBwcm9qZWN0RmxhdChbbG9uZ2l0dWRlLCBsYXRpdHVkZV0sIHNjYWxlKTtcblxuICBjb25zdCBjZW50ZXIgPSBbLWNlbnRlclgsIC1jZW50ZXJZLCAwLCAxXTtcbiAgY29uc3Qgdmlld0NlbnRlciA9IHZlYzQudHJhbnNmb3JtTWF0NChbXSwgY2VudGVyLCB2bSk7XG5cbiAgY29uc3Qgdm1DZW50ZXJlZCA9IG1hdDQudHJhbnNsYXRlKFtdLCB2bSwgWy1jZW50ZXJYLCAtY2VudGVyWSwgMF0pO1xuXG4gIHJldHVybiB7XG4gICAgdmlld01hdHJpeDogdm1DZW50ZXJlZCxcbiAgICB2aWV3TWF0cml4VW5jZW50ZXJlZDogdm0sXG4gICAgdmlld0NlbnRlclxuICB9O1xufVxuIl19