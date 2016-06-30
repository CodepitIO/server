'use strict'

const async = require('async'),
  fs = require('fs'),
  kue = require('kue'),
  path = require('path'),
  util = require('util')

const DownloadFile = require('../utils/utils').downloadFile,
  Errors = require('../utils/errors'),
  Problem = require('../models/problem')

// --- SUBMISSION QUEUE ---

var SubmissionQueue = kue.createQueue({
  redis: {
    host: 'redis'
  },
  jobEvents: false
})

exports.SubmissionQueue = SubmissionQueue
