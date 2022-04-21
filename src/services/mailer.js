"use strict";

const nodemailer = require("nodemailer"),
  sesTransport = require("nodemailer-ses-transport"),
  fs = require("fs"),
  util = require("util"),
  path = require("path"),
  _ = require("lodash");

const Queue = require("./queue"),
  Redis = require("../services/dbs").redisClient;

const C = require("../../common/constants").CONN;

let transporter = nodemailer.createTransport(
  sesTransport({
    region: C.MAILER.SES_REGION,
    rateLimit: C.MAILER.RATE_LIMIT,
    maxConnections: C.MAILER.MAX_CONN,
  })
);

const TEMPLATE_URL = path.join(__dirname, "../../public/templates/%s.html");
let REGISTER_TMPL = _.template(
  fs.readFileSync(util.format(TEMPLATE_URL, "register"), "utf8")
);
let RECOVER_TMPL = _.template(
  fs.readFileSync(util.format(TEMPLATE_URL, "recover"), "utf8")
);

let domain = process.env.DOMAIN || C.GET_DOMAIN();

let mailHandler = {
  register: function (job, done) {
    Redis.set(`email:register:${job.data.id}`, 1);
    Redis.expire(`email:register:${job.data.id}`, C.MAILER.TIMELIMIT_PER_USER);
    job.data.domain = domain;
    let body = REGISTER_TMPL(job.data);
    var mailOptions = {
      from: '"Codepit" <hello@codepit.io>',
      subject: "Welcome to Codepit!",
      to: job.data.to,
      text: body,
      html: body,
    };
    return transporter.sendMail(mailOptions, done);
  },
  recover: function (job, done) {
    Redis.set(`email:recover:${job.data.id}`, 1);
    Redis.expire(`email:recover:${job.data.id}`, C.MAILER.TIMELIMIT_PER_USER);
    job.data.domain = domain;
    let body = RECOVER_TMPL(job.data);
    var mailOptions = {
      from: '"Codepit" <recover@codepit.io>',
      subject: "Codepit Password Recovery",
      to: job.data.to,
      text: body,
      html: body,
    };
    return transporter.sendMail(mailOptions, done);
  },
};

function delegateEmailHandler(job, done) {
  if (mailHandler[job.data.type]) return mailHandler[job.data.type](job, done);
  return done(new Error());
}

Queue.pullEmail(delegateEmailHandler);

exports.sendMail = Queue.pushEmail;
