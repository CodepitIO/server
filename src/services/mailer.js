'use strict'

const nodemailer = require('nodemailer'),
  sesTransport = require('nodemailer-ses-transport'),
  fs = require('fs')

const MAILER = require('../config/constants').MAILER

let transporter = nodemailer.createTransport(sesTransport({
  region: MAILER.SES_REGION,
  rateLimit: MAILER.RATE_LIMIT,
  maxConnections: MAILER.MAX_CONN,
}))

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '"Codepit" <hello@codepit.io>', // sender address
    to: 'gustavostor@gmail.com, victorddiniz@gmail.com', // list of receivers
    subject: 'Bem-vindo ao Codepit!', // Subject line
    text: fs.readFileSync('/Users/stor/workspace/codepit/web/src/services/templates/register_mail.html', 'utf8'),
    html: fs.readFileSync('/Users/stor/workspace/codepit/web/src/services/templates/register_mail.html', 'utf8')
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});
