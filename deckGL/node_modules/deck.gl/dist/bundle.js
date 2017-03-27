'use strict';

require('babel-polyfill');

var _index = require('./index');

var DeckGL = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/* Generate script that can be used in browser without browserify */

/* global window */
(function exposeAsGlobal() {
  if (typeof window !== 'undefined') {
    window.DeckGL = DeckGL;
  }
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9idW5kbGUuanMiXSwibmFtZXMiOlsiRGVja0dMIiwiZXhwb3NlQXNHbG9iYWwiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7O0FBR0E7O0FBQ0E7O0lBQVlBLE07Ozs7QUFKWjs7QUFFQTtBQUlDLFVBQVNDLGNBQVQsR0FBMEI7QUFDekIsTUFBSSxPQUFPQyxNQUFQLEtBQWtCLFdBQXRCLEVBQW1DO0FBQ2pDQSxXQUFPRixNQUFQLEdBQWdCQSxNQUFoQjtBQUNEO0FBQ0YsQ0FKQSxHQUFEIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEdlbmVyYXRlIHNjcmlwdCB0aGF0IGNhbiBiZSB1c2VkIGluIGJyb3dzZXIgd2l0aG91dCBicm93c2VyaWZ5ICovXG5cbi8qIGdsb2JhbCB3aW5kb3cgKi9cbmltcG9ydCAnYmFiZWwtcG9seWZpbGwnO1xuaW1wb3J0ICogYXMgRGVja0dMIGZyb20gJy4vaW5kZXgnO1xuXG4oZnVuY3Rpb24gZXhwb3NlQXNHbG9iYWwoKSB7XG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHdpbmRvdy5EZWNrR0wgPSBEZWNrR0w7XG4gIH1cbn0oKSk7XG4iXX0=