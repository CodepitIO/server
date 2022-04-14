"use strict";

const ConnectRoles = require("connect-roles");

const ACCESS = require("../../common/constants").SITE_VARS.ACCESS;

let user = new ConnectRoles({
  failureHandler: (req, res, action) => {
    return res.status(403).json({ redirectTo: `/` });
  },
});

user.use((req) => {
  if (req.isAuthenticated() && (req.user.access || 0) >= ACCESS.ADMIN)
    return true;
});

user.use("logged", (req, res) => {
  return req.isAuthenticated();
});

user.use("logged-off", (req) => {
  return !req.isAuthenticated();
});

user.use("admin", (req) => {
  return req.isAuthenticated() && (req.user.access || 0) >= ACCESS.ADMIN;
});

module.exports = user;
