let flow = require('../utils/async.js').flow

let mongoose = require('mongoose')
let Schema = mongoose.Schema
const playerStatus = {
  offline: -1,
  online: 0
}

function idGen () {
  return Array(8).fill(0).reduce((s, c) => {
    let r = Math.floor(Math.random() * 36)
    r += r < 10 ? 48 : 87
    return s + String.fromCharCode(r)
  }, '')
}

let playerSchema = new Schema({
  _uid: String,
  name: String,
  password: String,
  status: { type: Number, default: -1 }
})

/**
 * 注册
 * @param   {object}    info      参数包
 * @param   {Function}  callback  回调函数
 */
playerSchema.statics.register = function (
  { username, password, session }
) {
  return flow(function* () {
    let player = yield model.findOne({ name: username }).exec()

    if (player !== null) {
      throw new Error('该用户已注册')
    }

    let data = yield model.create({
      _uid: idGen(),
      name: username,
      password: password,
      status: playerStatus.online,
      roomId: 0
    })

    session.username = username

    return {
      _uid: data._uid,
      name: data.name,
      status: data.status
    }
  })
}

/**
 * 登陆
 * @param   {object}    info      参数包
 */
playerSchema.statics.login = function (
  { username, password, session }
) {
  return flow(function* () {
    let player = yield model.findOne({ name: username }).exec()

    if (player === null) {
      throw new Error('该用户不存在')
    }
    if (player.password !== password) {
      throw new Error('密码错误')
    }

    player.status = playerStatus.online
    let data = yield player.save()

    session.username = username

    return {
      _uid: data._uid,
      name: data.name,
      status: data.status
    }
  })
}

/**
 * 登出
 * @param   {object}    info      参数包
 */
playerSchema.statics.logout = function ({ session }) {
  return flow(function* () {
    let username = session.username
    let player = yield model.findOne({ name: username }).exec()

    if (player === null) {
      throw new Error('该用户不存在')
    }
    if (player.status === playerStatus.offline) {
      throw new Error('该用户已登出')
    }

    player.status = playerStatus.offline

    yield player.update({ status: playerStatus.offline }).exec()
    return player._uid
  })
}

/**
 * 获取服务器当前所有在线玩家
 */
playerSchema.statics.getOnlinePlayers = function () {
  return flow(function* () {
    let players = yield model.find({ status: playerStatus.online }).exec()
    return players.map(p => {
      return {
        name: p.name,
        status: p.status
      }
    })
  })
}

let model = mongoose.model('Player', playerSchema)
module.exports = model
