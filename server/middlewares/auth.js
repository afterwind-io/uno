const request = require('superagent')
const port = require('../config.js').ports.auth

module.exports = function (req, res, next) {
  let exception = ['login', 'register'].some(e => req.path.includes(e))
  if (exception) return next()

  let uid = req.session.uid || 'doge'
  let uri = `http://127.0.0.1:${port}/service/auth/check`
  request.post(uri)
    .set({
      'Content-Type': 'application/json'
    })
    .withCredentials()
    .timeout(1000 * 30)
    .send({ uid })
    .end((err, { body }) => {
      if (err) return res.status(500).json('Auth Server Error')

      if (!body) return res.status(500).json('Auth Error')

      next()
    })
}
