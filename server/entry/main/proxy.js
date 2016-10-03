const request = require('superagent')
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
    let uri = `http://127.0.0.1:${port}/service/${service}/${api}`

    return request.post(uri)
      .set({
        'Content-Type': 'application/json'
      })
      .withCredentials()
      .timeout(1000 * 30)
      .send(data)
      .then(({ body }) => {
        if (body.code === -1) return Promise.reject(body)

        return Promise.resolve(body)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }
}
