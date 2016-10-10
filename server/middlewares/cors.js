module.exports = (req, res, next) => {
  // Website you wish to allow to connect
  var origin = req.headers.origin
  if (origin) {
    res.set('Access-Control-Allow-Origin', origin)
  }

  // Request methods you wish to allow
  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, WWW-Authenticate')
  // Request methods you wish to allow
  res.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.set('Access-Control-Allow-Credentials', true)

  if (req.method === 'OPTIONS') {
    res.send()
  } else {
    next()
  }
}
