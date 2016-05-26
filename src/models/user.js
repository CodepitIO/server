'use strict';

const mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
	crypto = require('crypto');

const Team = require('./team');

// define the schema for our user model
var userSchema = mongoose.Schema({
	local: {
		name: String,
		surname: String,
		email: String,
		password: String,
		username: String
	},
	flags: {
		type: Number,
		default: 0
	}
});

// methods ======================
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.countEmptyTeam = function() {
	return Team.count({
		admin: this,
		members: {
			$size: 1
		},
		invites: {
			$size: 0
		}
	});
}

userSchema.virtual('local.fullName').get(function() {
	return `${this.local.name} ${this.local.surname}`;
});

userSchema.virtual('local.emailHash').get(function() {
	return crypto.createHash('md5').update(this.local.email.toLowerCase()).digest('hex');
});

module.exports = mongoose.model('User', userSchema);
