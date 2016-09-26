import debug from './debug.js'

let _debugger = debug.getDebugger('mail')
let _mailbox = {}

class Mail {
  constructor (subject, title, content) {
    this._id = Math.floor(Math.random() * 1000000)
    this._v = 0
    this.subject = subject || this._id
    this.title = title || '<Unknown>'
    this.content = content || {}
    this.from = ''
    this.to = ''
  }

  /**
   * 参数类型检查
   * @param   {object}  mail  需要检测的参数
   */
  static typeCheck (mail) {
    if (mail.constructor !== Mail) {
      throw new TypeError(
        'Argument of type "Mail" expected. ' +
        'Use .createMail() to generate a new Mail.'
      )
    }
  }

  /**
   * 邮件内容输出
   */
  print () {
    _debugger.log(
        '[mail]<' + this.subject + '>"' +
        this.from + '" => "' + this.to + '": "' +
        this.title + '"', this.content)
  }
}

/**
 * 创建事件推送方法
 * @param   {Function}  callback  事件订阅的回调方法
 * @return  {Function}            将callback闭包后的事件推送方法
 */
function _emitGen (callback) {
  // 返回将callback闭包后的事件推送方法
  return function _emit (mail) {
    mail.print()

    // 将同步执行的事件推送方法统一转换为异步Promise方法,
    // 并获取该Promise对象
    let oriPromise = new Promise(function (resolve, reject) {
      callback(resolve, mail)
    })

    // 劫持初始Promise.then回调，并返回新的Promise
    return oriPromise.then(function (reply) {
      // mail数据预处理
      Mail.typeCheck(reply)

      let temp = reply.from
      reply.from = reply.to
      reply.to = temp
      reply._v ++

      reply.print()

      // 将数据交给下一个chaining then
      return reply
    })
  }
}

/**
 * 创建一个新的邮箱
 * @param   {String}    name      邮箱名称，用于接收方标识
 * @param   {Function}  callback  事件订阅的回调方法
 * @return  {Object}              邮箱对象
 */
function _mailboxGen (name, callback) {
  var m = {}
  Object.defineProperties(m, {
    owner: { value: name },
    emit: { value: _emitGen(callback) },
    send: {
      value: function (user, mail) {
        Mail.typeCheck()

        mail.from = this.owner
        mail.to = user
        mail._v ++
        return _mailbox[user].emit.call(null, mail)
      }
    },
    broadcast: {
      value: function (mail) {
        Mail.typeCheck()

        for (var i in _mailbox) {
          _mailbox[i].emit.call(null, mail)
        }
      }
    }
  })

  return m
}

// 导出邮箱服务对象
export default Object.defineProperties(
  _mailboxGen('global', undefined), {
    register: {
      value: function (name, callback) {
        if (_mailbox.hasOwnProperty(name)) {
          _debugger.error(
            '[reg]Mailbox name: "' + name + '" duplicated. Registry abort.'
          )
          return
        }

        _mailbox[name] = _mailboxGen(name, callback)
        return _mailbox[name]
      }
    },
    createMail: {
      value: function (subject, title, content) {
        return new Mail(subject, title, content)
      }
    },
    userList: {
      get: function () {
        return Object.keys(_mailbox).reduce(function (list, user) {
          list[user] = user
          return list
        }, {})
      }
    }
  })
