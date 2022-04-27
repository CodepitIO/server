const nodemailer = require(`nodemailer`);
const sesTransport = require(`nodemailer-ses-transport`);
const fs = require(`fs`);
const util = require(`util`);
const path = require(`path`);

const _ = require(`lodash`);

const Queue = require(`./queue`);
const Redis = require(`./dbs`).redisClient;

const C = require(`../../common/constants`).CONN;

const transporter = nodemailer.createTransport(
  sesTransport({
    region: C.MAILER.SES_REGION,
    rateLimit: C.MAILER.RATE_LIMIT,
    maxConnections: C.MAILER.MAX_CONN,
  })
);

const TEMPLATE_URL = path.join(__dirname, `./templates/%s.html`);
const REGISTER_TMPL = _.template(
  fs.readFileSync(util.format(TEMPLATE_URL, `register`), `utf8`)
);
const RECOVER_TMPL = _.template(
  fs.readFileSync(util.format(TEMPLATE_URL, `recover`), `utf8`)
);

const domain = process.env.DOMAIN || C.GET_DOMAIN();

const mailHandler = {
  register(job, done) {
    Redis.set(`email:register:${job.data.id}`, 1);
    job.data.domain = domain;
    const body = REGISTER_TMPL(job.data);
    const mailOptions = {
      from: `"Codepit" <hello@codepit.io>`,
      subject: `Welcome to Codepit!`,
      to: job.data.to,
      text: body,
      html: body,
    };
    return transporter.sendMail(mailOptions, done);
  },
  recover(job, done) {
    Redis.set(`email:recover:${job.data.id}`, 1);
    Redis.expire(`email:recover:${job.data.id}`, C.MAILER.TIMELIMIT_PER_USER);
    job.data.domain = domain;
    const body = RECOVER_TMPL(job.data);
    const mailOptions = {
      from: `"Codepit" <recover@codepit.io>`,
      subject: `Codepit Password Recovery`,
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
