'use strict';

const Submission = require('../models/submission'),
      Contest = require('../models/contest'),
      Problem = require('../models/problem'),
      Redis = require('../../config/redis').defaultClient;

const async = require('async'),
      fs = require('fs'),
      multiparty = require('multiparty'),
      _ = require('underscore'),
      _s = require('underscore.string');

const ObjectId = require('mongoose').Types.ObjectId,
      InvalidOperation = require('../utils/exception').InvalidOperation;

const validators = require('../utils/validators'),
      ValidateSubmission = validators.submission,
      ValidateFutureContest = validators.futureContest,
      ValidateUserInContest = validators.userInContest,
      ValidateProblemInContest = validators.problemInContest;

var getSubmissionStatus = function(verdict) {
  if (verdict <= 0) return 0;
  else if (verdict == 1) return 1;
  else if (verdict > 10) return 3;
  else return 2;
}

var populateScoreboardData = function(contest, submissions, upsolving) {
  var memo = {};
  for (var i = 0; i < submissions.length; i++) {
    var sub = submissions[i];
    if ((new Date() < contest.date_end) && sub.date >= contest.frozen_time) {
      break;
    }
    if (!sub.contestant) {
      continue;
    }
    if (sub.verdict > 10) continue;
    if (sub.date >= contest.date_end && !upsolving) {
      break;
    }
    var contestant = sub.contestant.toString();
    if (!sub.problem) continue;
    var problem = sub.problem.toString();
    if (!memo[contestant]) {
      memo[contestant] = {};
      memo[contestant][problem] = {
        status: getSubmissionStatus(sub.verdict),
        errorCount: (getSubmissionStatus(sub.verdict) == 2 ? 1 : 0)
      };
      if (sub.verdict == 1) {
        memo[contestant][problem].time = Math.floor(((new Date(sub.date)) - contest.date_start) / 60000);
      }
    } else {
      memo[contestant][problem] = memo[contestant][problem] || { errorCount: 0 };
      var r = memo[contestant][problem];
      if (r.status == 1) continue;
      r.status = getSubmissionStatus(sub.verdict);
      if (r.status == 2) r.errorCount++;
      else if (r.status == 1) r.time = Math.floor((sub.date - contest.date_start) / 60000);
    }
  }
  return memo;
}

exports.getScoresAndSubmissions = function(contest, userId, userToContestant, callback) {
  Submission
  .find({
    contest: contest._id
  })
  .select('_id contestant problem date verdict language')
  .lean()
  .exec()
  .then(function(submissions) {
    try {
      submissions = _.sortBy(submissions, function(obj) {
        return obj.date;
      });
      submissions = _.map(submissions, function(obj) {
        obj.contestant = userToContestant[obj.contestant.toString()];
        return obj;
      });

      var scores = populateScoreboardData(contest, submissions, false);
      var upsolvingScores = populateScoreboardData(contest, submissions, true);

      if (!userId) {
        submissions = [];
      } else {
        var contestantId = userToContestant[userId];
        submissions = _.filter(submissions, function(obj) {
          return obj.contestant.toString() == contestantId;
        });
        submissions = _.map(submissions, function(obj) {
          if ((new Date() < contest.date_end) && obj.date >= contest.blind_time) {
            obj.verdict = 0;
          }
          obj.time = Math.floor((obj.date - contest.date_start) / 60000);
          return obj;
        });
      }
      return callback({
        scores: scores,
        upsolvingScores: upsolvingScores,
        submissions: submissions
      });
    } catch (err) {
      console.log(err);
      return callback({});
    }
  });
}

exports.getAllContestSubmissions = function(contest, userToContestant, callback) {
  Submission
  .find({
    contest: contest._id
  })
  .select('_id contestant problem date verdict')
  .lean()
  .exec()
  .then(function(submissions) {
      submissions = _.sortBy(submissions, function(obj) {
        return obj.date;
      });
      submissions = _.filter(submissions, function(obj) {
        return obj.date <= contest.date_end && obj.verdict <= 10;
      });
      submissions = _.map(submissions, function(obj) {
        obj.contestant = userToContestant[obj.contestant.toString()];
        obj.verdict = getSubmissionStatus(obj.verdict);
        obj.time = Math.floor((obj.date - contest.date_start) / 60000);
        delete obj.date;
        return obj;
      });
      return callback({submissions: submissions});
  });
}

exports.extractFile = function(req, res, next) {
  var form = new multiparty.Form();
  // TODO(stor): erase the tmp file
  async.waterfall([
    // First we parse the form to extract the file
    (callback) => {
      form.parse(req, callback);
    },
    // Then we try to get all the fields and read the code file
    (fields, files, callback) => {
      try {
        var fpath = files.file[0].path;
        req.body = {};
        req.body.contestId = fields.contestId[0];
        req.body.problem = fields.problem[0];
        req.body.language = fields.language[0];
      } catch (err) {
        return callback(err);
      }
      fs.readFile(fpath, 'utf8', callback);
    },
    // Finally, we call the normal send function
    (code, callback) => {
      req.body.code = code;
      callback();
    }
  ], (err) => {
    if (err) {
      return res.status(400).send();
    }
    return next();
  });
}

var createSubmission = function(submission, userId, callback) {
  var sub = new Submission({
    contest: submission.contestId,
    contestant: userId,
    problem: submission.problem,
    language: submission.language,
    code: submission.code,
    verdict: 0,
  });
  sub.save(callback);
}

var insertSubmissionOnRedis = function(submission, problem, callback) {
  Redis.rpush("_submissions", JSON.stringify({
    problemId: problem.id,
    problemOj: problem.oj,
    language: submission.language,
    code: submission.code,
    originalId: submission._id
  }), callback);
}

exports.send = function(req, res, next) {
  var userId = req.user._id;
  var submission = req.body;
  if (!ValidateSubmission(submission)) {
    return res.status(400).send();
  }

  var contest, problem;
  var nSubmission;
  async.waterfall([
    // First we fetch both contest and problem objects by their object ids
    (callback) => {
      async.parallel({
        contest: (subCallback) => {
          Contest.findById(submission.contestId, subCallback);
        },
        problem: (subCallback) => {
          Problem.findById(submission.problem, subCallback);
        },
      }, callback);
    },
    // Then we validate the returned objects and create the submissions
    (data, callback) => {
      contest = data.contest;
      problem = data.problem;
      // The contest must exist, must not be on the future and the user must be in it
      if (!contest || ValidateFutureContest(contest) || !ValidateUserInContest(contest, userId)) {
        return callback(InvalidOperation);
      }
      // The problem must exist and should be in the contest
      if (!problem || !ValidateProblemInContest(contest, submission.problem)) {
        return callback(InvalidOperation);
      }
      createSubmission(submission, userId, callback);
    },
    (_nSubmission, nIns, callback) => {
      nSubmission = _nSubmission;
      // Insert pending submission in redis
      insertSubmissionOnRedis(nSubmission, problem, callback);
    },
  ], (err) => {
    if (err) {
      return res.status(400).send();
    }
    return res.json({data: nSubmission});
  });
}

exports.getById = function(req, res, next) {
  Submission.findById(req.params.id, (err, submission) => {
    if (err || !submission) {
      return res.status(400).send();
    }
    return res.json({data: submission.code});
  });
}
