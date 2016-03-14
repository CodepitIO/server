var Contest = require('../models/contest');
var mongoose = require('mongoose');
var _ = require('underscore');

var InvalidOperation = require('../utils/exception').InvalidOperation;

exports.create = function(req, res, next) {
  var contest = req.body;
  if (contest.startDateTime <= new Date()) {
    return res.json({error: 'A competição deve ocorrer no futuro (o horário do servidor é ' + new Date() + ')'});
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
      return res.json({error: err});
    }
    return res.json(contest);
  });
}

exports.getAllByLoggedUser = function(req, res, next) {
  Contest.find({
    author: req.user._id
  })
  .select('name description date_created date_start date_end frozen_time blind_time contestantType isPrivate watchPrivate')
  .lean()
  .exec()
  .then(function(contests) {
    return res.json({contests: contests});
  }, function(err) {
    return res.json({error: err});
  });
}

var isInContest = function(id, contest) {
  var index = _.findIndex(contest.contestants, function(obj) {
    return obj.id && obj.id.toString() == id.toString();
  });
  if (index != -1) return true;
  return false;
};

var filters = {
  open: function() {
    var now = new Date();
    return { date_end: { $gt: now } };
  },
  past: function() {
    var now = new Date();
    return { date_end: { $lte: now } };
  },
  owned: function(req) {
    return { author: req.user._id };
  },
  now: function() {
    var now = new Date();
    return {
      date_start: {$lt: now},
      date_end: { $gt: now },
    };
  },
  future: function() {
    var now = new Date();
    return { date_start: { $gt: now } };
  },
};

exports.getByFilter = function(req, res) {
  var opts = filters[req.params.filter];

  if (opts === undefined) {
    return res.json(InvalidOperation);
  }

  Contest.find(opts(req))
  .select('author name description date_created date_start date_end frozen_time blind_time contestants contestantType isPrivate watchPrivate')
  .lean()
  .exec()
  .then(function(contests) {
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
    return res.json({contests: contests});
  }, function(err) {
    return res.json({error: err});
  });
}
