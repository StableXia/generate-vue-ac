/* eslint-disable no-undef */

const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const base = require('./webpack.base.config.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const configJson = require('../project.config.json')

module.exports = merge(base, {
  devtool: 'source-map',

  mode: 'production',

  performance: {
    hints: false
  },

  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new HtmlWebpackPlugin({
      title: configJson.app.htmlTitle,
      filename: 'index.html',
      template: 'index.html'
    })
  ]
})
