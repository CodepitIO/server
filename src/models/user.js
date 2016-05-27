'use strict'

const mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  crypto = require('crypto')

const Team = require('./team'),
  ValidateChain = require('../utils/utils').validateChain

// define the schema for our user model
let schema = mongoose.Schema({
  local: {
    username: String,
    name: String,
    surname: String,
    email: String,
    password: String
  }
})

schema.index({ username: 1 }, { unique: true })
schema.index({ email: 1 }, { unique: true })

schema.statics.validateChain = ValidateChain({
  name: function() {
    this.notEmpty().isLength({min: 1, max:100})
  },
  surname: function() {
    this.notEmpty().isLength({min: 1, max:100})
  },
  username: function() {
    this.notEmpty().isLength({min: 1, max:100})
  },
  email: function() {
    this.notEmpty().isLength({min: 1, max:100})
  },
  password: function() {
    this.notEmpty().isLength({min: 1, max:100})
  }
})

schema.statics.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

schema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password)
}

schema.methods.countEmptyTeam = function() {
  return Team.count({
    admin: this,
    members: {
      $size: 1
    },
    invites: {
      $size: 0
    }
  })
}

schema.virtual('local.fullName').get(function() {
  return `${this.local.name} ${this.local.surname}`
})

schema.virtual('local.emailHash').get(function() {
  return crypto.createHash('md5').update(this.local.email.toLowerCase()).digest('hex')
})

module.exports = mongoose.model('User', schema)
