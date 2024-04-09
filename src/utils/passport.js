const jwt = require("jsonwebtoken");
const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;
const GoogleStrategy = require("passport-google-oauth20");

const User = require("../models/user");
const { UnauthenticatedError } = require("../middlewares/errors");

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  JWT_SECRET,
} = process.env;

passport.use(
  new BearerStrategy(async function (token, done) {
    try {
      const decodedToken = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decodedToken.id);
      if (!user) {
        throw new UnauthenticatedError("Please sign in");
      }
      done(null, user);
    } catch (error) {
      done(new UnauthenticatedError("Please sign in"));
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await User.findOneAndUpdate(
          { googleId: profile.id },
          {
            $set: {
              name: profile.displayName,
              googleId: profile.id,
            },
          },

          { upsert: true, new: true }
        );
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
