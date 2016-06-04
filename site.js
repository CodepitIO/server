'use strict'

const async = require('async'),
  bodyParser = require('body-parser'),
  crypto = require('crypto'),
  expressValidator = require('express-validator'),
  fs = require('fs'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  cookieSession = require('cookie-session'),
  compression = require('compression'),
  favicon = require('serve-favicon'),
  express = require('express')

const routes = require('./src/routes')

let app = express(),
  port = process.env.PORT || 3000,
  cookieSecret = process.env.COOKIE_SECRET || 'COOKIE_SECRET'

app.use(cookieParser())
app.use(cookieSession({ secret: cookieSecret, maxAge: 30 * 24 * 60 * 60 * 1000 }))
app.use(compression())
app.use(favicon(__dirname + '/public/imgs/favicon.ico'))

app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressValidator())
app.use(methodOverride('X-HTTP-Method-Override'))
app.use(express.static(__dirname + '/public'))

routes.configure(app)

app.listen(port)
console.log('Listening to port ' + port)

// setup server services
const setupServices = require('./src/services/setup')
setupServices()
