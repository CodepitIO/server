module.exports = function(server) {
  let io = require('socket.io')(server)
  io.on('connection', (socket) => {
    socket.on('join', (data) => {
      data.previous && socket.leave(data.previous)
      socket.join(data.current)
      console.log(data)
    })
  })
}
