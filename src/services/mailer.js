'use strict'

const nodemailer = require('nodemailer'),
  sesTransport = require('nodemailer-ses-transport'),
  fs = require('fs'),
  util = require('util'),
  _ = require('lodash')

const Queue = require('./queue'),
  Constants = require('../config/constants'),
  Redis = require('../services/dbs').redisClient

let transporter = nodemailer.createTransport(sesTransport({
  region: Constants.MAILER.SES_REGION,
  rateLimit: Constants.MAILER.RATE_LIMIT,
  maxConnections: Constants.MAILER.MAX_CONN,
}))

const TEMPLATE_URL = __dirname + '/templates/%s.html'
let REGISTER_TMPL = _.template(fs.readFileSync(util.format(TEMPLATE_URL,'register'), 'utf8'))
let RECOVER_TMPL = _.template(fs.readFileSync(util.format(TEMPLATE_URL,'recover'), 'utf8'))

let domain = process.env.domain || Constants.GET_DOMAIN()

let mailHandler = {
  register: function(job, done) {
    Redis.set(`email:register:${job.data.id}`, 1)
    Redis.expire(`email:register:${job.data.id}`, Constants.MAILER.TIMELIMIT_PER_USER)
    job.data.domain = domain
    let body = REGISTER_TMPL(job.data)
    var mailOptions = {
      from: '"Codepit" <hello@codepit.io>',
      subject: 'Bem-vindo ao Codepit!',
      to: job.data.to,
      text: body,
      html: body
    }
    return transporter.sendMail(mailOptions, done)
  },
  recover: function(job, done) {
    Redis.set(`email:recover:${job.data.id}`, 1)
    Redis.expire(`email:recover:${job.data.id}`, Constants.MAILER.TIMELIMIT_PER_USER)
    job.data.domain = domain
    let body = RECOVER_TMPL(job.data)
    var mailOptions = {
      from: '"Codepit" <recover@codepit.io>',
      subject: 'Recuperação de Senha do Codepit',
      to: job.data.to,
      text: body,
      html: body
    }
    return transporter.sendMail(mailOptions, done)
  }
}

function delegateEmailHandler(job, done) {
  if (mailHandler[job.data.type]) return mailHandler[job.data.type](job, done)
  return done(new Error())
}

Queue.pullEmail(delegateEmailHandler)

exports.sendMail = Queue.pushEmail
