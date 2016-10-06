const main = require('./server/entry/main/index.js')
const ws = require('./server/entry/websocket/index.js')
const dist = require('./server/entry/public/index.js')

const serviceLTS = require('./server/services/lts/index.js')
const serviceAuth = require('./server/services/auth/index.js')
const servicePlayer = require('./server/services/player/index.js')
const serviceRoom = require('./server/services/room/index.js')

const gameUno = require('./server/entry/uno/index.js')

serviceLTS.start()
serviceAuth.start()
servicePlayer.start()
serviceRoom.start()

main.start()
ws.start()
dist.start()

gameUno.start()
