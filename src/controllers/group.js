'use strict'

const async = require('async'),
  _ = require('lodash')

const Group = require('../../common/models/group'),
  User = require('../../common/models/user'),
  Errors = require('../utils/errors'),
  Utils = require('../../common/lib/utils')

const MAX_GROUPS_PER_USER = 50
const MAX_USERS_PER_GROUP = 500

exports.getByLoggedUser = (req, res) => {
  let userId = req.user._id
  async.parallel({
    member: (next) => {
      Group.find({members: userId}, '_id name description').exec(next)
    },
    invited: (next) => {
      Team.find({invites: userId}, '_id name description').exec(next)
    }
  }, (err, results) => {
    if (err) return res.status(500).end()
    return res.json(results)
  })
}

exports.getById = (req, res) => {
  let groupId = req.params.id
  Group.findById(groupId)
  .populate({
    path: 'members',
    select: '_id local.username local.name local.surname local.email'
  })
  .populate({
    path: 'invites',
    select: '_id local.username local.name local.surname local.email'
  })
  .exec((err, group) => {
    if (err) return res.status(500).end()
    if (!group) return res.status(400).end()
    group = group.toObject({virtuals: true})
    return res.json({group: group})
  })
}

exports.leave = (req, res) => {
  let groupId = req.body.id,
    userId = req.user._id
  Group.findByIdAndUpdate(groupId, {
    $pull: {
      'members': userId
    }
  }, (err, group) => {
    if (err) return res.status(500).end()
    if (!group) return res.status(400).end()
    return res.json({})
  })
}

exports.invite = (req, res) => {
  let groupId = req.body.id
  let invitedEmails = _.chain(req.body.invited)
      .split(/[\s,]/, 30)
      .compact()
      .value()
  let userId = req.user._id
  async.parallel({
    group: (next) => {
      Group.findOne({_id: groupId, members: userId}, next)
    },
    invited: (next) => {
      User.findOne({'local.email': invitedEmail}, '_id local.username local.name local.surname local.email', next)
    }
  }, (err, results) => {
    if (err) return res.status(500).send()
    let team = results.team
    let invited = results.invited
    if (!team) return res.status(400).send()
    if (!invited) return res.json(Errors.UserNotFoundByEmail)
    if (team.hasUser(invited._id)) return res.json(Errors.UserAlreadyInTeam)
    if (team.members.length + team.invites.length >= MAX_USERS_PER_TEAM) {
      return res.status(400).send()
    }
    team.invites.push(invited._id)
    team.save((err) => {
      if (err) return res.status(500).send()
      return res.json({invited: invited.toObject({virtuals: true})})
    })
  })
}

exports.remove = (req, res) => {
  let teamId = req.body.id
  let removedId = req.body.removed
  let userId = req.user._id
  Team.findOne({_id: teamId, members: userId}, (err, team) => {
    if (err) return res.status(500).send()
    if (!team) return res.status(400).send()
    team.invites = _.filter(team.invites, Utils.cmpDiffStringFn(removedId))
    team.members = _.filter(team.members, Utils.cmpDiffStringFn(removedId))
    team.save((err, team) => {
      if (err) return res.status(500).send()
      return res.json({})
    })
  })
}

exports.accept = (req, res) => {
  let teamId = req.body.id
  let userId = req.user._id
  async.parallel({
    count: (next) => {
      Team.count({ members: userId }, next)
    },
    team: (next) => {
      Team.findOne({ _id: teamId, invites: userId }, next)
    }
  }, (err, results) => {
    if (err) return res.status(500).send()
    let team = results.team
    let count = results.count
    if (!team) return res.status(400).send()
    if (count >= MAX_TEAMS_PER_USER) return res.json(Errors.UserTeamLimitExceed)
    team.invites = _.filter(team.invites, Utils.cmpDiffStringFn(userId))
    team.members.push(userId)
    team.save((err) => {
      if (err) return res.status(500).send()
      return res.json({})
    })
  })
}

exports.decline = (req, res) => {
  let teamId = req.body.id
  let userId = req.user._id
  Team.findOne({_id: teamId, invites: userId}, (err, team) => {
    if (err) return res.status(500).send()
    if (!team) return res.status(400).send()
    team.invites = _.filter(team.invites, Utils.cmpDiffStringFn(userId))
    team.save((err) => {
      if (err) return res.status(500).send()
      return res.json({})
    })
  })
}

exports.create = (req, res) => {
  if (Team.validateChain(req).seeName().seeDescription().notOk()) {
    return res.status(400).send()
  }
  // TODO: user should wait at least 10 minutes to create a new team
  let userId = req.user._id
  Team.count({
    members: userId
  }, (err, count) => {
    if (err) return res.status(500).end()
    if (count >= MAX_TEAMS_PER_USER) {
      return res.status(400).send()
    }
    let team = new Team({
      name: req.body.name,
      description: req.body.description || '',
      members: [userId],
    })
    team.save((err, team) => {
      if (err) return res.status(500).end()
      return res.json({team: team})
    })
  })
}

exports.edit = (req, res) => {
  if (Team.validateChain(req).seeName().seeDescription().notOk()) {
    return res.status(400).send()
  }
  let teamId = req.body.id
  let userId = req.user._id
  Team.findOne({_id: teamId, members: userId}, (err, team) => {
    if (err) return res.status(500).send()
    if (!team) return res.status(400).send()
    team.name = req.body.name
    team.description = req.body.description || ''
    team.save((err) => {
      if (err) return res.status(500).send()
      return res.json({})
    })
  })
}
