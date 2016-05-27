// load the things we need
var mongoose = require('mongoose')

var ObjectId = mongoose.Schema.Types.ObjectId

// define the schema for our user model
var teamSchema = mongoose.Schema({
  name: String,
  description: String,

  date_created: {
    type: Date,
    default: Date.now
  },

  members: [{
    type: ObjectId,
    ref: 'User'
  }],
  invites: [{
    type: ObjectId,
    ref: 'User'
  }],
  admin: {
    type: ObjectId,
    ref: 'User'
  }
})

// utils ========================
var filterById = function (id, elem) {
  return elem.toString() == id.toString()
}

// methods ======================
teamSchema.methods.isAdmin = function (id) {
  return this.admin.toString() == id.toString()
}

teamSchema.methods.getAllCount = function () {
  return this.members.length + this.invites.length
}

teamSchema.methods.hasUser = function (id) {
  return (this.members.filter(filterById.bind(null, id)).length +
  this.invites.filter(filterById.bind(null, id)).length) > 0
}

teamSchema.methods.hasMember = function (id) {
  return this.members.filter(filterById.bind(null, id)).length
}

teamSchema.methods.isInvited = function (id) {
  return this.invites.filter(filterById.bind(null, id)).length > 0
}

// create the model for users and expose it to our app
module.exports = mongoose.model('Team', teamSchema)
