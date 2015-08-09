// app/models/problem.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var problemSchema = mongoose.Schema({
  id: String,
  name: String,
  oj: String,
  url: String,
  fullName: String
});

problemSchema.statics.filterProblems = function(pattern, page_limit, callback) {
  this.find({
      "fullName": new RegExp(pattern, "i")
    },
    'fullName url',
    { limit: page_limit },
    callback
  );
}

// create the model for users and expose it to our app
module.exports = mongoose.model('Problem', problemSchema);
