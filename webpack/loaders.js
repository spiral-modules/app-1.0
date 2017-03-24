'use strict';

exports.tslint = {
  enforce: 'pre',
  test: /\.tsx?$/,
  loader: 'tslint-loader',
  exclude: /node_modules/
};

exports.eslint = {
  enforce: 'pre',
  test: /\.js$/,
  loader: 'eslint-loader',
  exclude: /node_modules/
};

exports.stylelint = {
  test: /\.css|less|scss$/,
  loader: 'style-loader!css-loader?-url&sourceMap'
};

exports.tsx = {
  test: /\.tsx?$/,
  loader: 'awesome-typescript-loader',
  exclude: /node_modules/
};

exports.html = {
  test: /\.html$/,
  loader: 'raw',
  exclude: /node_modules/
};

exports.css = {
  test: /\.css$/,
  loader: 'style-loader!css-loader?-url&sourceMap'
};

exports.less = {
  test: /\.less$/,
  exclude: /(node_modules)/,
  loader: 'style-loader!css-loader?-url&sourceMap!less-loader?sourceMap'
};

exports.sass = {
  test: /\.scss$/,
  exclude: /(node_modules)/,
  loader: 'style-loader!css-loader?-url&sourceMap!sass-loader?sourceMap'
};

exports.json = {
  test: /\.json$/,
  loader: 'json'
};

exports.js = {
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel-loader'
};

exports.svg = makeUrlLoader(/\.svg$/);
exports.eot = makeUrlLoader(/\.eot$/);
exports.woff = makeUrlLoader(/\.woff$/);
exports.woff2 = makeUrlLoader(/\.woff2$/);
exports.ttf = makeUrlLoader(/\.ttf$/);

function makeUrlLoader(pattern) {
  return {
    test: pattern,
    loader: 'url',
    exclude: /node_modules/
  };
}
