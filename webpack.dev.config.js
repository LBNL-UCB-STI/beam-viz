let config = require('./webpack.config.js');

config.devtool = 'source-map';
config.devServer = {
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  }
};

module.exports = config;
