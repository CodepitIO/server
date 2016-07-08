'use strict';

const mongoose = require('mongoose'),
  _ = require('lodash')

const Submission = require('./submission'),
  ValidateChain = require('../utils/utils').validateChain

const ObjectId = mongoose.Schema.Types.ObjectId

let contestantSchema = mongoose.Schema({
  id: {
    type: ObjectId,
    ref: 'User'
  },
  team: {
    type: ObjectId,
    ref: 'Team'
  }
}, { _id: false })

let schema = mongoose.Schema({
  name: String,

  author: {
    type: ObjectId,
    ref: 'User'
  },

  date_start: Date,
  date_end: Date,

  frozen_time: Date,
  blind_time: Date,

  problems: [{
    type: ObjectId,
    ref: 'Problem'
  }],

  contestants: [contestantSchema],

  contestantType: {
    type: Number,
    default: 3
  },
  password: {
    type: String,
    default: ''
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  watchPrivate: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

schema.index({ date_start: -1 })
schema.index({ date_end: -1 })
schema.index({ author: 1, createdAt: -1 })
schema.index({ 'contestants.id': 1, 'date_start': -1, })
schema.index({ 'contestants.id': 1, '_id': 1, })
schema.index({ 'contestants.team': 1, 'contestants.id': 1, '_id': 1, })

schema.methods.getUserRepresentative = function (user) {
  let id = user && user._id && _.toString(user._id) || _.toString(user)
  let elem = _.find(this.contestants, function (obj) {
    return obj.id && _.toString(obj.id) === id
  })
  return elem && (elem.team || elem.id)
}

schema.methods.userInContest = function (user) {
  let id = user && user._id && _.toString(user._id) || _.toString(user)
  return _.some(this.contestants, (obj) => {
    let uid = (obj.id && obj.id._id) ? obj.id._id : (obj.id ? obj.id : obj)
    return _.toString(uid) === id
  })
}

schema.methods.problemInContest = function (problem) {
  let id = problem && problem._id && _.toString(problem._id) || _.toString(problem)
  return _.some(this.problems, (obj) => {
    return _.toString(obj) === _.toString(id)
  })
}

schema.methods.isAuthor = function(user) {
  let id = user && user._id && _.toString(user._id) || _.toString(user)
  return this.author.toString() === id
}

schema.methods.hasStarted = function() {
  return this.date_start <= new Date()
}

schema.methods.hasEnded = function() {
  return this.date_end <= new Date()
}

module.exports = mongoose.model('Contest', schema)
