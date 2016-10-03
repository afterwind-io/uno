// const server = 'http://localhost'
const server = 'http://192.168.1.4'

export var apiServerUrl = server + ':4000'

export var wsServerUrl = server + ':4001'

export var apis = [
  { name: 'login', method: 'post', uri: '/api/user/login' },
  { name: 'logout', method: 'post', uri: '/api/user/logout' },
  { name: 'register', method: 'post', uri: '/api/user/register' },
  { name: 'getOnlinePlayers', method: 'post', uri: '/api/user/getOnlinePlayers' },
  { name: 'getRooms', method: 'post', uri: '/api/room/getRooms' },
  { name: 'createRoom', method: 'post', uri: '/api/room/create' },
  { name: 'joinRoom', method: 'post', uri: '/api/room/join' },
  { name: 'leaveRoom', method: 'post', uri: '/api/room/leave' }
]

export var debugMode = true
