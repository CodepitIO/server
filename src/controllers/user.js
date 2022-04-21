const passport = require(`passport`);
const async = require(`async`);

const crypto = require(`crypto`);

const Errors = require(`../utils/errors`);
const User = require(`../../common/models/user`);
const Mailer = require(`../services/mailer`);

const Redis = require(`../services/dbs`).redisClient;

function sendMail(type, user, res) {
  Redis.exists(`email:${type}:${user._id}`, (err, exists) => {
    if (err) return res.sendStatus(500);
    if (exists) return res.json(Errors.EmailSendTimelimit);
    if (!user.verifyHash) {
      user.verifyHash = crypto.randomBytes(8).toString(`hex`);
      user.save();
    }
    Mailer.sendMail({
      type,
      id: user._id,
      to: user.email,
      firstName: user.firstName,
      hash: user.verifyHash,
    });
    return res && res.json({});
  });
}

exports.changePassword = async (req, res) => {
  try {
    const account = req.body;
    const user = await User.findById(req.user._id);
    if (!user.validPassword(account.password)) {
      return res.json(Errors.InvalidPassword);
    }
    if (account.newPassword.length < 6) {
      return res.sendStatus(400);
    }
    user.password = User.generatePassword(account.newPassword);
    await user.save();
    return res.json(user);
  } catch (err) {
    return res.sendStatus(500);
  }
};

exports.edit = async (req, res) => {
  try {
    const account = req.body;
    const user = await User.findById(req.user._id);
    user.firstName = account.firstName;
    user.lastName = account.lastName;
    user.country = account.country;
    await user.save();
    delete user.password;
    return res.json(user);
  } catch (err) {
    return res.sendStatus(500);
  }
};

exports.register = (req, res) => {
  if (req.isAuthenticated()) req.logout();
  const valid =
    User.validateChain(req)
      .seeFirstName()
      .seeLastName()
      .seeUsername()
      .seeEmail()
      .seePassword()
      .ok() && req.body.country;
  if (!valid) return res.sendStatus(400);
  passport.authenticate(`local-signup`, (err, user) => {
    if (err) return res.status(200).json(err);
    if (!user) return res.sendStatus(500);
    sendMail(`register`, user);
    req.logIn(user, (err) => {
      if (err) return res.sendStatus(500);
      return res.json(user.toObject({ virtuals: true }));
    });
  })(req, res, (err) => {
    res.sendStatus(500);
  });
};

exports.login = (req, res) => {
  if (req.isAuthenticated()) req.logout();
  if (User.validateChain(req).seeEmailOrUsername().seePassword().notOk()) {
    return res.sendStatus(400);
  }
  passport.authenticate(`local-login`, (err, user) => {
    if (err) return res.json(err);
    if (!user) return res.sendStatus(500);
    req.logIn(user, (err) => {
      if (err) return res.sendStatus(500);
      return res.json(req.user);
    });
  })(req, res, (err) => {
    res.sendStatus(500);
  });
};

exports.logout = (req, res) => {
  req.logout();
  return res.json({});
};

exports.checkAvailableUsernameOrEmail = async (req, res) => {
  const usernameOrEmail = req.params.usernameOrEmail || ``;
  try {
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    return res.status(200).json({ available: !user });
  } catch (err) {
    return res.sendStatus(500);
  }
};

exports.sendPasswordRecoveryEmail = (req, res) => {
  const { user } = req.params;
  User.findOne(
    {
      $or: [{ email: user }, { username: user }],
      verified: true,
    },
    (err, user) => {
      if (err) return res.sendStatus(500);
      if (!user) return res.json(Errors.PasswordRecoveryFindFail);
      user.verifyHash = null;
      sendMail(`recover`, user, res);
    }
  );
};

exports.recover = (req, res) => {
  const { hash } = req.body;
  if (!User.validateChain(req).seePassword().ok()) return res.sendStatus(400);
  let user;
  async.waterfall(
    [
      (next) => {
        User.findOne({ verifyHash: hash }, next);
      },
      (user, next) => {
        if (!user) return res.sendStatus(400);
        Redis.exists(`email:recover:${user._id}`, (err, exists) => {
          if (err) return next(err);
          if (!exists) return res.json(Errors.EmailRecoverExpired);
          user.verifyHash = null;
          user.password = User.generatePassword(req.body.password);
          user.save(next);
        });
      },
      (user, next) => {
        req.logIn(user, (err) => {
          if (err) return next(err);
          return res.json(user.toObject({ virtuals: true }));
        });
      },
    ],
    (err) => res.sendStatus(500)
  );
};

exports.sendValidationEmail = (req, res) => {
  if (req.user.verified) return res.sendStatus(400);
  Redis.exists(`email:register:${req.user._id}`, (err, exists) => {
    if (err) return res.sendStatus(500);
    if (exists) return res.json(Errors.EmailSendTimelimit);
    sendMail(`register`, req.user, res);
  });
};

exports.validate = (req, res) => {
  const { hash } = req.params;
  async.waterfall(
    [
      (next) => {
        User.findOne({ verifyHash: hash, verified: false }, next);
      },
      (user, next) => {
        if (!user) return res.sendStatus(400);
        user.verified = true;
        user.save(next);
      },
      (user, next) => {
        if (req.isAuthenticated()) req.logout();
        req.logIn(user, (err) => {
          if (err) return next(err);
          return res.json(user.toObject({ virtuals: true }));
        });
      },
    ],
    (err) => res.sendStatus(500)
  );
};

exports.get = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ redirectTo: `/` });
  }
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ redirectTo: `/profile` });
    }
    delete user.password;
    delete user.updatedAt;
    delete user.updatedAt;
    return res.json(user);
  } catch (err) {
    return res.sendStatus(500);
  }
};

exports.tryGetByLoggedUser = async (req, res) => {
  const id = req.user?._id;
  if (!id) {
    return res.send();
  }
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400);
    }
    delete user.password;
    delete user.updatedAt;
    return res.json(user);
  } catch (err) {
    return res.sendStatus(500);
  }
};

exports.status = (req, res) => {
  if (req.user && req.user?._id) {
    req.user.lastAccess = new Date();
    req.user.save();
    return res.json({ user: req.user.toObject({ virtuals: true }) });
  }
  return res.json({});
};
