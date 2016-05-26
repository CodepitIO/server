// load the things we need
var mongoose = require('mongoose');
var functions = require('../utils/functions');

var _ = require('underscore');

var Submission = require('./submission');

var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Schema.Types.Mixed;

// define the schema for our user model
// TODO endureIndex on Date
var contestSchema = mongoose.Schema({
  name: String,
  description: String,

  author: {type: ObjectId, ref: 'User'},

  date_start: Date,
  date_end: Date,

  frozen_time: Date,
  blind_time: Date,

  problems: [{type: ObjectId, ref: 'Problem'}],

  contestants: [{
    id: {type: ObjectId, ref: 'User'},
    isIndividual: {type: Boolean, default: true},
    team: {type: ObjectId, ref: 'Team'}
  }],

  contestantType: {type: Number, default: 3},
  password: {type: String, default: ""},
  isPrivate: {type: Boolean, default: false},
  watchPrivate: {type: Boolean, default: false}
}, {
  timestamps: true
});

// TODO(stor): ensure this only gets called once in production
contestSchema.index({date_start: -1});
contestSchema.index({date_end: -1});
contestSchema.index({author: 1, createdAt: -1});

// methods ======================
contestSchema.methods.userInContest = function(id) {
  if (!id) return false;
  var index = _.findIndex(this.contestants, function(obj) {
    return obj.id && obj.id.toString() === id.toString();
  });
  return index !== -1;
}

contestSchema.methods.problemInContest = function(id) {
  if (!id) return false;
  var index = _.findIndex(this.problems, function(obj) {
    return obj.toString() === id.toString();
  });
  return index !== -1;
}

// create the model for users and expose it to our app
module.exports = mongoose.model('Contest', contestSchema);
