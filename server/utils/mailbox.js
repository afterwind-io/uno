let _mailbox = {}
let _debugger = console.log.bind(null, '[Mailbox]')

/**
 * 创建事件推送方法
 * @param   {Function}  callback  事件订阅的回调方法
 * @return  {Function}            将callback闭包后的事件推送方法
 */
function _emitGen (callback) {
  // 返回将callback闭包后的事件推送方法
  return function _emit (mail) {
    // 将同步执行的事件推送方法统一转换为异步Promise方法,
    // 并获取该Promise对象
    return Promise.resolve(callback(mail))
  }
}

/**
 * 创建一个新的邮箱
 * @param   {String}    name      邮箱名称，用于接收方标识
 * @param   {Function}  callback  事件订阅的回调方法
 * @return  {Object}              邮箱对象
 */
function _mailboxGen (name, callback) {
  return Object.defineProperties({}, {
    owner: { value: name },
    emit: { value: _emitGen(callback) },
    send: { value: (user, mail) => _mailbox[user].emit(mail) },
    broadcast: {
      value: mail => {
        Object.keys(_mailbox).forEach(user => {
          _mailbox[user].emit(mail)
        })
      }
    }
  })
}

// 导出邮箱服务对象
export default Object.defineProperty(
  _mailboxGen('global', undefined), 'register', {
    value: (name, callback) => {
      if (_mailbox.hasOwnProperty(name)) {
        return _debugger(
          `Mailbox name: "${name}" duplicated. Registry abort.`
        )
      }

      _mailbox[name] = _mailboxGen(name, callback)
      return _mailbox[name]
    }
  })
