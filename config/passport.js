// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User          = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

   // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                if (err) {
                  return done({error: err});
                }
                if (user) {
                  return done({error: "Um usuário com este email já existe."});
                }

                var newUser = new User();
                var account = req.body;

                newUser.local.name = account.name;
                newUser.local.surname = account.surname;
                newUser.local.email = account.email;
                newUser.local.username    = account.username;
                newUser.local.password = newUser.generateHash(account.password);

                newUser.save(function(err) {
                    if (err) {
                      throw err;
                    }
                    return done(null, newUser);
                });
            });
        });
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
      User.findOne({ 'local.email' :  email }, function(err, user) {
          if (err) {
            return done({error: err});
          }
          if (!user || !user.validPassword(password)) {
            return done({error: "Email ou senha inválida."});
          }
          return done(null, user);
      });
    }));

};
