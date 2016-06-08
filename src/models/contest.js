'use strict';

const mongoose = require('mongoose'),
  _ = require('lodash')

const Submission = require('./submission')

const ObjectId = mongoose.Schema.Types.ObjectId

var schema = mongoose.Schema({
  name: String,
  description: String,

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

  contestants: [{
    id: {
      type: ObjectId,
      ref: 'User'
    },
    team: {
      type: ObjectId,
      ref: 'Team'
    }
  }],

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

schema.index({
  date_start: -1
})
schema.index({
  date_end: -1
})
schema.index({
  author: 1,
  createdAt: -1
})

schema.methods.userInContest = function (id) {
  if (!id) return false
  var index = _.findIndex(this.contestants, function (obj) {
    return obj.id && obj.id.toString() === id.toString()
  })
  return index !== -1
}

schema.methods.problemInContest = function (id) {
  if (!id) return false
  var index = _.findIndex(this.problems, function (obj) {
    return obj.toString() === id.toString()
  })
  return index !== -1
}

module.exports = mongoose.model('Contest', schema)
