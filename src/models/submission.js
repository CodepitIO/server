// load the things we need
var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

// define the schema for our user model
var submissionSchema = mongoose.Schema({
  contest: {type: ObjectId, ref: 'Contest', index: true},
  contestant: {type: ObjectId, ref: 'User'},

  problem: {type: ObjectId, ref: 'Problem'},
  code: String,
  language: String,

  date: {type: Date, default: Date.now},
  verdict: {type: Number, default: 0},
  oj_id: {type: Number, default: -1}
});
submissionSchema.set('autoIndex', false);

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('Submission', submissionSchema);
