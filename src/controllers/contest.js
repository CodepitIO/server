const async = require('async'),
  _ = require('lodash')

const Contest = require('../models/contest'),
  Team = require('../models/team'),
  Submission = require('../models/submission'),
  Redis = require('../services/dbs').redisClient,
  Problems = require('./problems'),
  Errors = require('../utils/errors'),
  Utils = require('../utils/utils')

function canViewContest(contest, user) {
  return !contest.watchPrivate ||
    (user && (user.isAdmin || contest.userInContest(user) || contest.isAuthor(user)));
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

      hasStarted: contest.hasStarted(),
      hasEnded: contest.hasEnded(),
      canViewContest: canViewContest(contest, req.user),
      inContest: contest.userInContest(userId),
      isContestAdmin: Utils.cmpToString(req.user && req.user._id)(contest.author)
    }

    let isAdmin = req.user && req.user.isAdmin
    let canViewContestants = obj.canViewContest
    let canViewProblems = obj.canViewContest &&
      (isAdmin || contest.isAuthor(req.user) || obj.hasStarted)

    if (canViewContestants) obj.contestants = contest.contestants
    if (canViewProblems) obj.problems = contest.problems
    if (obj.isContestAdmin) obj.password = contest.password

    return res.json(obj)
  })
}

exports.getEvents = (req, res) => {
  let id = req.params.id
  let startFrom = _.toInteger(req.params.from) || 0
  Contest.findById(id, (err, contest) => {
    if (err) return res.status(500).send()
    if (!contest || !canViewContest(contest, req.user)) {
      return res.status(400).send()
    }

    let isAdmin = req.user && req.user.isAdmin
    let upTo = Math.min(contest.date_end, new Date().getTime())
    if (!isAdmin && upTo >= contest.frozen_time && upTo < contest.date_end) {
      upTo = contest.frozen_time.getTime()
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
      if (err) {
        console.log('contest.js', err)
        return res.status(500).send()
      }
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
  if (!req.user.local.verified) return res.status(400).send()
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
      if (contest && contest.date_end < now) return res.status(400).send()
      try {
        c.date_start = new Date(data.date_start)
        c.date_end = new Date(data.date_end)
        if (data.hasBlind) c.blind_time = new Date(data.blind_time)
        else c.blind_time = c.date_end
        if (data.hasFrozen) c.frozen_time = new Date(data.frozen_time)
        else c.frozen_time = c.blind_time

        let timeArr = [c.date_start, c.frozen_time, c.blind_time, c.date_end];
        if (_.some(timeArr, _.isNaN)) return res.status(400).send()
        for (let i = 0; i < 3; i++) {
          if (timeArr[i] > timeArr[i+1]) return res.status(400).send()
        }

        let sixMonthsFromNow = now + 6 * 30 * 24 * 60 * 60 * 1000;
        if (c.date_end > sixMonthsFromNow) return res.status(400).send()
        if (c.date_start < Math.min(now - 60 * 60 * 1000, contest && contest.date_start || now)) {
          return res.status(400).send()
        }
        return next()
      } catch (err) {
        console.log(err)
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
      c.problems = data.problems
      if (!_.isArray(c.problems) || c.problems.length < 1 || c.problems.length > 26) {
        return res.status(400).send()
      }
      c.problems = _.chain(c.problems)
        .map((obj) => {
          if (obj._id) return _.toString(obj._id)
          return _.toString(obj)
        }).uniq().value()
      if (!Problems.isIndexed(c.problems)) return res.status(400).send()
      return next()
    }
  ], (err) => {
    if (err) return res.status(500).send()
    req.body = c
    return next()
  })
}

exports.createOrEdit = (req, res) => {
  let id = req.params.id
  if (!id) {
    req.body.author = req.user._id
    let contest = new Contest(req.body)
    return contest.save((err, contest) => {
      if (err) return res.status(500).send()
      return res.json({id: contest._id})
    })
  } else {
    Contest.findOneAndUpdate({_id: id}, req.body, (err, contest) => {
      if (err) return res.status(500).send()
      return res.json({})
    })
  }
}
