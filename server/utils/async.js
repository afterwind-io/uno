module.exports = {
  flow (g) {
    var generator = g()

    function handle (result) {
      // result => { done: [Boolean], value: [Object] }
      if (result.done) return result.value

      return Promise.resolve(result.value).then(function (res) {
        return handle(generator.next(res))
      }, function (err) {
        return handle(generator.throw(err))
      })
    }

    try {
      return handle(generator.next())
    } catch (ex) {
      return Promise.reject(ex)
    }
  }
}
