module.exports = {
  flow (g) {
    const generator = g()

    function handle (result) {
      // result => { done: [Boolean], value: [Object] }
      if (result.done) return result.value

      return Promise.resolve(result.value).then(
        res => handle(generator.next(res)),
        err => handle(generator.throw(err))
      )
    }

    try {
      return handle(generator.next())
    } catch (ex) {
      return Promise.reject(ex)
    }
  }
}
