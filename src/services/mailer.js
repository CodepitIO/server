'use strict'

const nodemailer = require('nodemailer'),
  sesTransport = require('nodemailer-ses-transport'),
  fs = require('fs'),
  util = require('util'),
  _ = require('lodash')

const Queue = require('./queue')

const MAILER = require('../config/constants').MAILER

let transporter = nodemailer.createTransport(sesTransport({
  region: MAILER.SES_REGION,
  rateLimit: MAILER.RATE_LIMIT,
  maxConnections: MAILER.MAX_CONN,
}))

const TEMPLATE_URL = __dirname + '/templates/%s.html'
let REGISTER_TMPL = _.template(fs.readFileSync(util.format(TEMPLATE_URL,'register'), 'utf8'))

let mailHandler = {
  register: function(job, done) {
    let body = REGISTER_TMPL(job.data)
    var mailOptions = {
      from: '"Codepit" <hello@codepit.io>',
      subject: 'Bem-vindo ao Codepit!',
      to: job.data.to,
      text: body,
      html: body
    }
    console.log(mailOptions)
    return transporter.sendMail(mailOptions, done)
  }
}

function delegateEmailHandler(job, done) {
  if (mailHandler[job.data.type]) return mailHandler[job.data.type](job, done)
  return done(new Error())
}

Queue.pullEmail(delegateEmailHandler)

exports.sendMail = Queue.pushEmail
