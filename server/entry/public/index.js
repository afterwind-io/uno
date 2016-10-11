const express = require('express')
const webpack = require('webpack')
const webpackConfig = require('../../../webpack.config.dev.js')
const compiler = webpack(webpackConfig)
const ports = require('../../config.js').ports

// 启动本地Webpack Dev Server
const WebpackDevServer = require('webpack-dev-server')
const server = new WebpackDevServer(compiler, {
  hot: true,
  noInfo: true,
  stats: { colors: true },
  setup: function (app) {
    app.use(express.static(process.cwd()))

    app.get('/', function (req, res) {
      res.sendFile('index.html')
    })
  }
})

module.exports = {
  start: function () {
    let portPublic = ports.public

    server.listen(portPublic)
    console.log(`[Server][WDS][Public]Starts on :${portPublic}`)
  }
}
