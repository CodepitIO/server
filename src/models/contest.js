'use strict';

const mongoose = require('mongoose'),
  _ = require('lodash')

const Submission = require('./submission')

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

schema.methods.getUserRepresentative = function (id) {
  if (!id) return false
  var elem = _.find(this.contestants, function (obj) {
    return obj.id && obj.id.toString() === id.toString()
  })
  return elem && (elem.team || elem.id)
}

schema.methods.userInContest = function (id) {
  if (!id) return false
  id = id.toString()
  return _.some(this.contestants, (obj) => {
    let cid = obj.id && obj.id._id ? obj.id._id.toString() :
              obj.id ? obj.id.toString() :
              obj.toString()
    return cid === id
  })
}

schema.methods.problemInContest = function (id) {
  if (!id) return false
  return _.some(this.problems, (obj) => {
    return obj.toString() === id.toString()
  })
}

module.exports = mongoose.model('Contest', schema)
