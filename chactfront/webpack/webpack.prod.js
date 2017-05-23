const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const cwd = process.cwd();
const extractCSS = new ExtractTextPlugin('css/[name].[contenthash:8].css');
const extractLESS = new ExtractTextPlugin('css/[name].[contenthash:8].css');
const extractSASS = new ExtractTextPlugin({
  filename: 'css/main.[contenthash:8].css',
  disable: false,
  allChunks: true,
});

require('babel-polyfill');
module.exports = require('./webpack.base')({
  entry: {
    index: 'index.js',
    vendor: ['react', 'react-dom', 'react-router', 'redux', 'react-redux', 'react-router-redux', 'moment', 'immutable', 'md5', 'lodash'],
  },
  output: {
    publicPath: 'http://127.0.0.1:8086/',
    filename: 'js/[name].[hash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
  },
  rules: [
    {
      test: /\.css$/,
      use: extractCSS.extract({
        fallback: 'style-loader',
        use: [
          {
            loader: 'css-loader',
            options: {
              minimize: true,
            }
          }
        ]
      })
    },
    {
      test: /\.less$/,
      use: extractLESS.extract({
        fallback: 'style-loader',
        use: [
          {
            loader: 'css-loader',
            options: {
              minimize: true,
            }
          },
          {
            loader: 'less-loader',
          }
        ]
      })
    },
    {
      test: /\.scss$/,
      use: extractSASS.extract({
        fallback: 'style-loader',
        use: [
          {
            loader: 'css-loader',
            options: {
              minimize: true,
            }
          },
          {
            loader: 'sass-loader',
          }
        ]
      })
    },
  ],
  plugins: [
    extractCSS,
    extractLESS,
    extractSASS,
    new webpack.optimize.CommonsChunkPlugin({
      names: ['manifest', 'vendor'],
      minChunks: 2,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: path.resolve(cwd, '../chactapi/public/index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),
    new webpack.optimize.UglifyJsPlugin({
      // 最紧凑的输出
      beautify: false,
      // 删除所有的注释
      comments: false,
      compress: {
        // 在UglifyJs删除没有用到的代码时不输出警告
        warnings: false,
        // 删除所有的 `console` 语句
        // 还可以兼容ie浏览器
        drop_console: true,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true,
      }
    })
  ],
  devtool: 'inline-source-map',
});
