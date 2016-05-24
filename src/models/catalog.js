var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var catalogSchema = mongoose.Schema({
  contestant: {type: ObjectId, index: true},
  contest: {type: ObjectId, ref: 'Contest'},

  data: {type: mongoose.Schema.Types.Mixed}
});
catalogSchema.set('autoIndex', false);

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('Catalog', catalogSchema);
