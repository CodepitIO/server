'use strict';

const mongoose = require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId

const ValidateChain = require('../utils/utils').validateChain

let schema = mongoose.Schema({
  contest: {
    type: ObjectId,
    ref: 'Contest'
  },
  contestant: {
    type: ObjectId,
    ref: 'User'
  },
  rep: ObjectId,

  problem: {
    type: ObjectId,
    ref: 'Problem'
  },
  code: String,
  language: String,

  date: {
    type: Date,
    default: Date.now
  },
  verdict: {
    type: Number,
    default: 0
  },
  oj_id: {
    type: Number,
    default: -1
  }
})

schema.index({
  contest: 1,
  contestant: 1,
  date: -1
})
schema.index({ date: 1 })

schema.statics.validateChain = ValidateChain({
  language: function() {
    this.notEmpty().isIn(['c', 'cpp', 'cpp11', 'java'])
  },
  code: function() {
    this.notEmpty().isByteLength({min: 1, max: 64 * 1024})
  },
  contest: function(problemId, userId) {
    this.canSubmitToContest(problemId, userId)
  }
})

module.exports = mongoose.model('Submission', schema)
