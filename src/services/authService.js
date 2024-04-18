const jwt = require("jsonwebtoken");

const generateToken = (_id) =>
  jwt.sign({ id: _id.toString() }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "7 days",
  });

module.exports = {
  generateToken,
};
