const flow = require('../../utils/async.js').flow
const idGen = require('../../utils/idGen.js')
const mongoose = require('mongoose')
const conn = mongoose.createConnection('mongodb://localhost:27017/uno')
const Schema = mongoose.Schema

const playerSchema = new Schema({
  uid: String,
  name: String,
  password: String
})

/**
 * 创建用户
 * @param   {object}    info      参数包
 * @param   {Function}  callback  回调函数
 */
playerSchema.statics.create = (
  { name, password }
) => flow(function* () {
  let player = yield model.findOne({ name }).exec()

  if (player !== null) {
    throw new Error('该用户已注册')
  }

  let data = yield new model({
    uid: idGen(),
    name,
    password
  }).save()

  // FIXME: bug with following code
  // let data = yield model.create({
  //   uid: idGen(),
  //   name,
  //   password
  // })

  return {
    uid: data.uid,
    name: data.name,
    password: data.password
  }
})

playerSchema.statics.get = (
  { name }
) => flow(function* () {
  let player = yield model.findOne({ name: name }).exec()
  if (player === null) {
    throw new Error('该用户不存在')
  }

  return {
    uid: player.uid,
    name: player.name,
    password: player.password
  }
})

playerSchema.statics.check = (
  { name }
) => flow(function* () {
  let player = yield model.findOne({ name: name }).exec()

  return player !== null
})

playerSchema.statics.update = (
  { name, password }
) => flow(function* () {
  let player = yield model.findOne({ name }).exec()

  if (player === null) {
    throw new Error('该用户不存在')
  }

  yield player.update({
    name,
    password: password
  }).exec()

  return {
    uid: player.uid
  }
})

let model = conn.model('Player', playerSchema)
module.exports = model
