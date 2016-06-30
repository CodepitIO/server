'use strict'

const kue = require('kue')

var SubmissionQueue = kue.createQueue({
  redis: {
    host: 'redis'
  },
  jobEvents: false
})

exports.SubmissionQueue = SubmissionQueue
