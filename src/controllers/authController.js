const authService = require("../services/authService");

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const token = await authService.login(username, password);

    res.json({
      data: {
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const token = await authService.register(username, password);

    res.json({
      data: {
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

const googleCallback = (req, res) => {
  const { state } = req.query;

  const { redirect_url } = state
    ? JSON.parse(Buffer.from(state, "base64").toString())
    : {};

  const token = authService.generateToken(req.user._id);

  res.redirect(`${redirect_url ?? "/"}?token=${token}`);
};

module.exports = {
  login,
  register,
  googleCallback,
};
