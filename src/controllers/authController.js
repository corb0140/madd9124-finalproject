const authService = require("../services/authService");

const googleCallback = (req, res) => {
  const { state } = req.query;

  const { redirect_url } = state
    ? JSON.parse(Buffer.from(state, "base64").toString())
    : {};

  const token = authService.generateToken(req.user._id);

  res.redirect(`${redirect_url ?? "/"}?token=${token}`);
};

module.exports = {
  googleCallback,
};
