'use strict';
// modules =================================================
// require('pmx').init({http: true});
const bodyParser     = require('body-parser'),
      methodOverride = require('method-override'),
      passport       = require('passport'),
      cookieParser   = require('cookie-parser'),
      connect        = require('connect'),
      compression	   = require('compression'),
      favicon 	   = require('serve-favicon'),
      express        = require('express'),
      app            = express(),
      server         = require('http').Server(app),
      mongoose       = require('mongoose'),
      db             = require('./config/db'),
      redis          = require('./config/redis').defaultClient,
      services       = require('./app/services');

// configuration ===========================================
// set locale
app.locals.moment = require('moment-timezone');
app.locals.moment.locale('pt');
app.locals.moment.tz('America/Recife');

// connect to db and redis
mongoose.connect(db.url); // connect to our database
redis.on('error', (err) => {
  console.log(err);
});

// general config (cookies, compression, etc.)
app.use(cookieParser());
app.use(connect.cookieSession({ secret: 'dDADW!#%@!davDgDOSAdsaweA2$kdasda@$!ads', cookie: { maxAge: 24 * 60 * 60 * 1000 }}));
app.use(compression());
app.use(favicon(__dirname + '/public/imgs/favicon.ico'));

// passport authentication
require('./config/passport')(passport); // pass passport for configuration
app.use(passport.initialize());
app.use(passport.session());

// socket
//require('./app/socket')(server);

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// routes ==================================================
require('./app/routes')(app, passport); // pass our application into our routes

// start app ===============================================
var port = process.env.PORT || 3000; // set our port
server.listen(port);
console.log('Listening to port ' + port);
exports = module.exports = app;
