'use strict';

const express = require('express'),
	passport = require('passport'),
	mongo_express = require('mongo-express/lib/middleware');

const AccountCtrl = require('./controllers/account'),
	BlogCtrl = require('./controllers/blog'),
	CatalogCtrl = require('./controllers/catalog'),
	ContestsCtrl = require('./controllers/contests'),
	ProblemsCtrl = require('./controllers/problems'),
	SingleContestCtrl = require('./controllers/single_contest'),
	SubmissionCtrl = require('./controllers/submission'),
	TagCtrl = require('./controllers/tag'),
	TeamCtrl = require('./controllers/team');

const Utils = require('./utils/utils');

const Validators = require('./utils/validators');
const IsAdmin = Validators.isAdmin,
	IsValidId = Validators.isValidId,
	IsLoggedIn = Validators.isLoggedIn,
	IsLoggedOff = Validators.isLoggedOff;

function APIRoutes() {
	let router = express.Router();

	router.param('id', IsValidId);

	// utils
	router.get('/server/time', Utils.getTime);

	// account
	router.post('/account/register', AccountCtrl.register);
	router.post('/account/edit', IsLoggedIn, AccountCtrl.edit);
	router.post('/account/login', AccountCtrl.login);
	router.get('/account/logout', IsLoggedIn, AccountCtrl.logout);

	// blog
	router.post('/blog/post', IsLoggedIn, BlogCtrl.post);
	router.post('/blog/filter', BlogCtrl.getByFilter);
	router.post('/blog/count', BlogCtrl.getCountByFilter);

	// team
	router.post('/team/create', IsLoggedIn, TeamCtrl.createNew);
	router.post('/team/leave', IsLoggedIn, TeamCtrl.leave);
	router.post('/team/invite', IsLoggedIn, TeamCtrl.invite);
	router.post('/team/remove', IsLoggedIn, TeamCtrl.remove);
	router.post('/team/edit', IsLoggedIn, TeamCtrl.edit);
	router.get('/team/accept/:id', IsLoggedIn, TeamCtrl.accept);
	router.get('/team/decline/:id', IsLoggedIn, TeamCtrl.decline);
	router.get('/team/user/:id', TeamCtrl.getByUser);
	router.get('/team/get/:id', TeamCtrl.getById);

	// contests
	router.post('/contests/get/filter/:filter', ContestsCtrl.getByFilter);
	router.post('/contests/create', IsLoggedIn, SingleContestCtrl.prevalidation, ContestsCtrl.create);
	router.post('/contest/:id/edit', IsLoggedIn, SingleContestCtrl.prevalidation, SingleContestCtrl.edit);
	router.post('/contest/:id/join', IsLoggedIn, SingleContestCtrl.join);
	router.post('/contest/:id/leave', IsLoggedIn, SingleContestCtrl.leave);
	router.get('/contest/:id/remove', IsLoggedIn, SingleContestCtrl.remove);
	router.get('/contest/:id/get/full', IsLoggedIn, SingleContestCtrl.getFullData);
	router.get('/contest/:id/scoreboard/dynamic', SingleContestCtrl.getDynamicScoreboard);
	router.get('/contest/:id/scoreboard', SingleContestCtrl.getScoreboard);

	// problems
	router.post('/problems/fetch', ProblemsCtrl.fetchProblems);
	router.get('/problems/:id', ProblemsCtrl.getProblemMetadata);

	// submissions
	router.post('/submission/send', IsLoggedIn, SubmissionCtrl.send);
	router.post('/submission/sendfile', IsLoggedIn, SubmissionCtrl.extractFile, SubmissionCtrl.send);
	router.get('/submission/:id', SubmissionCtrl.getById);

	// tags
	router.get('/tags/create/:name', IsLoggedIn, TagCtrl.createTag);
	router.get('/tags', TagCtrl.getTags);

	// catalog
	router.post('/catalog/update', IsLoggedIn, CatalogCtrl.update);
	router.post('/catalog/get', IsLoggedIn, CatalogCtrl.get);

	return router;
};

function AdminRoutes() {
	const kue = require('kue');

	let router = express.Router();

	// router.use(IsLoggedIn);
	// router.use(IsAdmin);
	router.use('/queue', kue.app);

	return router;
}

function OpenRoutes() {
	let indexFile = './public/index.html';
	if (process.env.NODE_ENV === 'development') {
		indexFile = './public/_index.html';
	}

	let router = express.Router();

	router.get('/problems/:id', ProblemsCtrl.getProblemContent);

	router.get('*', function(req, res) {
		res.sendfile(indexFile);
	});

	return router;
}

exports.configure = function(app) {
	require('./services/passport')(passport); // pass passport for configuration
	app.use(passport.initialize());
	app.use(passport.session());

	app.use('/admin', AdminRoutes());
	app.use('/admin/mongo', mongo_express(require('./config/mongo_express')));
	app.use('/api/v1/', APIRoutes());
	app.use(OpenRoutes());
}
