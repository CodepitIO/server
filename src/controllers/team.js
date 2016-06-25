'use strict'

const async = require('async'),
  _ = require('lodash')

const Team = require('../models/team'),
  User = require('../models/user'),
  Errors = require('../utils/errors'),
  Utils = require('../utils/utils')

const MAX_TEAMS_PER_USER = 20

exports.getByLoggedUser = (req, res) => {
  let userId = req.user._id
  async.parallel({
    member: (next) => {
      Team.find({members: userId}, '_id name', next)
    },
    invited: (next) => {
      Team.find({invites: userId}, '_id name', next)
    }
  }, (err, results) => {
    if (err) return res.status(500).end()
    return res.json(results)
  })
}

exports.getById = (req, res) => {
  let teamId = req.params.id
  Team.findById(teamId)
  .populate({
    path: 'members',
    select: '_id local.username'
  })
  .populate({
    path: 'invites',
    select: '_id local.username'
  })
  .exec((err, team) => {
    if (err) return res.status(500).end()
    if (!team) return res.status(400).end()
    return res.json(team)
  })
}

exports.leave = (req, res) => {
  let teamId = req.body.id,
    userId = req.user._id
  Team.findByIdAndUpdate(teamId, {
    $pull: {
      'members': userId
    }
  }, (err, team) => {
    if (err) return res.status(500).end()
    if (!team) return res.status(400).end()
    return res.json({})
  })
}

exports.invite = (req, res) => {
  let teamId = req.body.id
  let invitedEmail = req.body.invited
  let userId = req.user._id
  async.parallel({
    team: (next) => {
      Team.findOne({_id: teamId, members: userId}, next)
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
    if (team.members.length + team.invites.length >= MAX_TEAMS_PER_USER) {
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
    _.remove(team.invites, Utils.cmpToString(removedId))
    _.remove(team.members, Utils.cmpToString(removedId))
    team.save((err) => {
      if (err) return res.status(500).send()
      return res.json({})
    })
  })
}

exports.accept = (req, res) => {
  let teamId = req.body.id
  let userId = req.user._id
  Team.findOne({_id: teamId, invites: userId}, (err, team) => {
    if (err) return res.status(500).send()
    if (!team) return res.status(400).send()
    _.remove(team.invites, Utils.cmpToString(userId))
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
    _.remove(team.invites, Utils.cmpToString(userId))
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
  Team.find({_id: teamId, members: userId}, (err, team) => {
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
