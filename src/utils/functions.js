const async     = require('async'),
      crypto    = require('crypto'),
      fs        = require('fs'),
      mongoose  = require('mongoose'),
      request   = require('request');

exports.getTime = function(req, res, next) {
  return res.json({date: new Date()});
}

exports.validateDate = function (datestr) {
  if (typeof datestr !== "string")
    return false;

  var r = datestr.match(/^\s*([0-9]+)\s*\/\s*([0-9]+)\s*\/\s*([0-9]+)(.*)$/);
  date = new Date(r[2]+"-"+r[1]+"-"+r[3]+r[4]);
  if (isNaN(date.getTime()))
    return false;
  return date;
}

exports.inArray = function (k, a, callback) {
  var self = a;
  return (function check(i) {
      if (i >= self.length) {
          return callback(false);
      }
      if (self[i].toString() === k.toString()) {
          return callback(true);
      }

      return process.nextTick(check.bind(null, i+1));
  }(0));
}

exports.getObjectId = function (str) {
  return mongoose.Types.ObjectId(str);
}

exports.downloadFile = function (uri, filename, callback) {
  async.series([
    async.reflect(async.apply(fs.unlink, filename)),
    async.apply(request.head, uri),
    (next) => {
      request(uri).pipe(fs.createWriteStream(filename)).on('close', next);
    }
  ], callback);
};
