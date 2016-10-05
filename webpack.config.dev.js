var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    app: [
      // 'webpack-dev-server/client?http://localhost:3000/',
      'webpack-dev-server/client?http://192.168.1.4:3000/',
      'webpack/hot/dev-server',
      './public/app.js'
    ],
    vendor: [
      // 'babel-polyfill',
      'jquery',
      'sockjs-client',
      'socket.io-client',
      'vue',
      'vue-hot-reload-api'
      // 'extract-text-webpack-plugin',
      // 'babel-loader',
      // 'css-loader',
      // 'vue-loader',
    ]
  },
  output: {
    path: __dirname,
    filename: 'app.js'
  },
  module: {
    loaders: [{
      test: /\.vue$/,
      exclude: /node_modules/,
      loader: 'vue'
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract('style', 'css!less')
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'dev')
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('[name].css')
  ],
  vue: {
    loaders: {
      less: ExtractTextPlugin.extract('css!less')
    }
  }
}
