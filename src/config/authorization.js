const mustBe = require("mustbe");

module.exports = (config) => {
  config.routeHelpers((rh) => {
    rh.getUser((req, next) => {
      next(null, req.user);
    });
    rh.notAuthorized((req, res, next) => {
      return res.status(401).send();
    });
  });

  config.activities((activities) => {
    activities.can("post", (user, params, done) => {
      return done(true);
    });
  });
};
