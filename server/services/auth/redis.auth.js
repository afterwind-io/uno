const flow = require('../../utils/async.js').flow

const Redis = require('ioredis')
const redis = new Redis({
  port: 6379,
  host: '127.0.0.1',
  db: 0
})

module.exports.add = (
  { uid }
) => flow(function* () {
  let _uid = uid.toString()
  yield redis.sadd('onlines', _uid)
  return _uid
})

module.exports.remove = (
  { uid }
) => flow(function* () {
  let _uid = uid.toString()
  yield redis.srem('onlines', _uid)
  return _uid
})

module.exports.check = (
  { uid }
) => flow(function* () {
  let _uid = uid.toString()
  let result = yield redis.sismember('onlines', _uid)
  return result === 1
})
