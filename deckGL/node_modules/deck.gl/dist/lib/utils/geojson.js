'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGeojsonFeatures = getGeojsonFeatures;
exports.featureToPolygons = featureToPolygons;
exports.extractPolygons = extractPolygons;
exports.normalizeGeojson = normalizeGeojson;

var _container = require('./container');

var Container = _interopRequireWildcard(_container);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * "Normalizes" complete or partial GeoJSON data into iterable list of features
 * Can accept GeoJSON geometry or "Feature", "FeatureCollection" in addition
 * to plain arrays and iterables.
 * Works by extracting the feature array or wrapping single objects in an array,
 * so that subsequent code can simply iterate over features.
 *
 * @param {object} geojson - geojson data
 * @param {Object|Array} data - geojson object (FeatureCollection, Feature or
 *  Geometry) or array of features
 * @return {Array|"iteratable"} - iterable list of features
 */
function getGeojsonFeatures(geojson) {
  // If array, assume this is a list of features
  if (Array.isArray(geojson)) {
    return geojson;
  }

  var type = Container.get(geojson, 'type');
  switch (type) {
    case 'Point':
    case 'MultiPoint':
    case 'LineString':
    case 'MultiLineString':
    case 'Polygon':
    case 'MultiPolygon':
    case 'GeometryCollection':
      // Wrap the geometry object in a 'Feature' object and wrap in an array
      return [{ type: 'Feature', properties: {}, geometry: geojson }];
    case 'Feature':
      // Wrap the feature in a 'Features' array
      return [geojson];
    case 'FeatureCollection':
      // Just return the 'Features' array from the collection
      return Container.get(geojson, 'features');
    default:
      throw new Error('Unknown geojson type');
  }
}

/*
 * converts a GeoJSON "Feature" object to a list of GeoJSON polygon-style coordinates
 * @param {Object | Array} data - geojson object or array of feature
 * @returns {[Number,Number,Number][][][]} array of choropleths
 */
function featureToPolygons(feature) {
  var geometry = Container.get(feature, 'geometry');
  // If no geometry field, assume that "feature" is the polygon list
  if (geometry === undefined) {
    return feature;
  }

  var type = Container.get(geometry, 'type');
  var coordinates = Container.get(geometry, 'coordinates');

  var polygons = void 0;
  switch (type) {
    case 'MultiPolygon':
      polygons = coordinates;
      break;
    case 'Polygon':
      polygons = [coordinates];
      break;
    case 'LineString':
      // TODO - should lines really be handled in this switch?
      polygons = [[coordinates]];
      break;
    case 'MultiLineString':
      // TODO - should lines really be handled in this switch?
      polygons = Container.map(coordinates, function (coords) {
        return [coords];
      });
      break;
    default:
      polygons = [];
  }
  return polygons;
}

// DEPRECATED - USED BY OLD CHOROPLETH LAYERS

/*
 * converts list of features from a GeoJSON object to a list of GeoJSON
 * polygon-style coordinates
 * @param {Object} data - geojson object
 * @returns {[Number,Number,Number][][][]} array of choropleths
 */
function extractPolygons(data) {
  var normalizedGeojson = normalizeGeojson(data);
  var features = Container.get(normalizedGeojson, 'features');

  var result = [];
  features.forEach(function (feature, featureIndex) {
    var choropleths = featureToPolygons(feature);

    /* eslint-disable max-nested-callbacks */
    choropleths = Container.map(choropleths, function (choropleth) {
      return Container.map(choropleth, function (polygon) {
        return Container.map(polygon, function (coord) {
          return [Container.get(coord, 0), Container.get(coord, 1), Container.get(coord, 2) || 0];
        });
      });
    });
    /* eslint-enable max-nested-callbacks */

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = choropleths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var choropleth = _step.value;

        choropleth.featureIndex = featureIndex;
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

    result.push.apply(result, _toConsumableArray(choropleths));
  });
  return result;
}

/**
 * "Normalizes" a GeoJSON geometry or "Feature" into a "FeatureCollection",
 * by wrapping it in an extra object/array.
 *
 * @param {object} geojson - geojson data
 * @return {object} - normalized geojson data
 */
function normalizeGeojson(geojson) {
  var type = Container.get(geojson, 'type');
  switch (type) {
    case 'Point':
    case 'MultiPoint':
    case 'LineString':
    case 'MultiLineString':
    case 'Polygon':
    case 'MultiPolygon':
    case 'GeometryCollection':
      // Wrap the geometry object in a "Feature" and add the feature to a "FeatureCollection"
      return {
        type: 'FeatureCollection',
        features: [{ type: 'Feature', properties: {}, geometry: geojson }]
      };
    case 'Feature':
      // Add the feature to a "FeatureCollection"
      return {
        type: 'FeatureCollection',
        features: [geojson]
      };
    case 'FeatureCollection':
      // Just return the feature collection
      return geojson;
    default:
      throw new Error('Unknown geojson type');
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdXRpbHMvZ2VvanNvbi5qcyJdLCJuYW1lcyI6WyJnZXRHZW9qc29uRmVhdHVyZXMiLCJmZWF0dXJlVG9Qb2x5Z29ucyIsImV4dHJhY3RQb2x5Z29ucyIsIm5vcm1hbGl6ZUdlb2pzb24iLCJDb250YWluZXIiLCJnZW9qc29uIiwiQXJyYXkiLCJpc0FycmF5IiwidHlwZSIsImdldCIsInByb3BlcnRpZXMiLCJnZW9tZXRyeSIsIkVycm9yIiwiZmVhdHVyZSIsInVuZGVmaW5lZCIsImNvb3JkaW5hdGVzIiwicG9seWdvbnMiLCJtYXAiLCJjb29yZHMiLCJkYXRhIiwibm9ybWFsaXplZEdlb2pzb24iLCJmZWF0dXJlcyIsInJlc3VsdCIsImZvckVhY2giLCJmZWF0dXJlSW5kZXgiLCJjaG9yb3BsZXRocyIsImNob3JvcGxldGgiLCJwb2x5Z29uIiwiY29vcmQiLCJwdXNoIl0sIm1hcHBpbmdzIjoiOzs7OztRQWNnQkEsa0IsR0FBQUEsa0I7UUFtQ0FDLGlCLEdBQUFBLGlCO1FBd0NBQyxlLEdBQUFBLGU7UUFxQ0FDLGdCLEdBQUFBLGdCOztBQTlIaEI7O0lBQVlDLFM7Ozs7OztBQUVaOzs7Ozs7Ozs7Ozs7QUFZTyxTQUFTSixrQkFBVCxDQUE0QkssT0FBNUIsRUFBcUM7QUFDMUM7QUFDQSxNQUFJQyxNQUFNQyxPQUFOLENBQWNGLE9BQWQsQ0FBSixFQUE0QjtBQUMxQixXQUFPQSxPQUFQO0FBQ0Q7O0FBRUQsTUFBTUcsT0FBT0osVUFBVUssR0FBVixDQUFjSixPQUFkLEVBQXVCLE1BQXZCLENBQWI7QUFDQSxVQUFRRyxJQUFSO0FBQ0EsU0FBSyxPQUFMO0FBQ0EsU0FBSyxZQUFMO0FBQ0EsU0FBSyxZQUFMO0FBQ0EsU0FBSyxpQkFBTDtBQUNBLFNBQUssU0FBTDtBQUNBLFNBQUssY0FBTDtBQUNBLFNBQUssb0JBQUw7QUFDRTtBQUNBLGFBQU8sQ0FDTCxFQUFDQSxNQUFNLFNBQVAsRUFBa0JFLFlBQVksRUFBOUIsRUFBa0NDLFVBQVVOLE9BQTVDLEVBREssQ0FBUDtBQUdGLFNBQUssU0FBTDtBQUNFO0FBQ0EsYUFBTyxDQUFDQSxPQUFELENBQVA7QUFDRixTQUFLLG1CQUFMO0FBQ0U7QUFDQSxhQUFPRCxVQUFVSyxHQUFWLENBQWNKLE9BQWQsRUFBdUIsVUFBdkIsQ0FBUDtBQUNGO0FBQ0UsWUFBTSxJQUFJTyxLQUFKLENBQVUsc0JBQVYsQ0FBTjtBQW5CRjtBQXFCRDs7QUFFRDs7Ozs7QUFLTyxTQUFTWCxpQkFBVCxDQUEyQlksT0FBM0IsRUFBb0M7QUFDekMsTUFBTUYsV0FBV1AsVUFBVUssR0FBVixDQUFjSSxPQUFkLEVBQXVCLFVBQXZCLENBQWpCO0FBQ0E7QUFDQSxNQUFJRixhQUFhRyxTQUFqQixFQUE0QjtBQUMxQixXQUFPRCxPQUFQO0FBQ0Q7O0FBRUQsTUFBTUwsT0FBT0osVUFBVUssR0FBVixDQUFjRSxRQUFkLEVBQXdCLE1BQXhCLENBQWI7QUFDQSxNQUFNSSxjQUFjWCxVQUFVSyxHQUFWLENBQWNFLFFBQWQsRUFBd0IsYUFBeEIsQ0FBcEI7O0FBRUEsTUFBSUssaUJBQUo7QUFDQSxVQUFRUixJQUFSO0FBQ0EsU0FBSyxjQUFMO0FBQ0VRLGlCQUFXRCxXQUFYO0FBQ0E7QUFDRixTQUFLLFNBQUw7QUFDRUMsaUJBQVcsQ0FBQ0QsV0FBRCxDQUFYO0FBQ0E7QUFDRixTQUFLLFlBQUw7QUFDRTtBQUNBQyxpQkFBVyxDQUFDLENBQUNELFdBQUQsQ0FBRCxDQUFYO0FBQ0E7QUFDRixTQUFLLGlCQUFMO0FBQ0U7QUFDQUMsaUJBQVdaLFVBQVVhLEdBQVYsQ0FBY0YsV0FBZCxFQUEyQjtBQUFBLGVBQVUsQ0FBQ0csTUFBRCxDQUFWO0FBQUEsT0FBM0IsQ0FBWDtBQUNBO0FBQ0Y7QUFDRUYsaUJBQVcsRUFBWDtBQWhCRjtBQWtCQSxTQUFPQSxRQUFQO0FBQ0Q7O0FBRUQ7O0FBRUE7Ozs7OztBQU1PLFNBQVNkLGVBQVQsQ0FBeUJpQixJQUF6QixFQUErQjtBQUNwQyxNQUFNQyxvQkFBb0JqQixpQkFBaUJnQixJQUFqQixDQUExQjtBQUNBLE1BQU1FLFdBQVdqQixVQUFVSyxHQUFWLENBQWNXLGlCQUFkLEVBQWlDLFVBQWpDLENBQWpCOztBQUVBLE1BQU1FLFNBQVMsRUFBZjtBQUNBRCxXQUFTRSxPQUFULENBQWlCLFVBQUNWLE9BQUQsRUFBVVcsWUFBVixFQUEyQjtBQUMxQyxRQUFJQyxjQUFjeEIsa0JBQWtCWSxPQUFsQixDQUFsQjs7QUFFQTtBQUNBWSxrQkFBY3JCLFVBQVVhLEdBQVYsQ0FBY1EsV0FBZCxFQUNaO0FBQUEsYUFBY3JCLFVBQVVhLEdBQVYsQ0FBY1MsVUFBZCxFQUNaO0FBQUEsZUFBV3RCLFVBQVVhLEdBQVYsQ0FBY1UsT0FBZCxFQUNUO0FBQUEsaUJBQVMsQ0FDUHZCLFVBQVVLLEdBQVYsQ0FBY21CLEtBQWQsRUFBcUIsQ0FBckIsQ0FETyxFQUVQeEIsVUFBVUssR0FBVixDQUFjbUIsS0FBZCxFQUFxQixDQUFyQixDQUZPLEVBR1B4QixVQUFVSyxHQUFWLENBQWNtQixLQUFkLEVBQXFCLENBQXJCLEtBQTJCLENBSHBCLENBQVQ7QUFBQSxTQURTLENBQVg7QUFBQSxPQURZLENBQWQ7QUFBQSxLQURZLENBQWQ7QUFXQTs7QUFmMEM7QUFBQTtBQUFBOztBQUFBO0FBaUIxQywyQkFBeUJILFdBQXpCLDhIQUFzQztBQUFBLFlBQTNCQyxVQUEyQjs7QUFDcENBLG1CQUFXRixZQUFYLEdBQTBCQSxZQUExQjtBQUNEO0FBbkJ5QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQW9CMUNGLFdBQU9PLElBQVAsa0NBQWVKLFdBQWY7QUFDRCxHQXJCRDtBQXNCQSxTQUFPSCxNQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFPTyxTQUFTbkIsZ0JBQVQsQ0FBMEJFLE9BQTFCLEVBQW1DO0FBQ3hDLE1BQU1HLE9BQU9KLFVBQVVLLEdBQVYsQ0FBY0osT0FBZCxFQUF1QixNQUF2QixDQUFiO0FBQ0EsVUFBUUcsSUFBUjtBQUNBLFNBQUssT0FBTDtBQUNBLFNBQUssWUFBTDtBQUNBLFNBQUssWUFBTDtBQUNBLFNBQUssaUJBQUw7QUFDQSxTQUFLLFNBQUw7QUFDQSxTQUFLLGNBQUw7QUFDQSxTQUFLLG9CQUFMO0FBQ0U7QUFDQSxhQUFPO0FBQ0xBLGNBQU0sbUJBREQ7QUFFTGEsa0JBQVUsQ0FDUixFQUFDYixNQUFNLFNBQVAsRUFBa0JFLFlBQVksRUFBOUIsRUFBa0NDLFVBQVVOLE9BQTVDLEVBRFE7QUFGTCxPQUFQO0FBTUYsU0FBSyxTQUFMO0FBQ0U7QUFDQSxhQUFPO0FBQ0xHLGNBQU0sbUJBREQ7QUFFTGEsa0JBQVUsQ0FBQ2hCLE9BQUQ7QUFGTCxPQUFQO0FBSUYsU0FBSyxtQkFBTDtBQUNFO0FBQ0EsYUFBT0EsT0FBUDtBQUNGO0FBQ0UsWUFBTSxJQUFJTyxLQUFKLENBQVUsc0JBQVYsQ0FBTjtBQXpCRjtBQTJCRCIsImZpbGUiOiJnZW9qc29uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQ29udGFpbmVyIGZyb20gJy4vY29udGFpbmVyJztcblxuLyoqXG4gKiBcIk5vcm1hbGl6ZXNcIiBjb21wbGV0ZSBvciBwYXJ0aWFsIEdlb0pTT04gZGF0YSBpbnRvIGl0ZXJhYmxlIGxpc3Qgb2YgZmVhdHVyZXNcbiAqIENhbiBhY2NlcHQgR2VvSlNPTiBnZW9tZXRyeSBvciBcIkZlYXR1cmVcIiwgXCJGZWF0dXJlQ29sbGVjdGlvblwiIGluIGFkZGl0aW9uXG4gKiB0byBwbGFpbiBhcnJheXMgYW5kIGl0ZXJhYmxlcy5cbiAqIFdvcmtzIGJ5IGV4dHJhY3RpbmcgdGhlIGZlYXR1cmUgYXJyYXkgb3Igd3JhcHBpbmcgc2luZ2xlIG9iamVjdHMgaW4gYW4gYXJyYXksXG4gKiBzbyB0aGF0IHN1YnNlcXVlbnQgY29kZSBjYW4gc2ltcGx5IGl0ZXJhdGUgb3ZlciBmZWF0dXJlcy5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gZ2VvanNvbiAtIGdlb2pzb24gZGF0YVxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IGRhdGEgLSBnZW9qc29uIG9iamVjdCAoRmVhdHVyZUNvbGxlY3Rpb24sIEZlYXR1cmUgb3JcbiAqICBHZW9tZXRyeSkgb3IgYXJyYXkgb2YgZmVhdHVyZXNcbiAqIEByZXR1cm4ge0FycmF5fFwiaXRlcmF0YWJsZVwifSAtIGl0ZXJhYmxlIGxpc3Qgb2YgZmVhdHVyZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEdlb2pzb25GZWF0dXJlcyhnZW9qc29uKSB7XG4gIC8vIElmIGFycmF5LCBhc3N1bWUgdGhpcyBpcyBhIGxpc3Qgb2YgZmVhdHVyZXNcbiAgaWYgKEFycmF5LmlzQXJyYXkoZ2VvanNvbikpIHtcbiAgICByZXR1cm4gZ2VvanNvbjtcbiAgfVxuXG4gIGNvbnN0IHR5cGUgPSBDb250YWluZXIuZ2V0KGdlb2pzb24sICd0eXBlJyk7XG4gIHN3aXRjaCAodHlwZSkge1xuICBjYXNlICdQb2ludCc6XG4gIGNhc2UgJ011bHRpUG9pbnQnOlxuICBjYXNlICdMaW5lU3RyaW5nJzpcbiAgY2FzZSAnTXVsdGlMaW5lU3RyaW5nJzpcbiAgY2FzZSAnUG9seWdvbic6XG4gIGNhc2UgJ011bHRpUG9seWdvbic6XG4gIGNhc2UgJ0dlb21ldHJ5Q29sbGVjdGlvbic6XG4gICAgLy8gV3JhcCB0aGUgZ2VvbWV0cnkgb2JqZWN0IGluIGEgJ0ZlYXR1cmUnIG9iamVjdCBhbmQgd3JhcCBpbiBhbiBhcnJheVxuICAgIHJldHVybiBbXG4gICAgICB7dHlwZTogJ0ZlYXR1cmUnLCBwcm9wZXJ0aWVzOiB7fSwgZ2VvbWV0cnk6IGdlb2pzb259XG4gICAgXTtcbiAgY2FzZSAnRmVhdHVyZSc6XG4gICAgLy8gV3JhcCB0aGUgZmVhdHVyZSBpbiBhICdGZWF0dXJlcycgYXJyYXlcbiAgICByZXR1cm4gW2dlb2pzb25dO1xuICBjYXNlICdGZWF0dXJlQ29sbGVjdGlvbic6XG4gICAgLy8gSnVzdCByZXR1cm4gdGhlICdGZWF0dXJlcycgYXJyYXkgZnJvbSB0aGUgY29sbGVjdGlvblxuICAgIHJldHVybiBDb250YWluZXIuZ2V0KGdlb2pzb24sICdmZWF0dXJlcycpO1xuICBkZWZhdWx0OlxuICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBnZW9qc29uIHR5cGUnKTtcbiAgfVxufVxuXG4vKlxuICogY29udmVydHMgYSBHZW9KU09OIFwiRmVhdHVyZVwiIG9iamVjdCB0byBhIGxpc3Qgb2YgR2VvSlNPTiBwb2x5Z29uLXN0eWxlIGNvb3JkaW5hdGVzXG4gKiBAcGFyYW0ge09iamVjdCB8IEFycmF5fSBkYXRhIC0gZ2VvanNvbiBvYmplY3Qgb3IgYXJyYXkgb2YgZmVhdHVyZVxuICogQHJldHVybnMge1tOdW1iZXIsTnVtYmVyLE51bWJlcl1bXVtdW119IGFycmF5IG9mIGNob3JvcGxldGhzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmZWF0dXJlVG9Qb2x5Z29ucyhmZWF0dXJlKSB7XG4gIGNvbnN0IGdlb21ldHJ5ID0gQ29udGFpbmVyLmdldChmZWF0dXJlLCAnZ2VvbWV0cnknKTtcbiAgLy8gSWYgbm8gZ2VvbWV0cnkgZmllbGQsIGFzc3VtZSB0aGF0IFwiZmVhdHVyZVwiIGlzIHRoZSBwb2x5Z29uIGxpc3RcbiAgaWYgKGdlb21ldHJ5ID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmVhdHVyZTtcbiAgfVxuXG4gIGNvbnN0IHR5cGUgPSBDb250YWluZXIuZ2V0KGdlb21ldHJ5LCAndHlwZScpO1xuICBjb25zdCBjb29yZGluYXRlcyA9IENvbnRhaW5lci5nZXQoZ2VvbWV0cnksICdjb29yZGluYXRlcycpO1xuXG4gIGxldCBwb2x5Z29ucztcbiAgc3dpdGNoICh0eXBlKSB7XG4gIGNhc2UgJ011bHRpUG9seWdvbic6XG4gICAgcG9seWdvbnMgPSBjb29yZGluYXRlcztcbiAgICBicmVhaztcbiAgY2FzZSAnUG9seWdvbic6XG4gICAgcG9seWdvbnMgPSBbY29vcmRpbmF0ZXNdO1xuICAgIGJyZWFrO1xuICBjYXNlICdMaW5lU3RyaW5nJzpcbiAgICAvLyBUT0RPIC0gc2hvdWxkIGxpbmVzIHJlYWxseSBiZSBoYW5kbGVkIGluIHRoaXMgc3dpdGNoP1xuICAgIHBvbHlnb25zID0gW1tjb29yZGluYXRlc11dO1xuICAgIGJyZWFrO1xuICBjYXNlICdNdWx0aUxpbmVTdHJpbmcnOlxuICAgIC8vIFRPRE8gLSBzaG91bGQgbGluZXMgcmVhbGx5IGJlIGhhbmRsZWQgaW4gdGhpcyBzd2l0Y2g/XG4gICAgcG9seWdvbnMgPSBDb250YWluZXIubWFwKGNvb3JkaW5hdGVzLCBjb29yZHMgPT4gW2Nvb3Jkc10pO1xuICAgIGJyZWFrO1xuICBkZWZhdWx0OlxuICAgIHBvbHlnb25zID0gW107XG4gIH1cbiAgcmV0dXJuIHBvbHlnb25zO1xufVxuXG4vLyBERVBSRUNBVEVEIC0gVVNFRCBCWSBPTEQgQ0hPUk9QTEVUSCBMQVlFUlNcblxuLypcbiAqIGNvbnZlcnRzIGxpc3Qgb2YgZmVhdHVyZXMgZnJvbSBhIEdlb0pTT04gb2JqZWN0IHRvIGEgbGlzdCBvZiBHZW9KU09OXG4gKiBwb2x5Z29uLXN0eWxlIGNvb3JkaW5hdGVzXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGdlb2pzb24gb2JqZWN0XG4gKiBAcmV0dXJucyB7W051bWJlcixOdW1iZXIsTnVtYmVyXVtdW11bXX0gYXJyYXkgb2YgY2hvcm9wbGV0aHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RQb2x5Z29ucyhkYXRhKSB7XG4gIGNvbnN0IG5vcm1hbGl6ZWRHZW9qc29uID0gbm9ybWFsaXplR2VvanNvbihkYXRhKTtcbiAgY29uc3QgZmVhdHVyZXMgPSBDb250YWluZXIuZ2V0KG5vcm1hbGl6ZWRHZW9qc29uLCAnZmVhdHVyZXMnKTtcblxuICBjb25zdCByZXN1bHQgPSBbXTtcbiAgZmVhdHVyZXMuZm9yRWFjaCgoZmVhdHVyZSwgZmVhdHVyZUluZGV4KSA9PiB7XG4gICAgbGV0IGNob3JvcGxldGhzID0gZmVhdHVyZVRvUG9seWdvbnMoZmVhdHVyZSk7XG5cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBtYXgtbmVzdGVkLWNhbGxiYWNrcyAqL1xuICAgIGNob3JvcGxldGhzID0gQ29udGFpbmVyLm1hcChjaG9yb3BsZXRocyxcbiAgICAgIGNob3JvcGxldGggPT4gQ29udGFpbmVyLm1hcChjaG9yb3BsZXRoLFxuICAgICAgICBwb2x5Z29uID0+IENvbnRhaW5lci5tYXAocG9seWdvbixcbiAgICAgICAgICBjb29yZCA9PiBbXG4gICAgICAgICAgICBDb250YWluZXIuZ2V0KGNvb3JkLCAwKSxcbiAgICAgICAgICAgIENvbnRhaW5lci5nZXQoY29vcmQsIDEpLFxuICAgICAgICAgICAgQ29udGFpbmVyLmdldChjb29yZCwgMikgfHwgMFxuICAgICAgICAgIF1cbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gICAgLyogZXNsaW50LWVuYWJsZSBtYXgtbmVzdGVkLWNhbGxiYWNrcyAqL1xuXG4gICAgZm9yIChjb25zdCBjaG9yb3BsZXRoIG9mIGNob3JvcGxldGhzKSB7XG4gICAgICBjaG9yb3BsZXRoLmZlYXR1cmVJbmRleCA9IGZlYXR1cmVJbmRleDtcbiAgICB9XG4gICAgcmVzdWx0LnB1c2goLi4uY2hvcm9wbGV0aHMpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBcIk5vcm1hbGl6ZXNcIiBhIEdlb0pTT04gZ2VvbWV0cnkgb3IgXCJGZWF0dXJlXCIgaW50byBhIFwiRmVhdHVyZUNvbGxlY3Rpb25cIixcbiAqIGJ5IHdyYXBwaW5nIGl0IGluIGFuIGV4dHJhIG9iamVjdC9hcnJheS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gZ2VvanNvbiAtIGdlb2pzb24gZGF0YVxuICogQHJldHVybiB7b2JqZWN0fSAtIG5vcm1hbGl6ZWQgZ2VvanNvbiBkYXRhXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVHZW9qc29uKGdlb2pzb24pIHtcbiAgY29uc3QgdHlwZSA9IENvbnRhaW5lci5nZXQoZ2VvanNvbiwgJ3R5cGUnKTtcbiAgc3dpdGNoICh0eXBlKSB7XG4gIGNhc2UgJ1BvaW50JzpcbiAgY2FzZSAnTXVsdGlQb2ludCc6XG4gIGNhc2UgJ0xpbmVTdHJpbmcnOlxuICBjYXNlICdNdWx0aUxpbmVTdHJpbmcnOlxuICBjYXNlICdQb2x5Z29uJzpcbiAgY2FzZSAnTXVsdGlQb2x5Z29uJzpcbiAgY2FzZSAnR2VvbWV0cnlDb2xsZWN0aW9uJzpcbiAgICAvLyBXcmFwIHRoZSBnZW9tZXRyeSBvYmplY3QgaW4gYSBcIkZlYXR1cmVcIiBhbmQgYWRkIHRoZSBmZWF0dXJlIHRvIGEgXCJGZWF0dXJlQ29sbGVjdGlvblwiXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICBmZWF0dXJlczogW1xuICAgICAgICB7dHlwZTogJ0ZlYXR1cmUnLCBwcm9wZXJ0aWVzOiB7fSwgZ2VvbWV0cnk6IGdlb2pzb259XG4gICAgICBdXG4gICAgfTtcbiAgY2FzZSAnRmVhdHVyZSc6XG4gICAgLy8gQWRkIHRoZSBmZWF0dXJlIHRvIGEgXCJGZWF0dXJlQ29sbGVjdGlvblwiXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICBmZWF0dXJlczogW2dlb2pzb25dXG4gICAgfTtcbiAgY2FzZSAnRmVhdHVyZUNvbGxlY3Rpb24nOlxuICAgIC8vIEp1c3QgcmV0dXJuIHRoZSBmZWF0dXJlIGNvbGxlY3Rpb25cbiAgICByZXR1cm4gZ2VvanNvbjtcbiAgZGVmYXVsdDpcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZ2VvanNvbiB0eXBlJyk7XG4gIH1cbn1cbiJdfQ==