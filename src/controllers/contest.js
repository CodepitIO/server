const async = require('async'),
  _ = require('lodash')

const Contest = require('../models/contest'),
  Team = require('../models/team'),
  Submission = require('../models/submission'),
  Redis = require('../services/dbs').redisClient,
  Errors = require('../utils/errors'),
  Utils = require('../utils/utils')

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
    select: '_id name oj id fullName timelimit memorylimit'
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
      inContest: contest.userInContest(userId),
      isContestAdmin: Utils.cmpToString(req.user && req.user._id)(contest.author)
    }

    let canViewContestants = obj.canViewContest
    let canViewProblems = new Date(contest.date_start) <= new Date() && canViewContestants

    let isAdmin = req.user && req.user.isAdmin
    if (isAdmin || canViewContestants) obj.contestants = contest.contestants
    if (isAdmin || canViewProblems) obj.problems = contest.problems
    if (obj.isContestAdmin) obj.password = contest.password

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

exports.validateContest = (req, res, next) => {
  let c = {}, data = req.body
  async.waterfall([
    (next) => {
      // <<-- Validate descr -->>
      c.name = _.toString(data.name)
      if (!_.inRange(c.name.length, 1, 50)) return res.status(400).send()
      if (!req.params.id) return next(null, null)
      Contest.findById(req.params.id, next)
    },
    (contest, next) => {
      // <<-- Validate dates -->>
      let now = new Date().getTime()
      if (contest && contest.date_end < now - 24 * 60 * 60 * 1000) return res.status(400).send()
      try {
        c.date_start = new Date(data.date_start)
        c.date_end = new Date(data.date_end)
        if (data.hasFrozen) c.frozen_time = new Date(data.frozen_time)
        else c.frozen_time = c.date_end
        if (data.hasBlind) c.blind_time = new Date(data.blind_time)
        else c.blind_time = c.date_end

        let timeArr = []
        if (_.some(timeArr, _.isNaN)) return res.status(400).send()
        for (let i = 0; i < 3; i++) {
          if (timeArr[i] > timeArr[i+1]) return res.status(400).send()
        }

        let sixMonthsFromNow = now
        sixMonthsFromNow.setMonth(now.getMonth() + 6)
        if (c.date_end > sixMonthsFromNow) return res.status(400).send()
        if (contest) {
          if (c.date_start < contest.date_start) return res.status(400).send()
        } else {
          if (c.date_start < now - 60 * 60 * 1000) return res.status(400).send()
        }
        return next()
      } catch (err) {
        return res.status(400).send()
      }
    },
    (next) => {
      // <<-- Validate options -->>
      c.isPrivate = !!data.isPrivate
      c.password = _.toString(data.password)
      if (c.isPrivate && !_.inRange(c.password.length, 1, 100)) {
        return res.status(400).send()
      }
      c.watchPrivate = !!data.watchPrivate
      if (data.allowIndividual && data.allowTeam) c.contestantType = 3
      else if (data.allowIndividual) c.contestantType = 1
      else if (data.allowTeam) c.contestantType = 2
      else return res.status(400).send()
      return next()
    },
    (next) => {
      // <<-- Validate problems -->>
      return next()
    }
  ], (err) => {
    if (err) return res.status(500).send()
    req.body = c
    return next()
  })
}

exports.edit = (req, res) => {
  let id = req.params.id

}
