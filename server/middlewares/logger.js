// const winston = require('winston')
// const logger = new (winston.Logger)({
//   transports: [
//     new (winston.transports.Console)({
//       timestamp: function () {
//         return Date.now()
//       },
//       formatter: function (options) {
//         // Return string will be passed to logger.
//         return options.timestamp() + ' ' + options.level.toUpperCase() + ' ' + (undefined !== options.message ? options.message : '') +
//           (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '')
//       }
//     })
//   ]
// })

module.exports = source => {
  return (req, res, next) => {
    let time = new Date()
    console.log(
      `[${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ` +
      `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}]` +
      `[${source}] <= ${req.method}: ${req.path} ${JSON.stringify(req.body)}`
    )
    // logger.info(`${req.method}: ${req.path}`)
    next()
  }
}
