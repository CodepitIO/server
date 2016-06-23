'use strict'

const mongoose = require('mongoose')

let problemSchema = mongoose.Schema({
  id: String,
  name: String,
  oj: String,
  url: String,
  originalUrl: String,
  fullName: String,
  imported: {
    type: Boolean,
    default: false
  },
  importTries: {
    type: Number,
    default: 0
  },
  html: String,
  source: String,
  timelimit: Number,
  memorylimit: String,
  inputFile: String,
  outputFile: String,
  isPdf: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

problemSchema.index({
  oj: 1,
  id: 1
}, {
  unique: true
})

module.exports = mongoose.model('Problem', problemSchema)
