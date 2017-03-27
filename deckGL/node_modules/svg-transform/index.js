'use strict';

module.exports = function transform(props) {
  var transform = [];
  if (Array.isArray(props)) {
    props.forEach(function forEachAccessor(prop) {
      var key = Object.keys(prop)[0];
      transform.push(key + '(' + prop[key] + ')');
    });
  }
  return transform.join(' ');
};
