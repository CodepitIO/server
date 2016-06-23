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

problemSchema.post('save', (problem, next) => {
  if (problem.fullName && problem.url && problem.originalUrl) return next()
  let oj = problem.oj
  let id = problem.id
  let name = problem.name
  problem.fullName = "[" + Defaults[oj].name + " " + id + "] " + name
  if (!problem.url) {
    problem.url = Defaults[oj].url + Defaults[oj].getProblemPath(id)
  }
  if (problem.isPdf) {
    problem.originalUrl = Defaults[oj].url + Defaults[oj].getProblemPdfPath(id)
  } else {
    problem.originalUrl = Defaults[oj].url + Defaults[oj].getProblemPath(id)
  }
  problem.save(next)
})

module.exports = mongoose.model('Problem', problemSchema)
