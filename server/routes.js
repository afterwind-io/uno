let app = require('./server.js')
let api_user = require('./apis/user.js')
let api_server = require('./apis/server.js')

app.use('/api/user', api_user)
app.use('/api/server', api_server)
