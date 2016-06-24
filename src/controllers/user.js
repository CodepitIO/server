'use strict'

const passport = require('passport')

const Errors = require('../utils/errors'),
  User = require('../models/user')

exports.edit = (req, res) => {
  let account = req.body
  async.waterfall([
    async.apply(User.findOne, {'local.email': account.email}),
    (user, next) => {
      if (!user.validPassword(account.password)) {
        return res.json(Errors.InvalidPassword)
      }
      if (account.newPassword.length > 0) {
        user.local.password = user.generateHash(account.newPassword)
      }
      user.local.name = account.name
      user.local.surname = account.surname
      return user.save(next)
    }
  ], (err, user) => {
    if (err) return res.status(500).send()
    return res.json(user)
  })
}

exports.register = (req, res) => {
  if (req.isAuthenticated()) req.logout()
  let valid = User.validateChain(req)
    .seeName()
    .seeSurname()
    .seeUsername()
    .seeEmail()
    .seePassword()
    .ok()
  if (!valid) return res.status(400).send()
  passport.authenticate('local-signup', (err, user) => {
    if (err) return res.json(err)
    if (!user) return res.status(500).send()
    req.logIn(user, (err) => {
      if (err) return res.status(500).send()
      return res.json(req.user)
    })
  })(req, res, (err) => {
    res.status(500).send()
  })
}

exports.login = (req, res) => {
  if (req.isAuthenticated()) req.logout()
  if (User.validateChain(req).seeEmail().seePassword().notOk()) {
    return res.status(400).send()
  }
  passport.authenticate('local-login', (err, user) => {
    if (err) return res.json(err)
    if (!user) return res.status(500).send()
    req.logIn(user, (err) => {
      if (err) return res.status(500).send()
      return res.json(req.user)
    })
  })(req, res, (err) => {
    res.status(500).send()
  })
}

exports.logout = (req, res) => {
  req.logout()
  return res.json({})
}

exports.checkUsername = (req, res) => {
  if (User.validateChain(req).seeUsername().notOk()) {
    return res.status(400).send()
  }
  let username = req.params.username || ''
  User.findOne({ 'local.username': username }, (err, user) => {
    return res.json({ available: !user })
  })
}

exports.checkEmail = (req, res) => {
  if (User.validateChain(req).seeEmail().notOk()) {
    return res.status(400).send()
  }
  let email = req.params.email || ''
  User.findOne({ 'local.email': email }, (err, user) => {
    return res.json({ available: !user })
  })
}

exports.get = (req, res) => {
  let id = req.params.id
  User.findById(id, '-local.password', (err, user) => {
    if (err) return res.status(500).send()
    user = user.toObject({
      virtuals: true
    })
    delete user.local.email
    return res.json({user: user.local})
  })
}

exports.status = (req, res) => {
  if (req.user && req.user._id) {
    return res.json({user: req.user.toObject({virtuals: true})});
  }
  return res.json({})
}
