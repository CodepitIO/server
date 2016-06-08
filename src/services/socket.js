const socketIO = require('socket.io'),
  redisAdapter = require('socket.io-redis')

const REDIS = require('../config/constants').REDIS

module.exports = function(server) {
  let io = socketIO(server)
  io.adapter(redisAdapter({ host: REDIS.HOST, port: REDIS.PORT }))

  io.on('connection', (socket) => {
    socket.on('join', (data) => {
      data.previous && socket.leave(data.previous)
      data.current && socket.join(data.current)
    })
  })
}
