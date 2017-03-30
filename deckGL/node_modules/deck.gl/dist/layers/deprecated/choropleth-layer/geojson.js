'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGeojsonFeatures = getGeojsonFeatures;
exports.featureToPolygons = featureToPolygons;
exports.extractPolygons = extractPolygons;
exports.normalizeGeojson = normalizeGeojson;

var _utils = require('../../../lib/utils');

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

  var type = _utils.Container.get(geojson, 'type');
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
      return _utils.Container.get(geojson, 'features');
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
  var geometry = _utils.Container.get(feature, 'geometry');
  // If no geometry field, assume that "feature" is the polygon list
  if (geometry === undefined) {
    return feature;
  }

  var type = _utils.Container.get(geometry, 'type');
  var coordinates = _utils.Container.get(geometry, 'coordinates');

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
      polygons = _utils.Container.map(coordinates, function (coords) {
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
  var features = _utils.Container.get(normalizedGeojson, 'features');

  var result = [];
  features.forEach(function (feature, featureIndex) {
    var choropleths = featureToPolygons(feature);

    /* eslint-disable max-nested-callbacks */
    choropleths = _utils.Container.map(choropleths, function (choropleth) {
      return _utils.Container.map(choropleth, function (polygon) {
        return _utils.Container.map(polygon, function (coord) {
          return [_utils.Container.get(coord, 0), _utils.Container.get(coord, 1), _utils.Container.get(coord, 2) || 0];
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
  var type = _utils.Container.get(geojson, 'type');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9sYXllcnMvZGVwcmVjYXRlZC9jaG9yb3BsZXRoLWxheWVyL2dlb2pzb24uanMiXSwibmFtZXMiOlsiZ2V0R2VvanNvbkZlYXR1cmVzIiwiZmVhdHVyZVRvUG9seWdvbnMiLCJleHRyYWN0UG9seWdvbnMiLCJub3JtYWxpemVHZW9qc29uIiwiZ2VvanNvbiIsIkFycmF5IiwiaXNBcnJheSIsInR5cGUiLCJnZXQiLCJwcm9wZXJ0aWVzIiwiZ2VvbWV0cnkiLCJFcnJvciIsImZlYXR1cmUiLCJ1bmRlZmluZWQiLCJjb29yZGluYXRlcyIsInBvbHlnb25zIiwibWFwIiwiY29vcmRzIiwiZGF0YSIsIm5vcm1hbGl6ZWRHZW9qc29uIiwiZmVhdHVyZXMiLCJyZXN1bHQiLCJmb3JFYWNoIiwiZmVhdHVyZUluZGV4IiwiY2hvcm9wbGV0aHMiLCJjaG9yb3BsZXRoIiwicG9seWdvbiIsImNvb3JkIiwicHVzaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFjZ0JBLGtCLEdBQUFBLGtCO1FBbUNBQyxpQixHQUFBQSxpQjtRQXdDQUMsZSxHQUFBQSxlO1FBcUNBQyxnQixHQUFBQSxnQjs7QUE5SGhCOzs7O0FBRUE7Ozs7Ozs7Ozs7OztBQVlPLFNBQVNILGtCQUFULENBQTRCSSxPQUE1QixFQUFxQztBQUMxQztBQUNBLE1BQUlDLE1BQU1DLE9BQU4sQ0FBY0YsT0FBZCxDQUFKLEVBQTRCO0FBQzFCLFdBQU9BLE9BQVA7QUFDRDs7QUFFRCxNQUFNRyxPQUFPLGlCQUFVQyxHQUFWLENBQWNKLE9BQWQsRUFBdUIsTUFBdkIsQ0FBYjtBQUNBLFVBQVFHLElBQVI7QUFDQSxTQUFLLE9BQUw7QUFDQSxTQUFLLFlBQUw7QUFDQSxTQUFLLFlBQUw7QUFDQSxTQUFLLGlCQUFMO0FBQ0EsU0FBSyxTQUFMO0FBQ0EsU0FBSyxjQUFMO0FBQ0EsU0FBSyxvQkFBTDtBQUNFO0FBQ0EsYUFBTyxDQUNMLEVBQUNBLE1BQU0sU0FBUCxFQUFrQkUsWUFBWSxFQUE5QixFQUFr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QUssWUFBTDtBQUNBLFNBQUssWUFBTDtBQUNBLFNBQUssaUJBQUw7QUFDQSxTQUFLLFNBQUw7QUFDQSxTQUFLLGNBQUw7QUFDQSxTQUFLLG9CQUFMO0FBQ0U7QUFDQSxhQUFPO0FBQ0xBLGNBQU0sbUJBREQ7QUFFTGEsa0JBQVUsQ0FDUixFQUFDYixNQUFNLFNBQVAsRUFBa0JFLFlBQVksRUFBOUIsRUFBa0NDLFVBQVVOLE9BQTVDLEVBRFE7QUFGTCxPQUFQO0FBTUYsU0FBSyxTQUFMO0FBQ0U7QUFDQSxhQUFPO0FBQ0xHLGNBQU0sbUJBREQ7QUFFTGEsa0JBQVUsQ0FBQ2hCLE9BQUQ7QUFGTCxPQUFQO0FBSUYsU0FBSyxtQkFBTDtBQUNFO0FBQ0EsYUFBT0EsT0FBUDtBQUNGO0FBQ0UsWUFBTSxJQUFJTyxLQUFKLENBQVUsc0JBQVYsQ0FBTjtBQXpCRjtBQTJCRCIsImZpbGUiOiJnZW9qc29uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb250YWluZXJ9IGZyb20gJy4uLy4uLy4uL2xpYi91dGlscyc7XG5cbi8qKlxuICogXCJOb3JtYWxpemVzXCIgY29tcGxldGUgb3IgcGFydGlhbCBHZW9KU09OIGRhdGEgaW50byBpdGVyYWJsZSBsaXN0IG9mIGZlYXR1cmVzXG4gKiBDYW4gYWNjZXB0IEdlb0pTT04gZ2VvbWV0cnkgb3IgXCJGZWF0dXJlXCIsIFwiRmVhdHVyZUNvbGxlY3Rpb25cIiBpbiBhZGRpdGlvblxuICogdG8gcGxhaW4gYXJyYXlzIGFuZCBpdGVyYWJsZXMuXG4gKiBXb3JrcyBieSBleHRyYWN0aW5nIHRoZSBmZWF0dXJlIGFycmF5IG9yIHdyYXBwaW5nIHNpbmdsZSBvYmplY3RzIGluIGFuIGFycmF5LFxuICogc28gdGhhdCBzdWJzZXF1ZW50IGNvZGUgY2FuIHNpbXBseSBpdGVyYXRlIG92ZXIgZmVhdHVyZXMuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGdlb2pzb24gLSBnZW9qc29uIGRhdGFcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBkYXRhIC0gZ2VvanNvbiBvYmplY3QgKEZlYXR1cmVDb2xsZWN0aW9uLCBGZWF0dXJlIG9yXG4gKiAgR2VvbWV0cnkpIG9yIGFycmF5IG9mIGZlYXR1cmVzXG4gKiBAcmV0dXJuIHtBcnJheXxcIml0ZXJhdGFibGVcIn0gLSBpdGVyYWJsZSBsaXN0IG9mIGZlYXR1cmVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRHZW9qc29uRmVhdHVyZXMoZ2VvanNvbikge1xuICAvLyBJZiBhcnJheSwgYXNzdW1lIHRoaXMgaXMgYSBsaXN0IG9mIGZlYXR1cmVzXG4gIGlmIChBcnJheS5pc0FycmF5KGdlb2pzb24pKSB7XG4gICAgcmV0dXJuIGdlb2pzb247XG4gIH1cblxuICBjb25zdCB0eXBlID0gQ29udGFpbmVyLmdldChnZW9qc29uLCAndHlwZScpO1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgY2FzZSAnUG9pbnQnOlxuICBjYXNlICdNdWx0aVBvaW50JzpcbiAgY2FzZSAnTGluZVN0cmluZyc6XG4gIGNhc2UgJ011bHRpTGluZVN0cmluZyc6XG4gIGNhc2UgJ1BvbHlnb24nOlxuICBjYXNlICdNdWx0aVBvbHlnb24nOlxuICBjYXNlICdHZW9tZXRyeUNvbGxlY3Rpb24nOlxuICAgIC8vIFdyYXAgdGhlIGdlb21ldHJ5IG9iamVjdCBpbiBhICdGZWF0dXJlJyBvYmplY3QgYW5kIHdyYXAgaW4gYW4gYXJyYXlcbiAgICByZXR1cm4gW1xuICAgICAge3R5cGU6ICdGZWF0dXJlJywgcHJvcGVydGllczoge30sIGdlb21ldHJ5OiBnZW9qc29ufVxuICAgIF07XG4gIGNhc2UgJ0ZlYXR1cmUnOlxuICAgIC8vIFdyYXAgdGhlIGZlYXR1cmUgaW4gYSAnRmVhdHVyZXMnIGFycmF5XG4gICAgcmV0dXJuIFtnZW9qc29uXTtcbiAgY2FzZSAnRmVhdHVyZUNvbGxlY3Rpb24nOlxuICAgIC8vIEp1c3QgcmV0dXJuIHRoZSAnRmVhdHVyZXMnIGFycmF5IGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICByZXR1cm4gQ29udGFpbmVyLmdldChnZW9qc29uLCAnZmVhdHVyZXMnKTtcbiAgZGVmYXVsdDpcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZ2VvanNvbiB0eXBlJyk7XG4gIH1cbn1cblxuLypcbiAqIGNvbnZlcnRzIGEgR2VvSlNPTiBcIkZlYXR1cmVcIiBvYmplY3QgdG8gYSBsaXN0IG9mIEdlb0pTT04gcG9seWdvbi1zdHlsZSBjb29yZGluYXRlc1xuICogQHBhcmFtIHtPYmplY3QgfCBBcnJheX0gZGF0YSAtIGdlb2pzb24gb2JqZWN0IG9yIGFycmF5IG9mIGZlYXR1cmVcbiAqIEByZXR1cm5zIHtbTnVtYmVyLE51bWJlcixOdW1iZXJdW11bXVtdfSBhcnJheSBvZiBjaG9yb3BsZXRoc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZmVhdHVyZVRvUG9seWdvbnMoZmVhdHVyZSkge1xuICBjb25zdCBnZW9tZXRyeSA9IENvbnRhaW5lci5nZXQoZmVhdHVyZSwgJ2dlb21ldHJ5Jyk7XG4gIC8vIElmIG5vIGdlb21ldHJ5IGZpZWxkLCBhc3N1bWUgdGhhdCBcImZlYXR1cmVcIiBpcyB0aGUgcG9seWdvbiBsaXN0XG4gIGlmIChnZW9tZXRyeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZlYXR1cmU7XG4gIH1cblxuICBjb25zdCB0eXBlID0gQ29udGFpbmVyLmdldChnZW9tZXRyeSwgJ3R5cGUnKTtcbiAgY29uc3QgY29vcmRpbmF0ZXMgPSBDb250YWluZXIuZ2V0KGdlb21ldHJ5LCAnY29vcmRpbmF0ZXMnKTtcblxuICBsZXQgcG9seWdvbnM7XG4gIHN3aXRjaCAodHlwZSkge1xuICBjYXNlICdNdWx0aVBvbHlnb24nOlxuICAgIHBvbHlnb25zID0gY29vcmRpbmF0ZXM7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ1BvbHlnb24nOlxuICAgIHBvbHlnb25zID0gW2Nvb3JkaW5hdGVzXTtcbiAgICBicmVhaztcbiAgY2FzZSAnTGluZVN0cmluZyc6XG4gICAgLy8gVE9ETyAtIHNob3VsZCBsaW5lcyByZWFsbHkgYmUgaGFuZGxlZCBpbiB0aGlzIHN3aXRjaD9cbiAgICBwb2x5Z29ucyA9IFtbY29vcmRpbmF0ZXNdXTtcbiAgICBicmVhaztcbiAgY2FzZSAnTXVsdGlMaW5lU3RyaW5nJzpcbiAgICAvLyBUT0RPIC0gc2hvdWxkIGxpbmVzIHJlYWxseSBiZSBoYW5kbGVkIGluIHRoaXMgc3dpdGNoP1xuICAgIHBvbHlnb25zID0gQ29udGFpbmVyLm1hcChjb29yZGluYXRlcywgY29vcmRzID0+IFtjb29yZHNdKTtcbiAgICBicmVhaztcbiAgZGVmYXVsdDpcbiAgICBwb2x5Z29ucyA9IFtdO1xuICB9XG4gIHJldHVybiBwb2x5Z29ucztcbn1cblxuLy8gREVQUkVDQVRFRCAtIFVTRUQgQlkgT0xEIENIT1JPUExFVEggTEFZRVJTXG5cbi8qXG4gKiBjb252ZXJ0cyBsaXN0IG9mIGZlYXR1cmVzIGZyb20gYSBHZW9KU09OIG9iamVjdCB0byBhIGxpc3Qgb2YgR2VvSlNPTlxuICogcG9seWdvbi1zdHlsZSBjb29yZGluYXRlc1xuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBnZW9qc29uIG9iamVjdFxuICogQHJldHVybnMge1tOdW1iZXIsTnVtYmVyLE51bWJlcl1bXVtdW119IGFycmF5IG9mIGNob3JvcGxldGhzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0UG9seWdvbnMoZGF0YSkge1xuICBjb25zdCBub3JtYWxpemVkR2VvanNvbiA9IG5vcm1hbGl6ZUdlb2pzb24oZGF0YSk7XG4gIGNvbnN0IGZlYXR1cmVzID0gQ29udGFpbmVyLmdldChub3JtYWxpemVkR2VvanNvbiwgJ2ZlYXR1cmVzJyk7XG5cbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGZlYXR1cmVzLmZvckVhY2goKGZlYXR1cmUsIGZlYXR1cmVJbmRleCkgPT4ge1xuICAgIGxldCBjaG9yb3BsZXRocyA9IGZlYXR1cmVUb1BvbHlnb25zKGZlYXR1cmUpO1xuXG4gICAgLyogZXNsaW50LWRpc2FibGUgbWF4LW5lc3RlZC1jYWxsYmFja3MgKi9cbiAgICBjaG9yb3BsZXRocyA9IENvbnRhaW5lci5tYXAoY2hvcm9wbGV0aHMsXG4gICAgICBjaG9yb3BsZXRoID0+IENvbnRhaW5lci5tYXAoY2hvcm9wbGV0aCxcbiAgICAgICAgcG9seWdvbiA9PiBDb250YWluZXIubWFwKHBvbHlnb24sXG4gICAgICAgICAgY29vcmQgPT4gW1xuICAgICAgICAgICAgQ29udGFpbmVyLmdldChjb29yZCwgMCksXG4gICAgICAgICAgICBDb250YWluZXIuZ2V0KGNvb3JkLCAxKSxcbiAgICAgICAgICAgIENvbnRhaW5lci5nZXQoY29vcmQsIDIpIHx8IDBcbiAgICAgICAgICBdXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICAgIC8qIGVzbGludC1lbmFibGUgbWF4LW5lc3RlZC1jYWxsYmFja3MgKi9cblxuICAgIGZvciAoY29uc3QgY2hvcm9wbGV0aCBvZiBjaG9yb3BsZXRocykge1xuICAgICAgY2hvcm9wbGV0aC5mZWF0dXJlSW5kZXggPSBmZWF0dXJlSW5kZXg7XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKC4uLmNob3JvcGxldGhzKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogXCJOb3JtYWxpemVzXCIgYSBHZW9KU09OIGdlb21ldHJ5IG9yIFwiRmVhdHVyZVwiIGludG8gYSBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gKiBieSB3cmFwcGluZyBpdCBpbiBhbiBleHRyYSBvYmplY3QvYXJyYXkuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGdlb2pzb24gLSBnZW9qc29uIGRhdGFcbiAqIEByZXR1cm4ge29iamVjdH0gLSBub3JtYWxpemVkIGdlb2pzb24gZGF0YVxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplR2VvanNvbihnZW9qc29uKSB7XG4gIGNvbnN0IHR5cGUgPSBDb250YWluZXIuZ2V0KGdlb2pzb24sICd0eXBlJyk7XG4gIHN3aXRjaCAodHlwZSkge1xuICBjYXNlICdQb2ludCc6XG4gIGNhc2UgJ011bHRpUG9pbnQnOlxuICBjYXNlICdMaW5lU3RyaW5nJzpcbiAgY2FzZSAnTXVsdGlMaW5lU3RyaW5nJzpcbiAgY2FzZSAnUG9seWdvbic6XG4gIGNhc2UgJ011bHRpUG9seWdvbic6XG4gIGNhc2UgJ0dlb21ldHJ5Q29sbGVjdGlvbic6XG4gICAgLy8gV3JhcCB0aGUgZ2VvbWV0cnkgb2JqZWN0IGluIGEgXCJGZWF0dXJlXCIgYW5kIGFkZCB0aGUgZmVhdHVyZSB0byBhIFwiRmVhdHVyZUNvbGxlY3Rpb25cIlxuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnRmVhdHVyZUNvbGxlY3Rpb24nLFxuICAgICAgZmVhdHVyZXM6IFtcbiAgICAgICAge3R5cGU6ICdGZWF0dXJlJywgcHJvcGVydGllczoge30sIGdlb21ldHJ5OiBnZW9qc29ufVxuICAgICAgXVxuICAgIH07XG4gIGNhc2UgJ0ZlYXR1cmUnOlxuICAgIC8vIEFkZCB0aGUgZmVhdHVyZSB0byBhIFwiRmVhdHVyZUNvbGxlY3Rpb25cIlxuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnRmVhdHVyZUNvbGxlY3Rpb24nLFxuICAgICAgZmVhdHVyZXM6IFtnZW9qc29uXVxuICAgIH07XG4gIGNhc2UgJ0ZlYXR1cmVDb2xsZWN0aW9uJzpcbiAgICAvLyBKdXN0IHJldHVybiB0aGUgZmVhdHVyZSBjb2xsZWN0aW9uXG4gICAgcmV0dXJuIGdlb2pzb247XG4gIGRlZmF1bHQ6XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGdlb2pzb24gdHlwZScpO1xuICB9XG59XG4iXX0=