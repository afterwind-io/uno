const flow = require('../../utils/async.js').flow
const idGen = require('../../utils/idGen.js')
const mongoose = require('mongoose')
const conn = mongoose.createConnection('mongodb://localhost:27017/uno')
const Schema = mongoose.Schema

const playerSchema = new Schema({
  _uid: String,
  name: String,
  password: String
})

/**
 * 创建用户
 * @param   {object}    info      参数包
 * @param   {Function}  callback  回调函数
 */
playerSchema.statics.create = function (
  { name, password }
) {
  return flow(function* () {
    let player = yield model.findOne({ name }).exec()

    if (player !== null) {
      throw new Error('该用户已注册')
    }

    let data = yield model.create({
      _uid: idGen(),
      name,
      password: password
    })

    return {
      _uid: data._uid,
      name: data.name
    }
  })
}

playerSchema.statics.get = function (
  { name }
) {
  return flow(function* () {
    // TODO: 查询出错
    let player = yield model.findOne({ name: name }).exec()
    if (player === null) {
      throw new Error('该用户不存在')
    }

    return {
      _uid: player._uid,
      password: player.password
    }
  })
}

playerSchema.statics.update = function (
  { name, password }
) {
  return flow(function* () {
    let player = yield model.findOne({ name }).exec()

    if (player === null) {
      throw new Error('该用户不存在')
    }

    yield player.update({
      name,
      password: password
    }).exec()

    return {
      _uid: player._uid
    }
  })
}

let model = conn.model('Player', playerSchema)
module.exports = model
