const passport = require("passport");
const { UnauthenticatedError } = require("./errors");

const isAuthenticated = (req, res, next) => {
  passport.authenticate("bearer", { session: false, failWithError: true })(
    req,
    res,
    (err) => {
      if (err) {
        next(new UnauthenticatedError("Please sign in"));
        return;
      }

      next();
    }
  );
};

module.exports = isAuthenticated;
