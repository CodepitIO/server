const _ = require('lodash')

const constants = require('../config/constants')

exports.getTime = (req, res) => {
  return res.json({
    date: new Date()
  })
}

exports.cmpToString = (rhs) => {
  return (lhs) => {
    return _.toString(lhs) === _.toString(rhs)
  }
}

exports.cmpDiffString = (rhs) => {
  return (lhs) => {
    return _.toString(lhs) !== _.toString(rhs)
  }
}

// Validate related functions
exports.isValidId = (req, res, next) => {
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
