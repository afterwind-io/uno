let path = require('path')
let express = require('express')
let webpack = require('webpack')
let webpackConfig = require('../webpack.config.dev.js')
let compiler = webpack(webpackConfig)

// 启动本地Webpack Dev Server
let _app
let WebpackDevServer = require('webpack-dev-server')
let server = new WebpackDevServer(compiler, {
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
