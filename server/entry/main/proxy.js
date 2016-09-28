const request = require('request')
const ports = require('../../config.js').ports

const req = {
  method: 'POST',
  json: true,
  timeout: 1000 * 30
}

module.exports = (service) => {
  if (!ports.hasOwnProperty(service)) {
    throw new Error(`Service ${service} not found!`)
  }

  let port = ports[service]
  return (api, data) => {
    req.uri = `http://127.0.0.1:${port}/service/${service}/${api}`
    req.body = data

    return new Promise((resolve, reject) => {
      request(req, (err, res, body) => {
        if (res.statusCode === 200) {
          if (res.body.code === -1) {
            reject(res.body)
          } else {
            resolve(body)
          }
        } else {
          reject(err)
        }
      })
    })
  }
}
