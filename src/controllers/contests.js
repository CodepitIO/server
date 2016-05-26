'use strict';

const Contest = require('../models/contest'),
	mongoose = require('mongoose'),
	_ = require('underscore');

const InvalidOperation = require('../utils/exception').InvalidOperation;

exports.create = function(req, res, next) {
	var contest = req.body;
	if (contest.startDateTime <= new Date()) {
		return res.json({
			error: 'A competição deve ocorrer no futuro (o horário do servidor é ' + new Date() + ')'
		});
	}

	var newContest = new Contest({
		name: contest.name,
		description: contest.descr,

		author: req.user._id,

		date_start: contest.startDateTime,
		date_end: contest.endDateTime,

		frozen_time: contest.frozenDateTime,
		blind_time: contest.blindDateTime,

		problems: contest.problems,

		contestantType: contest.contestantType,
		password: contest.password,
		isPrivate: (contest.password.length > 0),
		watchPrivate: (contest.watchPrivate == 1)
	}).save(function(err, contest) {
		if (err) {
			return res.json({
				error: err
			});
		}
		return res.json(contest);
	});
}

var isInContest = function(id, contest) {
	var index = _.findIndex(contest.contestants, (obj) => {
		return obj.id && obj.id.toString() == id.toString();
	});
	if (index != -1) return true;
	return false;
};

var filters = {
	open: {
		opts: function() {
			var now = new Date();
			return {
				date_end: {
					$gt: now
				}
			};
		},
		sort: 'date_start',
		limit: 0,
	},
	past: {
		opts: function(req) {
			var last = req.body.lastQueryDate || new Date();
			return {
				date_end: {
					$lt: last
				}
			};
		},
		sort: '-date_end',
		limit: 20,
	},
	owned: {
		opts: function(req) {
			return {
				author: req.user._id
			};
		},
		sort: 'date_start',
		limit: 0,
	},
	now: {
		opts: function() {
			var now = new Date();
			return {
				date_start: {
					$lt: now
				},
				date_end: {
					$gt: now
				},
			};
		},
		sort: 'date_start',
		limit: 0,
	},
	future: {
		opts: function() {
			var now = new Date();
			return {
				date_start: {
					$gt: now
				}
			};
		},
		sort: 'date_start',
		limit: 0,
	},
	joined: {
		opts: function(req) {
			return {
				'contestants.id': req.user.id
			};
		},
		sort: 'date_start',
		limit: 0,
	},
};

exports.getByFilter = function(req, res) {
	var filter = filters[req.body.filter];

	if (filter === undefined) {
		return res.status(400).send();
	}

	Contest
		.find(filter.opts(req))
		.select('-problems -contestants -password')
		.setOptions({
			sort: filter.sort,
			limit: filter.limit,
			lean: true,
		})
		.exec(function(err, contests) {
			if (err) {
				return res.json({
					error: err
				});
			}
			_.map(contests, function(contest) {
				contest.isInContest = false;
				contest.isAdmin = false;
				if (req.user && req.user._id) {
					contest.isInContest = isInContest(req.user._id, contest);
					if (contest.author) {
						contest.isAdmin = req.user._id.toString() == contest.author.toString();
					}
				}
				return contest;
			});
			return res.json({
				contests: contests
			});
		});
}
