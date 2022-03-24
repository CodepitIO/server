"use strict";

const passport = require("passport"),
  async = require("async"),
  crypto = require("crypto");

const Errors = require("../utils/errors"),
  User = require("../../common/models/user"),
  Mailer = require("../services/mailer"),
  Redis = require("../services/dbs").redisClient;

function sendMail(type, user, res) {
  Redis.exists(`email:${type}:${user._id}`, (err, exists) => {
    if (err) return res.status(500).send();
    if (exists) return res.json(Errors.EmailSendTimelimit);
    if (!user.verifyHash) {
      user.verifyHash = crypto.randomBytes(8).toString("hex");
      user.save();
    }
    Mailer.sendMail({
      type: type,
      id: user._id,
      to: user.email,
      firstName: user.firstName,
      hash: user.verifyHash,
    });
    return res && res.json({});
  });
}

exports.edit = (req, res) => {
  let account = req.body;
  async.waterfall(
    [
      async.apply(User.findOne, { email: account.email }),
      (user, next) => {
        if (!user.validPassword(account.password)) {
          return res.json(Errors.InvalidPassword);
        }
        if (account.newPassword.length > 0) {
          user.password = user.generatePassword(account.newPassword);
        }
        user.firstName = account.firstName;
        user.lastName = account.lastName;
        return user.save(next);
      },
    ],
    (err, user) => {
      if (err) return res.status(500).send();
      return res.json(user);
    }
  );
};

exports.register = (req, res) => {
  if (req.isAuthenticated()) req.logout();
  let valid =
    User.validateChain(req)
      .seeFirstName()
      .seeLastName()
      .seeUsername()
      .seeEmail()
      .seePassword()
      .ok() && req.body.country;
  if (!valid) return res.status(400).send();
  passport.authenticate("local-signup", (err, user) => {
    if (err) return res.status(400).send();
    if (!user) return res.status(500).send();
    sendMail("register", user);
    req.logIn(user, (err) => {
      if (err) return res.status(500).send();
      return res.json(user.toObject({ virtuals: true }));
    });
  })(req, res, (err) => {
    res.status(500).send();
  });
};

exports.login = (req, res) => {
  if (req.isAuthenticated()) req.logout();
  if (User.validateChain(req).seeEmailOrUsername().seePassword().notOk()) {
    return res.status(400).send();
  }
  passport.authenticate("local-login", (err, user) => {
    if (err) return res.json(err);
    if (!user) return res.status(500).send();
    req.logIn(user, (err) => {
      if (err) return res.status(500).send();
      return res.json(req.user);
    });
  })(req, res, (err) => {
    res.status(500).send();
  });
};

exports.logout = (req, res) => {
  req.logout();
  return res.json({});
};

exports.checkUsername = (req, res) => {
  if (User.validateChain(req).seeUsername().notOk()) {
    return res.status(400).send();
  }
  let username = req.params.username || "";
  User.findOne({ username: username }, (err, user) => {
    return res.json({ available: !user });
  });
};

exports.checkEmail = (req, res) => {
  if (User.validateChain(req).seeEmail().notOk()) {
    return res.status(400).send();
  }
  let email = req.params.email || "";
  User.findOne({ email: email }, (err, user) => {
    return res.json({ available: !user });
  });
};

exports.sendPasswordRecoveryEmail = (req, res) => {
  let user = req.params.user;
  User.findOne(
    {
      $or: [{ email: user }, { username: user }],
      verified: true,
    },
    (err, user) => {
      if (err) return res.status(500).send();
      if (!user) return res.json(Errors.PasswordRecoveryFindFail);
      user.verifyHash = null;
      sendMail("recover", user, res);
    }
  );
};

exports.recover = (req, res) => {
  let hash = req.body.hash;
  if (!User.validateChain(req).seePassword().ok())
    return res.status(400).send();
  let user;
  async.waterfall(
    [
      (next) => {
        User.findOne({ verifyHash: hash }, next);
      },
      (user, next) => {
        if (!user) return res.status(400).send();
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
    (err) => {
      return res.status(500).send();
    }
  );
};

exports.sendValidationEmail = (req, res) => {
  if (req.user.verified) return res.status(400).send();
  Redis.exists(`email:register:${req.user._id}`, (err, exists) => {
    if (err) return res.status(500).send();
    if (exists) return res.json(Errors.EmailSendTimelimit);
    sendMail("register", req.user, res);
  });
};

exports.validate = (req, res) => {
  let hash = req.params.hash;
  async.waterfall(
    [
      (next) => {
        User.findOne({ verifyHash: hash, verified: false }, next);
      },
      (user, next) => {
        if (!user) return res.status(400).send();
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
    (err) => {
      return res.status(500).send();
    }
  );
};

exports.get = async (req, res) => {
  return res.json(req.user);
};

exports.status = (req, res) => {
  if (req.user && req.user._id) {
    req.user.lastAccess = new Date();
    req.user.save();
    return res.json({ user: req.user.toObject({ virtuals: true }) });
  }
  return res.json({});
};
