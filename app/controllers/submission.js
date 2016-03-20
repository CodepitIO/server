var Submission = require('../models/submission');
var PendingSubmission = require('../models/pending_submission');
var Contest = require('../models/contest');
var Problem = require('../models/problem');
var async = require('async');

var _ = require('underscore');
var _s = require('underscore.string');
var ObjectId = require('mongoose').Types.ObjectId;

var InvalidOperation = require('../utils/exception').InvalidOperation;

var getSubmissionStatus = function(verdict) {
  if (verdict <= 0) return 0;
  else if (verdict == 1) return 1;
  else if (verdict > 8) return 3;
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
    if (sub.verdict > 8) continue;
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
        return obj.date <= contest.date_end && obj.verdict <= 8;
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

exports.send = function(req, res, next) {
  var submission = req.body;
  Contest.findById(submission.contestId).exec().then(function(contest) {
    if (new Date() < new Date(contest.date_start)) {
      return res.json({error: "Esta competição ainda não começou."});
    }
    if (!contest.inContest(req.user._id)) {
      return res.json(InvalidOperation);
    }

    try {
      var problemId = (submission.problem === '0' ? null : new ObjectId(submission.problem));
      async.waterfall([
        function(callback) {
          var sub = new Submission({
            contest: contest._id,
            contestant: req.user._id,

            problem: problemId,
            language: submission.language,
            code: submission.code,
            verdict: (problemId? 0 : 15)
          });
          sub.save(callback);
        },
        function(sub, _useless, callback) {
          if (!problemId) {
            return callback(null, sub);
          }
          Problem.findById(problemId).exec().then(
            function(problem) {
              if (!problem) {
                return res.json(InvalidOperation);
              }
              var pendingSub = new PendingSubmission({
                problemId: problem.id,
                problemOj: problem.oj,
                language: submission.language,
                code: submission.code,
                originalId: sub._id
              });
              pendingSub.save(function(err, psub) {
                return callback(null, sub);
              });
            });
        }
      ], function(err, submission) {
        if (err) return res.json({error: err});
        return res.json({submission: {
          _id: submission._id,
          contestant: submission.contestant,
          date: submission.date,
          problem: submission.problem,
          language: submission.language,
          time: Math.floor((submission.date - contest.date_start) / 60000),
          verdict: submission.verdict
        }});
      });
    } catch (err) {
      return res.json({error: err});
    }
  });
}

exports.get = function(req, res, next) {
  Submission.findById(req.params.id).exec().then(function(submission) {
    var code = submission.code;//_s.escapeHTML(submission.code);
    return res.json({code: code});
  });
}
