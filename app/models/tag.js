// load the things we need
var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

// define the schema for our user model
var tagSchema = mongoose.Schema({
  author: {type: ObjectId, ref: 'User'},
  name: String,
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('Tag', tagSchema);
