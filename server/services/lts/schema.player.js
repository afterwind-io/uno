const flow = require('../../utils/async.js').flow
const idGen = require('../../utils/idGen.js')
const mongoose = require('mongoose')
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
  { username, password }
) {
  return flow(function* () {
    let player = yield model.findOne({ name: username }).exec()

    if (player !== null) {
      throw new Error('该用户已注册')
    }

    let data = yield model.create({
      _uid: idGen(),
      name: username,
      password: password
    })

    return {
      _uid: data._uid,
      name: data.name
    }
  })
}

playerSchema.statics.get = function (
  { username }
) {
  return flow(function* () {
    let player = yield model.findOne({ name: username }).exec()

    if (player === null) {
      throw new Error('该用户不存在')
    }

    return {
      _uid: player._uid,
      name: player.name
    }
  })
}

playerSchema.statics.update = function (
  { username, password }
) {
  return flow(function* () {
    let player = yield model.findOne({ name: username }).exec()

    if (player === null) {
      throw new Error('该用户不存在')
    }

    yield player.update({
      name: username,
      password: password
    }).exec()

    return {
      _uid: player._uid
    }
  })
}

let model = mongoose.model('Player', playerSchema)
module.exports = model
