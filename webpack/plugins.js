'use strict';

const path = require('path');
const webpack = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const postcss = require('./postcss');

const sourceMap = process.env.TEST || process.env.NODE_ENV !== 'production'
    ? [new webpack.SourceMapDevToolPlugin({filename: null, test: /\.tsx?$/})]
    : [];

const basePlugins = [
    new webpack.DefinePlugin({
        __DEV__: process.env.NODE_ENV !== 'production',
        __TEST__: JSON.stringify(process.env.TEST || false),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    /* new CopyWebpackPlugin([
     {from: 'src/assets', to: 'assets'}
     ])*/
    new webpack.LoaderOptionsPlugin({
        options: {
            tslint: {},
            postcss: postcss
        }
    })
].concat(sourceMap);

const devPlugins = [
    new StyleLintPlugin({
        configFile: './.stylelintrc.json',
        files: ['websource/**/*.css'],
        failOnError: false
    }),
    new Visualizer({
        filename: './webpack-stat.' + process.env.NODE_ENV + '.html'
    })
];

const prodPlugins = [
    new StyleLintPlugin({
        configFile: './.stylelintrc.json',
        files: ['websource/**/*.css'],
        failOnError: false
    }),
    new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
            warnings: false
        }
    })
];

module.exports = basePlugins
    .concat(process.env.NODE_ENV === 'production' ? prodPlugins : [])
    .concat(process.env.NODE_ENV === 'development' ? devPlugins : []);
