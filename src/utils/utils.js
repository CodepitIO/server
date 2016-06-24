const async = require('async'),
  fs = require('fs'),
  request = require('request'),
  _ = require('lodash')

const constants = require('../config/constants')

exports.getTime = function (req, res, next) {
  return res.json({
    date: new Date()
  })
}

exports.downloadFile = function (uri, filename, callback) {
  async.series([
    async.reflect(async.apply(fs.unlink, filename)),
    async.apply(request.head, uri),
    (next) => {
      request(uri).pipe(fs.createWriteStream(filename)).on('close', next)
    }
  ], callback)
}

// Validate related functions
exports.isValidId = function (req, res, next) {
  req.check('id').isMongoId()
  if (req.validationErrors()) return res.status(400).send()
  return next()
}

function ValidatorCtor(fields) {
  _.each(fields, (fn, key) => {
    this[_.camelCase(['see', key])] = function() {
      fn.apply(this.check(key), _.toArray(arguments))
      return this
    }
  })
  this.ok = function() {
    return !this.validationErrors()
  }
  this.notOk = function() {
    return !!this.validationErrors()
  }
  this.asyncOk = function() {
    return this.asyncValidationErrors()
  }
}

exports.validateChain = (fields) => {
  let chain = new ValidatorCtor(fields)
  return (req) => {
    return _.assign(chain, req)
  }
}
