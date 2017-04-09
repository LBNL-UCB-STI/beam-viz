const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const cwd = path.resolve(__dirname);
const outputPath = path.join(cwd, 'public');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

function getPostcssPlugins() {
  return [
    autoprefixer({
      cascade: false,
      browsers: ['Last 3 versions', '>5%'],
      remove: true
    })
  ];
}

const config = {
  entry: path.join(cwd, 'src', 'app.js'),
  output: {
    path: outputPath,
    filename: 'bundle.js',
    publicPath: '/assets/'
  },
  devtool: 'source-map',
  devServer: {
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },
  resolve: {
    alias: {
      'mapbox-gl$': path.join(cwd, 'node_modules', 'mapbox-gl', 'dist', 'mapbox-gl.js')
    }
  },
  module: {
    loaders: [
      {
        test: /node_modules[\/\\]mapbox-gl/,
        loader: 'babel-loader',
        query: {
          plugins: ['transform-flow-strip-types'],
          presets: ['es2015']
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'react'],
          plugins: ['transform-object-rest-spread'],
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract([
          'css-loader?sourceMap&importLoaders=1',
          {
            loader: 'postcss-loader',
            options: {
              plugins: getPostcssPlugins
            }
          }
        ])
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract([
          'css-loader?sourceMap&importLoaders=1',
          'sass-loader?sourceMap&importLoaders=1',
          {
            loader: 'postcss-loader',
            options: {
              plugins: getPostcssPlugins
            }
          }
        ])
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        exclude: [/node_modules/]
      },
      {
        test: /\.glsl$/,
        loaders: ['raw-loader', 'glslify-loader'],
        exclude: [/node_modules/]
      },
      { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&minetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
      { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192' }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      regeneratorRuntime: 'regenerator-runtime'
    })
  ]
};

module.exports = config;
