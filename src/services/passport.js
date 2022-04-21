const crypto = require(`crypto`);
const LocalStrategy = require(`passport-local`).Strategy;

const User = require(`../../common/models/user`);
const Errors = require(`../utils/errors`);

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, done);
  });

  passport.use(
    `local-signup`,
    new LocalStrategy(
      {
        usernameField: `email`,
        passwordField: `password`,
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        const account = req.body;
        User.findOne(
          {
            $or: [{ email: account.email }, { username: account.username }],
          },
          (err, user) => {
            if (err) return done();
            if (user) return done(Errors.EmailOrUsernameAlreadyExists);

            user = new User({
              firstName: account.firstName,
              lastName: account.lastName,
              username: account.username,
              email: account.email,
              country: account.country,
              password: User.generatePassword(account.password),
            });
            user.save(done);
          }
        );
      }
    )
  );

  passport.use(
    `local-login`,
    new LocalStrategy(
      {
        usernameField: `emailOrUsername`,
        passwordField: `password`,
        passReqToCallback: true,
      },
      (req, emailOrUsername, password, done) => {
        User.findOne(
          {
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
          },
          (err, user) => {
            if (err) return done();
            if (!user || !user.validPassword(password)) {
              return done(Errors.InvalidEmailOrPassword);
            }
            user.lastAccess = new Date();
            return user.save((err, user) => {
              done(null, user.toObject({ virtuals: true }));
            });
          }
        );
      }
    )
  );
};
