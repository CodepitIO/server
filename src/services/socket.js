const socketIO = require('socket.io'),
  redisAdapter = require('socket.io-redis')

const REDIS = require('../config/constants').REDIS

module.exports = function(server) {
  var count = 0
  let io = socketIO(server)
  io.adapter(redisAdapter({ host: REDIS.HOST, port: REDIS.PORT }))

  io.on('connection', (socket) => {
    count++
    console.log(`connect, total users is ${count}`)
    socket.on('join', (data) => {
      data.previous && socket.leave(data.previous)
      data.current && socket.join(data.current)
    })

    socket.on('disconnect', () => {
      count--
      console.log(`disconnect, total users is ${count}`);
    })
  })
}
