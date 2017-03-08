var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: './dist',
    filename: 'bundle-[chunkhash].js'
  },
  resolve: {
    extensions: ['.web.js', '.js', '.json', '.ts', '.tsx'],
    alias: {
      react: 'preact-compat',
      'react-dom': 'preact-compat'
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: ['babel-loader?cacheDirectory', 'ts-loader']
      },
      { test: /\.css$/, loader: "style-loader!css-loader" }
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