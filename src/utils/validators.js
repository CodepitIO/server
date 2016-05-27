'use strict'

const validator = require('validator'),
  constants = require('../config/constants')

// Route validators
exports.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated())
    return next()
  return res.status(400).send()
}

exports.isAdmin = function (req, res, next) {
  console.log('oie!!!')
  return next(new Error('lalala'))
/*if (req.isAuthenticated())
	return next()
return next(new Error('aff'));*/
}

exports.isLoggedOff = function (req, res, next) {
  if (!req.isAuthenticated())
    return next()
  res.status(400).send()
}

exports.isValidId = function (req, res, next) {
  req.check('id').isMongoId()
  if (req.validationErrors()) return res.status(400).send()
  return next()
}

// General validators
exports.submission = (submission) => {
  var valid =
  validator.isByteLength(submission.code, constants.CODE_BYTE_LENGTH_RANGE) &&
  validator.isIn(submission.language, constants.LANGUAGES) &&
  validator.isMongoId(submission.problem) &&
  validator.isMongoId(submission.contestId)
  return valid
}

exports.futureContest = (contest) => {
  return new Date() < new Date(contest.date_start)
}

exports.userInContest = (contest, userId) => {
  return contest.userInContest(userId)
}

exports.problemInContest = (contest, problemId) => {
  return contest.problemInContest(problemId)
}

exports.express = {
  customValidators: {

  }
}

exports.models = {
  user: {
    'name': {
      notEmpty: true,
      isLength: {
        options: [{
          min: 1,
          max: 50
        }]
      }
    },
    'surname': {
      notEmpty: true,
      isLength: {
        options: [{
          min: 1,
          max: 50
        }]
      }
    },
    'email': {
      notEmpty: true,
      isLength: {
        options: [{
          min: 1,
          max: 50
        }]
      },
      isEmail: {
        errorMessage: 'Invalid Email'
      }
    }
  }
}
