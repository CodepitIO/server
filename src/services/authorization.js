const ConnectRoles = require(`connect-roles`);

const ADMIN_ACCESS = 10;

const UserACL = {
  UserStateHandlerFn: {},
  use: (state, fn) => {
    UserACL.UserStateHandlerFn[state] = fn;
  },
  is: (state) => (req, res, next) => {
    if (UserACL.UserStateHandlerFn[state](req, res)) {
      return next();
    }
    return res.status(403).json({ redirectTo: `/` });
  },
};

UserACL.use(`logged`, (req, res) => req.isAuthenticated());
UserACL.use(`logged-off`, (req) => !req.isAuthenticated());
UserACL.use(
  `admin`,
  (req) => req.isAuthenticated() && (req.user.access || 0) >= ADMIN_ACCESS
);

export default UserACL;
