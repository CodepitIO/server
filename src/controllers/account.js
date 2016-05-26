'use strict';

const passport = require('passport');

const User = require('../models/user');

exports.remapUser = (user) => {
	if (!user) return null;
	return {
		id: user._id,
		username: user.local.username,
		email: user.local.email,
		emailHash: user.local.emailHash,
		name: user.local.fullName
	};
}

exports.getUserDataByEmail = function(email, callback) {
	User.findOne({
		'local.email': email
	}, (user) => {
		return callback(exports.remapUser(user));
	});
}

exports.edit = function(req, res, next) {
	var account = req.body;
	if (account.newPassword.length > 0) {
		if (account.newPassword.length > 50) {
			return res.json({
				error: "Sua senha nova deve ter no máximo 50 caracteres."
			});
		}
		if (account.newPassword != account.confirmNewPassword) {
			return res.json({
				error: "Sua senha nova não foi confirmada corretamente."
			});
		}
	}
	if (account.username.length < 1 || account.username.length > 30) {
		return res.json({
			error: "Seu nome de perfil deve ter entre 1 e 30 caracteres."
		});
	}
	if (account.surname.length > 100 || account.name.length > 100) {
		return res.json({
			error: "Seu nome e sobrenome não podem ultrapassar 100 caracteres."
		});
	}
	User.findOne({
		'local.email': account.email
	}, function(err, user) {
		if (!user.validPassword(account.password)) {
			return res.json({
				error: "Senha inválida."
			});
		}
		if (account.newPassword.length > 0) {
			user.local.password = user.generateHash(account.newPassword);
		}
		user.local.username = account.username;
		user.local.name = account.name;
		user.local.surname = account.surname;
		user.save(function(err, user) {
			if (err) res.status(500).send();
			return res.json(user);
		});
	});
}

exports.register = (req, res) => {
	passport.authenticate('local-signup', (err, user) => {
		if (err) return res.json(err);
		req.logIn(user, (err) => {
			if (err) return res.status(500).send();
			return res.json(req.user);
		});
	})(req, res, (err) => {
		res.status(500).send();
	});
}

exports.login = (req, res) => {
	if (req.isAuthenticated()) req.logout();
	passport.authenticate('local-login', function(err, user) {
		if (err) return res.json(err);
		req.logIn(user, (err) => {
			if (err) return res.status(500).send();
			return res.json(req.user);
		});
	})(req, res, (err) => {
		res.status(500).send();
	});
}

exports.logout = (req, res) => {
	req.logout();
	return res.json({});
}
