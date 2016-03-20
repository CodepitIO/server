'use strict';
const validator = require('validator'),
      constants = require('./constants').SubmissionConstants;

// Route validators
exports.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.status(403).send();
}

exports.isLoggedOff = function(req, res, next) {
  if (!req.isAuthenticated())
    return next();
  res.status(400).send();
}

exports.isValidId = function(req, res, next) {
  var id = req.params.id || req.body.id || '';
  if (validator.isMongoId(id))
    return next();
  res.status(400).send();
}

// General validators
exports.submission = (submission) => {
  var valid =
    validator.isByteLength(submission.code, constants.CODE_BYTE_LENGTH_RANGE) &&
    validator.isIn(submission.language, constants.LANGUAGES) &&
    validator.isMongoId(submission.problem) &&
    validator.isMongoId(submission.contestId);
  return valid;
}

exports.futureContest = (contest) => {
  return new Date() < new Date(contest.date_start);
}

exports.userInContest = (contest, userId) => {
  return contest.userInContest(userId);
}

exports.problemInContest = (contest, problemId) => {
  return contest.problemInContest(problemId);
}
