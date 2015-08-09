var net = require('net');
var server = require('../../config/server');
var parseString = require('xml2js').parseString;

var lastResultTime = 0;
var lastResult = null;
var consecutiveNulls = 0;

exports.get = function(cb) {
  if ((Date.now() - lastResultTime)/1000 <= server.updateStatusThreshold) {
    return cb(lastResult);
  }
  if (consecutiveNulls >= 2) {
    lastResult = null;
    lastResultTime = Date.now();
    consecutiveNulls = 0;
    return cb(null);
  }
  var message = new Buffer(String.fromCharCode(6,0,0,0) + "info");
  message[2] = 255;
  message[3] = 255;

  var client = new net.Socket();
  client.setTimeout(2000);

  client
    .connect(server.port, server.host)
    .on('data', function(data) {
      var xml = data.toString();
      parseString(xml, function(err, result) {
        client.destroy();
        if (result) {
          lastResultTime = Date.now();
          lastResult = result;
          consecutiveNulls = 0;
        }
        return cb(result);
      });
    })
    .on('timeout', function() {
      client.destroy();
      consecutiveNulls++;
      return cb(lastResult);
    })
    .on('error', function(e) {
      client.destroy();
      consecutiveNulls++;
      return cb(lastResult);
    })
    .on('end', function() {
      client.destroy();
      consecutiveNulls++;
      return cb(lastResult);
    });

  client.write(message);
}
