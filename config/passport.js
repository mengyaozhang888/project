const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User");

module.exports = (passport) => {
  //defining the local strategy for email and password authentication
  passport.use(
    "local",
    new localStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          //find the user
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: "User not found" });
          } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
              return done(null, false, { message: "Incorrect password" });
            }
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  //serializing the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  //deserializing the user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
