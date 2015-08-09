// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Team   = require('./team');

// define the schema for our user model
var userSchema = mongoose.Schema({
    local            : {
        name         : String,
        surname      : String,
        email        : String,
        password     : String,
        username     : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    flags: {type: Number, default: 0}
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// checking how many teams with 1 member it owns
userSchema.methods.countEmptyTeam = function() {
    return Team.count({
        admin: this,
        members: {$size: 1},
        invites: {$size: 0}
    });
}

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
