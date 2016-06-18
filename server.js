// modules =================================================
require('pmx').init({http: true});

var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var fs = require('fs');
var methodOverride = require('method-override');
var passport	   = require('passport');
var mongoose = require('mongoose');
var https          = require('https');
var http = require('http');
var cookieParser   = require('cookie-parser');
var connect		   = require('connect');
var compression	   = require('compression');
var favicon 	   = require('serve-favicon');
var _ = require('underscore');

// configuration ===========================================
// set locale
app.locals.moment = require('moment-timezone');
app.locals.moment.locale('pt');
app.locals.moment.tz('America/Recife');

// run submitter and judger
var argv = require('optimist').argv;
if (argv.j || argv.judge) {
  require('./config/daemons')();  
}

// connect to db
var db = require('./config/db');
mongoose.connect(db.url); // connect to our database
//var Promise = require('bluebird');
//Promise.promisifyAll(require("mongoose"));

// passport authentication
app.use(cookieParser());
require('./config/passport')(passport); // pass passport for configuration
app.use(connect.cookieSession({ secret: 'dDZDW!$%OKDSAWJEODSA23$k%ozdc@$!qdz', cookie: { maxAge: 24 * 60 * 60 * 1000 }}));
app.use(passport.initialize());
app.use(passport.session());
app.use(compression());
app.use(favicon(__dirname + '/public/imgs/favicon.ico'));

// config files
var port = process.env.PORT || 3000; // set our port

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// routes ==================================================
require('./app/routes')(app, passport); // pass our application into our routes

// start app ===============================================
var privateKey  = fs.readFileSync('/etc/ssl/cert.key', 'utf8');
var certificate = fs.readFileSync('/etc/ssl/cert_chain.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port);
//var httpServer = http.createServer(app);
//httpServer.listen(port);
console.log('Listening to port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app
