'use strict'

const async = require('async'),
  fs = require('fs'),
  path = require('path'),
  pindexer = require('pindexer'),
  _ = require('lodash')

const Problem = require('../models/problem')

function IndexProblems (callback) {
  async.waterfall([
    (next) => {
      Problem.find({}, next)
    },
    (problems, next) => {
      async.eachSeries(problems, (item, callback) => {
        if (item.id && item.url && item.fullName && item.fullName.substring(0, 1) === '[') {
          pindexer.addProblem(item)
        }
        return async.setImmediate(callback)
      }, next)
    }
  ], () => {
    console.log('Finished adding problems to index.')
    callback && callback()
  })
}
IndexProblems()

exports.fetchProblems = (req, res) => {
  let substr = req.body.text
  let insertedProblems = req.body.problems || []
  if (!_.isString(substr) || !_.isArray(insertedProblems)) return res.status(400).send()
  if (substr.length < 3 || substr.length > 50 || insertedProblems.length > 26) return res.status(400).send()
  return res.json({
    list: pindexer.match(substr, insertedProblems)
  })
}

exports.getProblemMetadata = (req, res) => {
  let id = req.params.id
  Problem.findById(id).select('name oj id url originalUrl source timelimit memorylimit inputFile outputFile imported isPdf')
    .exec((err, problem) => {
      if (err) return res.status(500).send()
      if (!problem) return res.status(404).send()
      return res.json(problem)
    })
}
