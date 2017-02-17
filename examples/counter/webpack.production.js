var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './build/index.js',
  output: {
    path: './dist',
    filename: 'bundle-[chunkhash].js'
  },
  resolve: {
    extensions: ['.web.js', '.js', '.json'],
    alias: {
      react: 'preact-compat',
      'react-dom': 'preact-compat'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'build'),
          path.resolve(__dirname, 'node_modules/plume2'),
          path.resolve(__dirname, 'node_modules/preact-compat')
        ],
        loader: 'babel-loader?cacheDirectory'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: false,
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./dist/vendor-manifest.json')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
      dev: false,
      favicon: './favicon.ico',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        minifyURLs: true,
        minifyCSS: true
      },
      filename: 'index.html',
      template: './index.ejs'
    })
  ]
};