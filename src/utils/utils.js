const async = require('async'),
  fs = require('fs'),
  request = require('request')

exports.getTime = function (req, res, next) {
  return res.json({
    date: new Date()
  })
}

exports.downloadFile = function (uri, filename, callback) {
  async.series([
    async.reflect(async.apply(fs.unlink, filename)),
    async.apply(request.head, uri),
    (next) => {
      request(uri).pipe(fs.createWriteStream(filename)).on('close', next)
    }
  ], callback)
}
