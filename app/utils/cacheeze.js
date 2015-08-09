var sha1           = require('sha1');
var cache = {};

exports.getCache = function() {
  var s = "";
  for (var i = 0; i < arguments.length; i++) {
    s += arguments[i];
  }
  s = sha1(s);
  if (cache.hasOwnProperty(s) && cache[s].expires > Date.now()) {
    return cache[s].data;
  } else {
    return false;
  }
}

exports.putCache = function(data, expires) {
  var s = "";
  for (var i = 2; i < arguments.length; i++) {
    s += arguments[i];
  }
  s = sha1(s);
  cache[s] = {
    data: data,
    expires: Date.now() + expires
  }
}
