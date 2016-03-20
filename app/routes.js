'use strict';

const UserCtrl = require('./controllers/user'),
      TeamCtrl = require('./controllers/team'),
      ContestsCtrl = require('./controllers/contests'),
      SingleContestCtrl = require('./controllers/single_contest'),
      ProblemsCtrl = require('./controllers/problems'),
      SubmissionCtrl = require('./controllers/submission'),
      TagCtrl = require('./controllers/tag'),
      CatalogCtrl = require('./controllers/catalog');

const Util = require('./utils/functions');

const validators = require('./utils/validators'),
      IsValidId = validators.isValidId,
      IsLoggedIn = validators.isLoggedIn,
      IsLoggedOff = validators.isLoggedOff;

module.exports = function(app, passport) {
  var indexFile = './public/index.html';
  if (app.get('env') === 'development') {
    indexFile = './public/_index.html';
  }

  // account
  app.post('/api/account/register', IsLoggedOff, function(req, res) {
    passport.authenticate('local-signup', function(err, user) {
      req.logIn(user, function(err) {
        if (err) return res.json({error: err});
        return res.json(req.user);
      });
    })(req, res, function(err) {
      res.json(err);
    });
  });

  app.post('/api/account/edit', IsLoggedIn, UserCtrl.edit);

  // util
  app.get('/api/picture/:email/:size', Util.getProfilePicByEmailAndSize);
  app.get('/api/server/time', Util.getTime);

  // problems
  app.post('/api/problems/fetch', ProblemsCtrl.fetchProblems);

  // team
  app.post('/api/team/create', IsLoggedIn, TeamCtrl.createNew);
  app.get('/api/team/user/:id', IsValidId, TeamCtrl.getFromUser);
  app.get('/api/team/user', TeamCtrl.getFromUser);
  app.post('/api/team/leave', IsLoggedIn, TeamCtrl.leave);
  app.get('/api/team/get/:id', IsValidId, TeamCtrl.getById);
  app.post('/api/team/invite', IsLoggedIn, TeamCtrl.invite);
  app.post('/api/team/remove', IsLoggedIn, TeamCtrl.remove);
  app.get('/api/team/accept/:id', IsLoggedIn, IsValidId, TeamCtrl.accept);
  app.get('/api/team/decline/:id', IsLoggedIn, IsValidId, TeamCtrl.decline);
  app.post('/api/team/edit', IsLoggedIn, TeamCtrl.edit);

  // contests
  app.post('/api/contests/create', IsLoggedIn, SingleContestCtrl.prevalidation, ContestsCtrl.create);
  app.get('/api/contests/get/owner', IsLoggedIn, ContestsCtrl.getAllByLoggedUser);
  app.get('/api/contests/get/filter/:filter', ContestsCtrl.getByFilter);

  // specific contest
  app.post('/api/contest/:id/edit', IsLoggedIn, IsValidId, SingleContestCtrl.prevalidation, SingleContestCtrl.edit);
  app.get('/api/contest/:id/remove', IsLoggedIn, IsValidId, SingleContestCtrl.remove);
  app.get('/api/contest/:id/get/full', IsLoggedIn, IsValidId, SingleContestCtrl.getFullData);
  app.post('/api/contest/:id/join', IsLoggedIn, IsValidId, SingleContestCtrl.join);
  app.post('/api/contest/:id/leave', IsLoggedIn, IsValidId, SingleContestCtrl.leave);
  app.get('/api/contest/:id/scoreboard/dynamic', IsValidId, SingleContestCtrl.getDynamicScoreboard);
  app.get('/api/contest/:id/scoreboard', IsValidId, SingleContestCtrl.getScoreboard);

  // submissions
  app.post('/api/submission/send', IsLoggedIn, SubmissionCtrl.send);
  app.post('/api/submission/sendfile', IsLoggedIn, SubmissionCtrl.extractFile, SubmissionCtrl.send);
  app.get('/api/submission/getById/:id', IsValidId, SubmissionCtrl.getById);

  // tags
  app.get('/api/tags', TagCtrl.getTags);
  app.get('/api/tags/create/:name', IsLoggedIn, TagCtrl.createTag);

  // catalog
  app.post('/api/catalog/update', IsLoggedIn, CatalogCtrl.update);
  app.post('/api/catalog/get', IsLoggedIn, CatalogCtrl.get);

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

  app.get('/api/logout', IsLoggedIn, function(req, res) {
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
