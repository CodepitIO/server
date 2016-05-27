'use strict'

const passport = require('passport')

const Errors = require('../utils/errors'),
  User = require('../models/user')

exports.remapUser = (user) => {
  if (!user) return null
  return {
    id: user._id,
    username: user.local.username,
    email: user.local.email,
    emailHash: user.local.emailHash,
    name: user.local.fullName
  }
}

exports.getUserDataByEmail = (email, callback) => {
  User.findOne({
    'local.email': email
  }, (user) => {
    return callback(exports.remapUser(user))
  })
}

exports.edit = (req, res, next) => {
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
  if (User.validateChain(req).checkEmail().checkPassword().notOk()) {
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
