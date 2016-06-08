'use strict'

const Contest = require('../models/contest'),
  mongoose = require('mongoose'),
  _ = require('lodash')

exports.create = function (req, res, next) {
  var contest = req.body
  if (contest.startDateTime <= new Date()) {
    return res.json({
      error: 'A competição deve ocorrer no futuro (o horário do servidor é ' + new Date() + ')'
    })
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
  }).save(function (err, contest) {
    if (err) {
      return res.json({
        error: err
      })
    }
    return res.json(contest)
  })
}

var isInContest = function (id, contest) {
  var index = _.findIndex(contest.contestants, (obj) => {
    return obj.id && obj.id.toString() == id.toString()
  })
  if (index !== -1) return true
  return false
}

var filters = {
  open: {
    opts: function () {
      var now = new Date()
      return {
        date_end: {
          $gt: now
        }
      }
    },
    sort: 'date_start',
    limit: 0
  },
  past: {
    opts: function (req) {
      var last
      if (req.params.from === '0') last = new Date()
      else last = new Date(parseInt(req.params.from) || 0)
      return {
        date_end: {
          $lt: last
        }
      }
    },
    sort: '-date_end',
    limit: 20
  },
  owned: {
    opts: function (req) {
      return {
        author: req.user._id
      }
    },
    sort: 'date_start',
    limit: 0
  },
  now: {
    opts: function () {
      var now = new Date()
      return {
        date_start: {
          $lt: now
        },
        date_end: {
          $gt: now
        }
      }
    },
    sort: 'date_start',
    limit: 0
  },
  future: {
    opts: function () {
      var now = new Date()
      return {
        date_start: {
          $gt: now
        }
      }
    },
    sort: 'date_start',
    limit: 0
  },
  joined: {
    opts: function (req) {
      return {
        'contestants.id': req.user.id
      }
    },
    sort: 'date_start',
    limit: 0
  }
}

exports.getList = function (req, res) {
  var filter = filters[req.params.type || '']

  if (filter === undefined) {
    return res.status(400).send()
  }

  Contest
    .find(filter.opts(req))
    .select('-problems -contestants -password')
    .setOptions({
      sort: filter.sort,
      limit: filter.limit,
      lean: true
    })
    .exec((err, contests) => {
      if (err) return res.status(500).send()
      return res.json({
        contests: contests
      })
    })
}
