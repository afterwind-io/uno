let mongoose = require('mongoose')
let Schema = mongoose.Schema
const playerStatus = {
  offline: -1,
  idle: 0,
  busy: 1
}

let playerSchema = new Schema({
  name: String,
  password: String,
  status: { type: Number, default: -1 }
})

/**
 * 注册
 * @param   {object}    info      参数包
 * @param   {Function}  callback  回调函数
 */
playerSchema.statics.register = function (info, callback) {
  let model = this
  let username = info.username || ''
  let password = info.password || ''

  model.findOne({ name: username }, function (err, p) {
    if (err) {
      return console.log(err)
    }
    if (p === null) {
      model.create({
        name: username,
        password: password,
        status: playerStatus.idle
      }, function (err, n) {
        if (err) {
          return console.log(err)
        }

        callback({code: 0, msg: '注册成功'})
      })
    } else {
      callback({code: -1, msg: '该用户已注册'})
    }
  })
}

/**
 * 登陆
 * @param   {object}    info      参数包
 * @param   {Function}  callback  回调函数
 */
playerSchema.statics.login = function (info, callback) {
  let username = info.username || ''
  let password = info.password || ''

  this.findOne({ name: username }, function (err, p) {
    if (err) {
      return console.log(err)
    }
    if (p === null) {
      return callback({code: -1, msg: '该用户不存在'})
    }
    // if (p.status !== playerStatus.offline) {
    //   return callback({code: -1, msg: '该用户已登录'})
    // }
    if (p.password !== password) {
      return callback({code: -1, msg: '密码错误'})
    }

    p.status = playerStatus.idle
    info.session.username = username

    p.save(function (err) {
      if (err) return console.log(err)

      return callback({code: 0, msg: '登陆成功'})
    })
  })
}

/**
 * 登出
 * @param   {object}    info      参数包
 * @param   {Function}  callback  回调函数
 */
playerSchema.statics.logout = function (info, callback) {
  let username = info.session.username

  this.findOne({name: username}, function (err, p) {
    if (err) {
      return console.log(err)
    }
    if (p === null) {
      return callback({code: -1, msg: '该用户不存在'})
    }
    if (p.status === playerStatus.offline) {
      return callback({code: -1, msg: '该用户已登出'})
    }

    p.status = playerStatus.offline
    info.session.username = ''

    p.save(function (err) {
      if (err) return console.log(err)

      return callback({code: 0, msg: '登出成功'})
    })
  })
}

module.exports = mongoose.model('Player', playerSchema)
