'use strict'

const crypto = require('crypto'),
  LocalStrategy = require('passport-local').Strategy

const User = require('../models/user'),
  Errors = require('../utils/errors')

module.exports = (passport) => {

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, done)
  })

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {
    User.findOne({
      'local.email': email
    }, (err, user) => {
      if (err) return done()
      if (user) return done(Errors.EmailAlreadyExists)

      let account = req.body
      user = new User({
        local: {
          name: account.name,
          surname: account.surname,
          email: account.email,
          username: account.username,
          password: User.generateHash(account.password)
        }
      })
      user.save(done)
    })
  }))

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {
    User.findOne({
      'local.email': email
    }, (err, user) => {
      if (err) return done()
      if (!user || !user.validPassword(password)) {
        return done(Errors.InvalidEmailOrPassword)
      }
      user.local.lastAccess = new Date()
      return user.save((err, user) => {
        done(null, user.toObject({virtuals: true}))
      })
    })
  }))
}
