// app/models/contest.js
// load the things we need
var mongoose = require('mongoose');
var functions = require('../utils/functions');
var moment = require('moment');

var _ = require('underscore');

var Submission = require('./submission');

var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Schema.Types.Mixed;

// define the schema for our user model
// TODO endureIndex on Date
var contestSchema = mongoose.Schema({
  name: String,
  description: String,
  date_created: {type: Date, default: Date.now},

  author: {type: ObjectId, ref: 'User'},

  date_start: Date,
  date_end: Date,

  frozen_time: Date,
  blind_time: Date,

  problems: [{type: ObjectId, ref: 'Problem'}],

  individualContestants: [{type: ObjectId, ref: 'User'}],
  teamContestants: [{type: ObjectId, ref: 'Team'}],
  contestants: [{
    id: {type: ObjectId, ref: 'User'},
    isIndividual: {type: Boolean, default: true},
    team: {type: ObjectId, ref: 'Team'}
  }],

  contestantType: {type: Number, default: 3},
  password: {type: String, default: ""},
  isPrivate: {type: Boolean, default: false},
  watchPrivate: {type: Boolean, default: false}
});


// methods ======================
contestSchema.methods.inContest = function(id) {
  if (!id) return false;
  var index = _.findIndex(this.contestants, function(obj) {
    return obj.id && obj.id.toString() == id.toString();
  });
  if (index != -1) return true;
  return false;
}

// create the model for users and expose it to our app
module.exports = mongoose.model('Contest', contestSchema);
