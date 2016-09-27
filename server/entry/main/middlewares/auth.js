const request = require('request')

module.exports = function (req, res, next) {
  if (req.path.includes('login')) return next()

  let gid = req.session.gid
  request({
    method: 'POST',
    uri: 'localhost:4012/service/auth/check',
    'content-type': 'application/json',
    body: JSON.stringify({ info: { gid: gid } }),
    timeout: 1000 * 30
  }, (err, res, body) => {
    console.log(body)
    if (res.statusCode === 200) {
      console.log('ok')
      next()
    } else {
      console.log(err)
    }
  })
}
