let app = require('./server.js')
let api_general = require('./apis/user.js')

app.use('/api/user', api_general)
