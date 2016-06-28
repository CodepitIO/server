const async = require('async'),
  _ = require('lodash')

const Contest = require('../models/contest'),
  Team = require('../models/team'),
  Submission = require('../models/submission'),
  Redis = require('../services/dbs').redisClient,
  Errors = require('../utils/errors')

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
  let startFrom = _.toInteger(req.params.from) || 0
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
        return Redis.zrangebyscore(`${id}:PENDING`, startFrom, upTo, next)
      },
      rejected: (next) => {
        return Redis.zrangebyscore(`${id}:REJECTED`, startFrom, upTo, next)
      },
      accepted: (next) => {
        return Redis.zrangebyscore(`${id}:ACCEPTED`, startFrom, upTo, next)
      },
    }, (err, results) => {
      if (err) return res.status(500).send()
      return res.json(results)
    })
  })
}

exports.join = (req, res) => {
  let id = req.body.id
  let password = req.body.password
  let teamId = req.body.team
  let userId = req.user._id
  async.auto({
    contest: (next) => {
      if (!id) return next()
      Contest.findById(id, next)
    },
    team: (next) => {
      if (!teamId) return next()
      Team.count({_id: teamId, members: userId}, next)
    },
    proc: ['contest', 'team', (results, next) => {
      let contest = results.contest,
        teamCount = results.team
      if (!contest) return res.status(400).send()
      if (contest.contestantType === 1 && teamId) return res.status(400).send()
      if (teamId && teamCount === 0) return res.status(400).send()
      if (contest.password !== password) return res.json(Errors.InvalidPassword)
      let contestant = {id: userId}
      if (teamId) contestant.team = teamId
      contest.contestants.push(contestant)
      contest.save(next)
    }]
  }, (err) => {
    if (err) return res.status(500).send()
    return res.json({})
  })
}

exports.leave = (req, res) => {
  let id = req.body.id
  let userId = req.user._id
  async.waterfall([
    (next) => {
      Submission.count({ contest: id, rep: userId }, next)
    },
    (count, next) => {
      if (count > 0) return res.status(400).send()
      Contest.findByIdAndUpdate(id, { $pull: { 'contestants': {id: userId} } }, next)
    }
  ], (err) => {
    if (err) return res.status(500).send()
    return res.json({})
  })
}
