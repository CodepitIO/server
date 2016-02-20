'use strict';

const mongoose = require('mongoose'),
      fs = require('fs');

// define the schema for our user model
var problemSchema = mongoose.Schema({
  id: String,
  id2: String,
  name: String,
  oj: String,
  url: String,
  fullName: String,
  level: Number,
  tags: [String],
  imported: {type: Boolean, default: false},
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

// create the model for problems and expose it to our app
module.exports = mongoose.model('Problem', problemSchema);
