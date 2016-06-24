'use strict'

const async = require('async'),
  ObjectId = require('mongoose').Types.ObjectId,
  _ = require('lodash')

const Team = require('../models/team'),
  UserCtrl = require('./user'),
  Submission = require('../models/submission')

const MAX_TEAMS_PER_USER = 5

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
  let invitedId = req.body.invited
  let userId = req.user._id
  async.parallel({
    team: (next) => {
      Team.find({_id: teamId, members: userId}, next)
    },
    invited: (next) => {
      User.findById(invitedId, '_id local.username', next)
    }
  }, (err, results) => {
    if (err) return res.status(500).send()
    let team = results.teamId
    let invited = results.invited
    if (!team || !invited || team.hasUser(invitedId)) return res.status(400).send()
    if (team.members.length + team.invites.length >= MAX_TEAMS_PER_USER) {
      return res.status(400).send()
    }
    team.invites.push(invitedId)
    team.save((err) => {
      if (err) return res.status(500).send()
      return res.json({invited: invited})
    })
  })
}

exports.remove = (req, res) => {
  let teamId = req.body.id
  let removedId = req.body.removed
  let userId = req.user._id
  Team.find({_id: teamId, members: userId}, (err, team) => {
    if (err) return res.status(500).send()
    if (!team) return res.status(400).send()
    _.pull(team.invites, removedId)
    _.pull(team.members, removedId)
    team.save((err) => {
      if (err) return res.status(500).send()
      return res.json({})
    })
  })
}

exports.accept = (req, res) => {
  let teamId = req.body.id
  let userId = req.user._id
  Team.find({_id: teamId, invites: userId}, (err, team) => {
    if (err) return res.status(500).send()
    if (!team) return res.status(400).send()
    _.pull(team.members, userId)
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
  Team.find({_id: teamId, invites: userId}, (err, team) => {
    if (err) return res.status(500).send()
    if (!team) return res.status(400).send()
    _.pull(team.invites, userId)
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
  Team.find({
    members: userId
  }, (err, teams) => {
    if (err) return res.status(500).end()
    if (teams.length >= MAX_TEAMS_PER_USER) {
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
