const request = require('request')
const port = require('../config.js').ports.auth

module.exports = function (req, res, next) {
  let exception = ['login', 'register'].some(e => req.path.includes(e))
  if (exception) return next()

  let gid = req.session.gid || 'doge'
  request({
    method: 'POST',
    uri: `http://127.0.0.1:${port}/service/auth/check`,
    json: true,
    body: { info: { gid: gid } },
    timeout: 1000 * 30
  }, (err, response, body) => {
    console.log(body)
    if (response.statusCode === 200) {
      if (body.result) {
        next()
      } else {
        res.status(500).json('Auth Error')
      }
    } else {
      console.log('auth', err)
      console.log('auth', response.statusCode)
      console.log('auth', body)
      res.status(500).json('Auth Server Error')
    }
  })
}
