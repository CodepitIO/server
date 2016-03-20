var crypto = require('crypto');
var mongoose 			= require('mongoose');

var getProfilePicURL = function(email, size) {
  var hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  var url = 'https://www.gravatar.com/avatar/' + hash + '?d=identicon&s=' + (size || 50);
  return url;
}

exports.getProfilePicURL = getProfilePicURL;

exports.getProfilePicByEmailAndSize = function(req, res, next) {
  return res.json({url: getProfilePicURL(req.params.email, req.params.size)});
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
  console.log(k);
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
