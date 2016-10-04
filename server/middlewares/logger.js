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

const logger = require('../utils/logger.js')

module.exports = source => {
  return (req, res, next) => {
    logger(
      `[${source}] <= ${req.method}: ${req.path} ${JSON.stringify(req.body)}`
    )
    next()
  }
}
