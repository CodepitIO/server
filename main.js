'use strict'

const express = require('express')
const http = require('http')

const Dbs = require('./src/services/dbs')
const Mailer = require('./src/services/mailer')
const Queue = require('./src/services/queue')
const Routes = require('./src/routes')

/*Mailer.sendMail({
  type: 'register',
  to: 'gustavostor@gmail.com',
  name: 'Gustavo',
  verifyUrl: 'https://www.codepit.io/'
})*/

let app = express()
Routes.configure(app)

let port = process.env.PORT || 3000
let server = require('http').Server(app)
server.listen(port)

console.log('Codepit web online')
