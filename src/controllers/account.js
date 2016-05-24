'use strict';

const passport = require('passport');

const User = require('../models/user'),
      Util = require('../utils/functions');

function remapUser(elem) {
  if (!elem) return null;
  var fullName = elem.local.name + ' ' + elem.local.surname;
  var obj = {
    id: elem._id,
    username: elem.local.username,
    email: elem.local.email,
    name: fullName,
    url: Util.getProfilePicURL(elem.local.email, 140)
  };
  //console.log(obj);
  return obj;
}

exports.remapUser = remapUser;

exports.getUserDataByEmail = function(email, callback) {
  User.findOne({
    'local.email': email
  })
  .lean()
  .exec()
  .then(function(user) {
    return callback(remapUser(user));
  });
}

exports.edit = function(req, res, next) {
  var account = req.body;
  if (account.newPassword.length > 0) {
      if (account.newPassword.length > 50) {
          return res.json({error: "Sua senha nova deve ter no máximo 50 caracteres."});
      }
      if (account.newPassword != account.confirmNewPassword) {
          return res.json({error: "Sua senha nova não foi confirmada corretamente."});
      }
  }
  if (account.username.length < 1 || account.username.length > 30) {
      return res.json({error: "Seu nome de perfil deve ter entre 1 e 30 caracteres."});
  }
  if (account.surname.length > 100 || account.name.length > 100) {
      return res.json({error: "Seu nome e sobrenome não podem ultrapassar 100 caracteres."});
  }
  User.findOne({ 'local.email' :  account.email }, function(err, user) {
    if (!user.validPassword(account.password)) {
      return res.json({error: "Senha inválida."});
    }
    if (account.newPassword.length > 0) {
      user.local.password = user.generateHash(account.newPassword);
    }
    user.local.username = account.username;
    user.local.name = account.name;
    user.local.surname = account.surname;
    user.save(function(err, user) {
      if (err) {
        return res.json({error: "Erro desconhecido."});
      }
      return res.json(user);
    });
  });
}

exports.register = (req, res) => {
  passport.authenticate('local-signup', (err, user) => {
    req.logIn(user, function(err) {
      if (err) return res.json({error: err});
      return res.json(req.user);
    });
  })(req, res, (err) => {
    res.json(err);
  });
}

exports.login = (req, res) => {
  if (req.isAuthenticated()) {
    req.logout();
  }
  passport.authenticate('local-login', function(err, user) {
    if (err) return res.json(err);
    if (!user) return res.json({error: 'E-mail ou senha inválidos.'});
    req.logIn(user, function(err) {
      if (err) return res.json({error: err});
      return res.json(req.user);
    });
  })(req, res, function(err) {
    res.json(err);
  });
}

exports.logout = (req, res) => {
  req.logout();
  return res.json({});
}
