const socketIO = require('socket.io'),
  redisAdapter = require('socket.io-redis')

const REDIS = require('../config/constants').REDIS

module.exports = function(server) {
  let io = socketIO(server)
  io.adapter(redisAdapter({ host: REDIS.HOST, port: REDIS.PORT }))

  io.on('connection', (socket) => {
    socket.on('join', (data) => {
      data.previous && socket.leave(data.previous)
      socket.join(data.current)
      console.log(data)
    })
  })
  io.on('bleh', (msg) => {
    console.log(msg)
  })
}
