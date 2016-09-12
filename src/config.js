const server = 'http://localhost'

export var apiServer = server + ':3000'

export var wsServer = server + ':3001'

export var apis = [
  { name: 'login', method: 'post', uri: '/api/user/login' },
  { name: 'logout', method: 'post', uri: '/api/user/logout' },
  { name: 'register', method: 'post', uri: '/api/user/register' },
  { name: 'getOnlinePlayers', method: 'post', uri: '/api/user/getOnlinePlayers' }
]

export var debugMode = true
