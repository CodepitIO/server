const mongoose = require('mongoose'),
  _ = require('lodash')

const ObjectId = mongoose.Schema.Types.ObjectId

const ValidateChain = require('../utils/utils').validateChain

let schema = mongoose.Schema({
  name: String,
  description: String,

  date_created: {
    type: Date,
    default: Date.now
  },

  members: [{
    type: ObjectId,
    ref: 'User'
  }],
  invites: [{
    type: ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
})

schema.index({ 'members': 1, '_id': 1 })
schema.index({ 'invites': 1, '_id': 1 })

schema.statics.validateChain = ValidateChain({
  name: function() {
    this.notEmpty().isLength({min: 1, max:50})
  },
  description: function() {
    this.isLength({min: 0, max:200})
  },
})

schema.methods.hasUser = function(userId) {
  return _.some(_.concat(this.members, this.invites), (user) => {
    return _.toString(user) === _.toString(userId)
  })
}

module.exports = mongoose.model('Team', schema)
