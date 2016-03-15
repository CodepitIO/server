//var recaptchaKeys 	 = require('../config/recaptcha');
//var Recaptcha = require('recaptcha').Recaptcha;
//var blog 			= require('../config/tumblr');

var UserCtrl = require('./controllers/user');
var TeamCtrl = require('./controllers/team');
var ContestsCtrl = require('./controllers/contests');
var SingleContestCtrl = require('./controllers/single_contest');
var ProblemsCtrl = require('./controllers/problems');
var SubmissionCtrl = require('./controllers/submission');
var TagCtrl = require('./controllers/tag');
var CatalogCtrl = require('./controllers/catalog');

var Util = require('./utils/functions');

var indexFile = './public/index.html';

module.exports = function(app, passport) {

  if (app.get('env') === 'development') {
    indexFile = './public/_index.html';
  }

  // account
  app.post('/api/account/register', isLoggedOff, function(req, res) {
    passport.authenticate('local-signup', function(err, user) {
      req.logIn(user, function(err) {
        if (err) return res.json({error: err});
        return res.json(req.user);
      });
    })(req, res, function(err) {
      res.json(err);
    });
  });

  app.post('/api/account/edit', isLoggedIn, UserCtrl.edit);

  // util
  app.get('/api/picture/:email/:size', Util.getProfilePicByEmailAndSize);
  app.get('/api/server/time', Util.getTime);

  // problems
  app.post('/api/problems/fetch', ProblemsCtrl.fetchProblems);

  // team
  app.post('/api/team/create', isLoggedIn, TeamCtrl.createNew);
  app.get('/api/team/user/:id', TeamCtrl.getFromUser);
  app.get('/api/team/user', TeamCtrl.getFromUser);
  app.post('/api/team/leave', isLoggedIn, TeamCtrl.leave);
  app.get('/api/team/get/:id', TeamCtrl.getById);
  app.post('/api/team/invite', isLoggedIn, TeamCtrl.invite);
  app.post('/api/team/remove', isLoggedIn, TeamCtrl.remove);
  app.get('/api/team/accept/:id', isLoggedIn, TeamCtrl.accept);
  app.get('/api/team/decline/:id', isLoggedIn, TeamCtrl.decline);
  app.post('/api/team/edit', isLoggedIn, TeamCtrl.edit);

  // contests
  app.post('/api/contests/create', isLoggedIn, SingleContestCtrl.prevalidation, ContestsCtrl.create);
  app.get('/api/contests/get/owner', isLoggedIn, ContestsCtrl.getAllByLoggedUser);
  app.get('/api/contests/get/filter/:filter', ContestsCtrl.getByFilter);

  // specific contest
  app.post('/api/contest/:id/edit', isLoggedIn, SingleContestCtrl.prevalidation, SingleContestCtrl.edit);
  app.get('/api/contest/:id/remove', isLoggedIn, SingleContestCtrl.remove);
  app.get('/api/contest/:id/get/full', isLoggedIn, SingleContestCtrl.getFullData);
  app.post('/api/contest/:id/join', isLoggedIn, SingleContestCtrl.join);
  app.post('/api/contest/:id/leave', isLoggedIn, SingleContestCtrl.leave);
  app.get('/api/contest/:id/scoreboard/dynamic', SingleContestCtrl.getDynamicScoreboard);
  app.get('/api/contest/:id/scoreboard', SingleContestCtrl.getScoreboard);

  // submissions
  app.post('/api/submission/send', isLoggedIn, SubmissionCtrl.send);
  app.get('/api/submission/get/:id', SubmissionCtrl.get);

  // tags
  app.get('/api/tags', TagCtrl.getTags);
  app.get('/api/tags/create/:name', isLoggedIn, TagCtrl.createTag);

  // catalog
  app.post('/api/catalog/update', isLoggedIn, CatalogCtrl.update);
  app.post('/api/catalog/get', isLoggedIn, CatalogCtrl.get);

  // authentication
  app.post('/api/login', function(req, res) {
    if (req.isAuthenticated()) {
  		req.logout();
    }
    passport.authenticate('local-login', function(err, user) {
      if (err) return res.json(err);
      if (!user) return res.json({error: 'E-mail ou senha inválidos.'});
      req.logIn(user, function(err) {
        if (err) return res.json({error: err});
        return res.json(req.user);
      });
    })(req, res, function(err) {
      res.json(err);
    });
  });

  app.get('/api/logout', isLoggedIn, function(req, res) {
    req.logout();
    return res.json({});
  });

  app.get('/api/check_login', function(req, res) {
    res.json(req.user || null);
  });

	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile(indexFile);
	});

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.sendfile(indexFile);
}

// route middleware to make sure a user is logged off
function isLoggedOff(req, res, next) {
  if (!req.isAuthenticated())
    return next();

  res.sendfile(indexFile);
}
