'use strict'

const Submission = require('../models/submission'),
  Problem = require('../models/problem'),
  SubmissionQueue = require('../services/queue').SubmissionQueue

const async = require('async'),
  fs = require('fs'),
  multiparty = require('multiparty'),
  _ = require('lodash')

exports.extractFile = function (req, res, next) {
  var form = new multiparty.Form()
  // TODO(stor): erase the tmp file
  async.waterfall([
    (callback) => {
      form.parse(req, callback)
    },
    (fields, files, callback) => {
      try {
        var fpath = files.file[0].path
        req.body = {}
        req.body.id = fields.id[0]
        req.body.problem = fields.problem[0]
        req.body.language = fields.language[0]
      } catch (err) {
        return callback(err)
      }
      fs.readFile(fpath, 'utf8', callback)
    },
    (code, callback) => {
      req.body.code = code
      callback()
    }
  ], (err) => {
    if (err) return res.status(400).send()
    return next()
  })
}

function createSubmission (submission, userId, callback) {
  var sub = new Submission({
    contest: submission.contest,
    contestant: userId,
    problem: submission.problem,
    language: submission.language,
    code: submission.code
  })
  sub.save(callback)
}

function enqueueSubmission (oj, submission, callback) {
  var job = SubmissionQueue.create(`submission:${oj}`, {
    id: submission._id
  })
  job.attempts(5)
  job.backoff({
    delay: 60 * 1000,
    type: 'exponential'
  })
  job.save(callback)
}

exports.submit = function (req, res, next) {
  req.body.contest = req.body.id
  delete req.body.id

  let submission = req.body, userId = req.user._id

  let asyncValid = Submission.validateChain(req)
    .seeLanguage()
    .seeCode()
    .seeContest(submission.problem, userId)
    .asyncOk()

  async.waterfall([
    (next) => {
      return asyncValid.then(next).catch(next)
    },
    (next) => {
      createSubmission(submission, userId, next)
    },
    (_submission, _ins, next) => {
      submission = _submission
      Problem.findById(submission.problem, next)
    },
    (problem, next) => {
      enqueueSubmission(problem.oj, submission, next)
    }
  ], (err) => {
    if (err) return res.status(400).send()
    return res.json({
      submission: submission
    })
  })
}

exports.getById = function (req, res, next) {
  Submission.findById(req.params.id)
  .populate({
    path: 'contest',
    select: 'name'
  })
  .populate({
    path: 'contestant',
    select: 'local.username'
  })
  .populate({
    path: 'problem',
    select: 'fullName'
  })
  .then((submission) => {
    if (!submission) {
      return res.status(400).send()
    }
    return res.json({
      submission: submission
    })
  })
}

exports.getUserContestSubmissions = function(req, res) {
  let contestId = req.params.id
  Submission.find({
    contest: contestId,
    contestant: req.user._id
  }, '_id date verdict language problem', (err, submissions) => {
    if (err) return res.status(400).send()
    return res.json({submissions: submissions})
  })
}

exports.getVerdictByTimestamp = function(req, res) {
  let contestId = req.params.id
  let timestamp = new Date(parseInt(req.params.timestamp))
  Submission.findOne({
    contest: contestId,
    contestant: req.user._id,
    date: timestamp
  }, '_id verdict', (err, submission) => {
    if (err || !submission) return res.status(400).send()
    return res.json({submission: submission})
  })
}
