'use strict'

const async = require('async'),
  pindexer = require('pindexer')

const Problem = require('../models/problem'),
  Dbs = require('./dbs'),
  Queue = require('./queue')

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

module.exports = function (callback) {
  IndexProblems(callback)
}
