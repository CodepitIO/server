// app/models/post.js
// load the things we need
var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

// define the schema for our user model
var articleSchema = mongoose.Schema({
  author: {type: ObjectId, ref: 'User'},
  title: String,
  date: {type: Date, default: Date.now},

  body: String,
  tags: [String]
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('Article', articleSchema);
