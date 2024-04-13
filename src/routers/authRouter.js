const { Router } = require("express");
const passport = require("passport");

const authController = require("../controllers/authController");

const authRouter = Router();

authRouter.get(
  "/google?redirect_url='http://localhost:3000",
  (req, res, next) => {
    const { redirect_url } = req.query;

    const state = redirect_url
      ? Buffer.from(JSON.stringify({ redirect_url })).toString("base64")
      : undefined;

    return passport.authenticate("google", { scope: ["profile"], state })(
      req,
      res,
      next
    );
  }
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/fail", session: false }),
  authController.googleCallback
);

module.exports = authRouter;
