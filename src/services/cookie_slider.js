'use strict';

module.exports.middleware = function(age) {
  var cookieAge = age || (24 * 60 * 60 * 1000);
  return function(req, res, next) {
    var session = req.cookies['session'],
      sessionSig = req.cookies['session.sig'];
    if(session && sessionSig) {
      res.cookie('session', session, { maxAge: cookieAge });
      res.cookie('session.sig', sessionSig, { maxAge: cookieAge });
    }
    if(next)
      next();
  };
};
