var mongoose = require('mongoose')
var Schema = mongoose.Schema

var playerSchema = new Schema({
  name: String,
  password: String,
  isOnline: { type: Boolean, default: false }
})

playerSchema.statics.register = function (info, callback) {
  var model = this
  var username = info.username || ''
  var password = info.password || ''

  model.findOne({ name: username }, function (err, p) {
    if (err) {
      return console.log(err)
    }
    if (p === null) {
      model.create({
        name: username,
        password: password
      }, function (err, n) {
        if (err) {
          return console.log(err)
        }

        callback({code: 0, msg: '注册成功'})
      })
    }
  })
}

playerSchema.statics.login = function (info, callback) {
  var username = info.username || ''
  var password = info.password || ''

  this.findOne({ name: username }, function (err, p) {
    if (err) {
      return console.log(err)
    }
    if (p === null) {
      return callback({code: -1, msg: '该用户不存在'})
    }
    if (p.isOnline) {
      return callback({code: -1, msg: '该用户已登录'})
    }
    if (p.password !== password) {
      return callback({code: -1, msg: '密码错误'})
    }

    p.isOnline = true
    info.session.username = username

    p.save(function (err) {
      if (err) return console.log(err)

      return callback({code: 0, msg: '登陆成功'})
    })
  })
}

playerSchema.statics.logout = function (info, callback) {
  var username = info.session.username

  this.findOne({name: username}, function (err, p) {
    if (err) {
      return console.log(err)
    }
    if (p === null) {
      return callback({code: -1, msg: '该用户不存在'})
    }
    if (!p.isOnline) {
      return callback({code: -1, msg: '该用户已登出'})
    }

    p.isOnline = false
    info.session.username = ''

    p.save(function (err) {
      if (err) return console.log(err)

      return callback({code: 0, msg: '登出成功'})
    })
  })
}

module.exports = mongoose.model('Player', playerSchema)
