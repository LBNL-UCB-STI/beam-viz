# svg-transform

Example usage

````js
var transform = require('svg-transform');
transform([{translate: [10, 20]}); // === 'translate(20, 10)'
transform([{scale: 20}, {translate: [20, 10]}]); // === 'scale(20) translate(20, 10)'
````
