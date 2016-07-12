'use strict'

const mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  crypto = require('crypto')

const ValidateChain = require('../utils/utils').validateChain

const ACCESS = require('../config/constants').ACCESS

// define the schema for our user model
let schema = mongoose.Schema({
  local: {
    username: String,
    name: String,
    surname: String,
    email: String,
    password: String,
    verified: { type: Boolean, default: false },
    verifyHash: String,
    lastAccess: { type: Date, default: Date.now }
  },
  access: {type: Number, default: 0}
}, {
  timestamps: true
})

schema.index({ 'local.username': 1 }, { unique: true })
schema.index({ 'local.email': 1 }, { unique: true })
schema.index({ 'local.verifyHash': 1 }, { unique: true })

schema.statics.validateChain = ValidateChain({
  name: function() {
    this.notEmpty().isLength({min: 1, max:100})
  },
  surname: function() {
    this.notEmpty().isLength({min: 1, max:100})
  },
  username: function() {
    this.notEmpty().isLength({min: 1, max:30})
  },
  email: function() {
    this.notEmpty().isLength({min: 1, max:100})
  },
  password: function() {
    this.notEmpty().isLength({min: 1, max:100})
  }
})

schema.statics.generateHash = function(text) {
  return bcrypt.hashSync(text, bcrypt.genSaltSync(8))
}

schema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password)
}

schema.virtual('local.fullName').get(function() {
  if (!this.local.surname) return this.local.name
  return `${this.local.name} ${this.local.surname}`
})

schema.virtual('isAdmin').get(function() {
  return this.access >= ACCESS.ADMIN
})

schema.virtual('local.emailHash').get(function() {
  return crypto.createHash('md5').update(this.local.email.toLowerCase()).digest('hex')
})

schema.set('toObject', {
  transform: function(doc, ret, options) {
    delete ret.local.verifyHash
    return ret
  }
})

module.exports = mongoose.model('User', schema)
