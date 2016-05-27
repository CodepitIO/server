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

const constants = require('./src/config/constants'),
  redis = require('./src/services/dbs').redisClient,
  routes = require('./src/routes'),
  validators = require('./src/utils/validators').express

let app = express(),
  port = process.env.PORT || 3000

async.waterfall([
  (next) => {
    if (app.get('env') === 'development') {
      return next(null, 'COOKIE_SECRET')
    }
    return redis.get(constants.COOKIE_SECRET_KEY, next)
  },
  (cookieSecret, next) => {
    if (!cookieSecret) {
      cookieSecret = crypto.randomBytes(256).toString('hex')
      redis.set(constants.COOKIE_SECRET_KEY, cookieSecret)
    }

    app.use(cookieParser())
    app.use(cookieSession({ secret: cookieSecret, maxAge: 30 * 24 * 60 * 60 * 1000 }))
    app.use(compression())
    app.use(favicon(__dirname + '/public/imgs/favicon.ico'))

    // get all data/stuff of the body (POST) parameters
    app.use(bodyParser.json()) // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
    app.use(expressValidator(validators))
    app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
    app.use(express.static(__dirname + '/public')) // set the static files location /public/img will be /img for users

    // routes ============================================
    routes.configure(app)

    // startup ===========================================
    app.listen(port)
    console.log('Listening to port ' + port)

    // setup server services
    const setupServices = require('./src/services/setup')
    setupServices(next)
  }
], () => {
})
