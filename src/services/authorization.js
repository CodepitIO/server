'use strict';

const ConnectRoles = require('connect-roles')

const ACCESS = require('../config/constants').ACCESS

let user = new ConnectRoles({
  failureHandler: (req, res, action) => {
    if (action === 'admin') return res.redirect('/')
    return res.status(403).send()
  }
})

user.use((req) => {
  if (req.isAuthenticated() && (req.user.access || 0) >= ACCESS.ADMIN) return true
})

user.use('logged', (req) => {
  return req.isAuthenticated()
})

user.use('admin', (req) => {
  return req.isAuthenticated() && (req.user.access || 0) >= ACCESS.ADMIN
})

module.exports = user
