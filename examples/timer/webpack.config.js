var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: './build/index.js',
  output: {
    path: './build',
    filename: 'bundle.js'
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'web_modules')],
    extensions: ['.web.js', '.js', '.json'],
    alias: {
      react: 'preact-compat',
      'react-dom': 'preact-compat'
    }
  },
  module: {
    loaders: [
      {
        test: /\.js/, 
        include: [
          path.resolve(__dirname, 'build'),
          path.resolve(__dirname, 'node_modules/plume2/dist')
        ],
        loader: 'babel-loader?cacheDirectory'
      }
    ]
  },
  plugins: [
     new webpack.DefinePlugin({
      __DEV__: true
    }),
    new HtmlWebpackPlugin({
      dev: true,
      favicon:'./favicon.ico',
      filename: 'index.html',
      template: './index.ejs'
    })
  ],
  devServer: {
    host: '0.0.0.0',
    port: 3000
  }
}