'use strict';

const bodyParser     = require('body-parser'),
      fs             = require('fs'),
      methodOverride = require('method-override'),
      cookieParser   = require('cookie-parser'),
      connect        = require('connect'),
      compression	   = require('compression'),
      favicon 	     = require('serve-favicon'),
      express        = require('express'),
      basicAuth      = require('basic-auth-connect'),
      routes         = require('./src/routes');

let app   = express(),
    port  = process.env.PORT || 3000;

// set locale
app.locals.moment = require('moment-timezone');
app.locals.moment.locale('pt');
app.locals.moment.tz('America/Recife');

// general config (cookies, compression, etc.)
app.use(cookieParser());
app.use(connect.cookieSession({ secret: 'dDADW!#%@!ijewjqoidasweA2$kdasda@$!ads', cookie: { maxAge: 24 * 60 * 60 * 1000 }}));
app.use(compression());
app.use(favicon(__dirname + '/public/imgs/favicon.ico'));

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// configuration ===========================================
app.listen(port);
console.log('Listening to port ' + port);

// routes ============================================
routes.configure(app);

// setup server services
const setupServices  = require('./src/services/setup');
setupServices();

module.exports = app;
