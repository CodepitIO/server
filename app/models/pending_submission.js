// app/models/pending_submission.js
// load the things we need
var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

// define the schema for our user model
var pendingSubmissionSchema = mongoose.Schema({
  problemId: String,
  problemOj: String,
  code: String,
  language: String,
  originalId: {type: ObjectId, ref: 'Submission'}
});
pendingSubmissionSchema.set('autoIndex', false);

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('PendingSubmission', pendingSubmissionSchema);
