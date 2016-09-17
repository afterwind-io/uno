let app = require('./server.js')
let api_user = require('./apis/user.js')
let api_room = require('./apis/room.js')

app.use('/api/user', api_user)
app.use('/api/room', api_room)
