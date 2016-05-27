const mongoose = require('mongoose')

const ValidateChain = require('../utils/utils').validateChain

const ObjectId = mongoose.Schema.Types.ObjectId,

let schema = mongoose.Schema({
  author: {
    type: ObjectId,
    ref: 'User'
  },
  title: String,
  body: String,
  tags: [String],
  home: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

schema.index({ author: 1, createdAt: -1 })
schema.index({ home: 1}, { partialFilterExpression: { home: true } })

schema.statics.validateChain = ValidateChain({
  author: function() {
    this.isMongoId()
  },
  title: function() {
    this.notEmpty().isLength({min: 1, max:50})
  },
  body: function() {
    this.notEmpty().isByteLength({min: 1, max: 30 * 1000 })
  },
  home: function() {
    this.optional().isBoolean()
  },
})

module.exports = mongoose.model('Post', schema)
