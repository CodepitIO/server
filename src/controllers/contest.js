const async = require('async'),
  _ = require('lodash')

const ProblemsCtrl = require('./problems'),
  Contest = require('../models/contest'),
  Redis = require('../services/dbs').redisClient

function canViewContest(contest, user) {
  return !contest.watchPrivate || (user && (user.isAdmin || contest.userInContest(user._id) ||
                                         user._id.toString() === contest.author.toString()));
}

exports.getMetadata = (req, res) => {
  let id = req.params.id
  Contest.findById(id).populate({
    path: 'contestants.team',
    select: '_id name'
  }).populate({
    path: 'contestants.id',
    select: '_id local.username'
  }).populate({
    path: 'problems',
    select: '_id name'
  }).then((contest) => {
    if (!contest) {
      return res.status(400).send()
    }

    let userId = req.user && req.user._id
    let obj = {
      name: contest.name,
      date_start: contest.date_start,
      date_end: contest.date_end,
      frozen_time: contest.frozen_time,
      blind_time: contest.blind_time,
      isPrivate: contest.isPrivate,
      watchPrivate: contest.watchPrivate,
      contestantType: contest.contestantType,
      problems: [],

      canViewContest: canViewContest(contest, req.user),
      inContest: contest.userInContest(userId)
    }

    let canViewContestants = obj.canViewContest
    let canViewProblems = new Date(contest.date_start) <= new Date() && canViewContestants

    let isAdmin = req.user && req.user.isAdmin
    if (isAdmin || canViewContestants) obj.contestants = contest.contestants
    if (isAdmin || canViewProblems) obj.problems = contest.problems

    return res.json(obj)
  })
}

exports.getEvents = (req, res) => {
  let id = req.params.id
  Contest.findById(id).then((contest) => {
    if (!contest || !canViewContest(contest, req.user)) {
      return res.status(400).send()
    }

    let isAdmin = req.user && req.user.isAdmin
    let upTo = new Date().getTime()
    if (!isAdmin && upTo >= contest.frozen_time && upTo < contest.date_end) {
      upTo = contest.frozen_time;
    }

    async.parallel({
      pending: (next) => {
        return Redis.zrangebyscore(`${id}:PENDING`, 0, upTo, next)
      },
      rejected: (next) => {
        return Redis.zrangebyscore(`${id}:REJECTED`, 0, upTo, next)
      },
      accepted: (next) => {
        return Redis.zrangebyscore(`${id}:ACCEPTED`, 0, upTo, next)
      },
    }, (err, results) => {
      if (err) return res.status(500).send()
      return res.json(results)
    })
  })
}
