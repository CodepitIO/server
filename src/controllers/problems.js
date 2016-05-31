'use strict'

const async = require('async'),
  fs = require('fs'),
  path = require('path'),
  pindexer = require('pindexer'),
  _ = require('lodash')

const ImportQueue = require('../services/queue').ImportQueue,
  Problem = require('../models/problem')

const PROBLEMS_PATH = path.join(__dirname, '..', '..', 'public', 'problems')

fs.stat(PROBLEMS_PATH, (err) => {
  if (err) fs.mkdir(PROBLEMS_PATH)
})

exports.fetchProblems = (req, res, next) => {
  let substr = req.body.text
  let insertedProblems = req.body.problems || []
  if (!_.isString(substr) || !_.isArray(insertedProblems)) return res.status(400).send()
  if (substr.length < 3 || substr.length > 30 || insertedProblems.length > 26) return res.status(400).send()
  insertedProblems = _.chain(insertedProblems)
    .filter((obj) => {
      if (!obj.id) return false
      return _.isString(obj.id) && obj.id.length < 50
    })
    .map(insertedProblems, (obj) => {
      return obj.id
    })
    .value()
  return res.json({
    list: pindexer.match(substr, insertedProblems)
  })
}

exports.getProblemMetadata = (req, res, next) => {
  let id = req.params.id
  Problem.findById(id).select('name oj id url originalUrl source timelimit memorylimit inputFile outputFile imported isPdf')
    .exec((err, problem) => {
      if (err || !problem) return res.status(404).send()
      return res.json(problem)
    })
}

exports.getProblemContent = (req, res, next) => {
  let ext = path.extname(req.params.id)
  if (ext !== '.html') return res.status(404).send()
  let problemPath = path.join(PROBLEMS_PATH, req.params.id)
  ImportQueue.push(problemPath, (err) => {
    if (err) return res.sendfile('./public/views/problems/not-imported.html')
    return res.sendfile(problemPath)
  })
}
