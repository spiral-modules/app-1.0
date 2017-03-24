'use strict';

const path = require('path');
const loaders = require('./webpack/loaders');
const plugins = require('./webpack/plugins');

const applicationEntries = process.env.NODE_ENV === 'development'
  ? [ 'webpack-hot-middleware/client?reload=true' ]
  : [ ];

module.exports = {

  entry: {
      client: [ './websource/client.js'].concat(applicationEntries),
      admin: ['./websource/admin.js'].concat(applicationEntries)
  },

  output: {
    path: path.join(__dirname, 'webroot', 'resources', 'generated'),
    filename: '[name].js',
    publicPath: '/',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[id].chunk.js'
  },

  devtool: process.env.NODE_ENV === 'production' ?
    'source-map' :
    'inline-source-map',

  resolve: {
    extensions: [
      '.js',
      '.json',
      '.webpack.js',
      '.web.js',
      '.tsx',
      '.ts',
      '.scss',
      '.less',
      '.css'
    ]
  },

  plugins: plugins,

  devServer: {
    historyApiFallback: { index: '/' }
  },

  module: {
    rules: [
      loaders.tslint,
      loaders.eslint,

      loaders.js,
      loaders.tsx,
      loaders.html,
      loaders.css,
      loaders.less,
      loaders.sass,
      loaders.svg,
      loaders.eot,
      loaders.woff,
      loaders.woff2,
      loaders.ttf,
      loaders.json
    ]
  }
};
