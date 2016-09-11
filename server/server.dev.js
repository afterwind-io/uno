var path = require('path')
var express = require('express')
var webpack = require('webpack')
var webpackConfig = require('../webpack.config.dev.js')
var compiler = webpack(webpackConfig)

// 启动本地Webpack Dev Server
var _app
var WebpackDevServer = require('webpack-dev-server')
var server = new WebpackDevServer(compiler, {
  inline: true,
  hot: true,
  stats: { colors: true },
  setup: function (app) {
    app.use(express.static(path.dirname(__dirname)))

    app.get('/', function (req, res) {
      res.sendFile('index.html')
    })

    _app = app
  }
})

module.exports = {
  app: _app,
  start: function (port) {
    server.listen(port)
    console.log('Webpack dev server listening on *:3000')
  }
}
