var app = require('./server.js')
var api_general = require('./apis/user.js')

app.use('/api/user', api_general)
