'use strict';

const mongoose = require('mongoose');

let ojAccountSchema = mongoose.Schema({
  user: String,
  pass: String,
  type: String,
  id: String,
  accessKey: String,
});
ojAccountSchema.set('autoIndex', false);

ojAccountSchema.methods.getUser = () => {
  return this.user;
}
ojAccountSchema.methods.getPass = () => {
  return this.pass;
}
ojAccountSchema.methods.getType = () => {
  return this.type;
}
ojAccountSchema.methods.getId = () => {
  return this.id;
}
ojAccountSchema.methods.getAccessKey = () => {
  return this.accessKey;
}

module.exports = mongoose.model('OjAccount', ojAccountSchema);
