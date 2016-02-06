module.exports = function(server) {
  const io             = require('socket.io')(server),
        socketRedis    = require('socket.io-redis');
  io.adapter(socketRedis({ host: 'localhost', port: 6379 }));

  io.on('connection', function (socket) {
    socket.on('message', function(msg) {
      console.log(msg);
      socket.emit('message', 'oi');
    });
    socket.on('disconnect', function(){
      // disconnection
    });
  });
}
