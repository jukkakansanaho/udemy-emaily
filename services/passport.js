// Google OAuth: https://console.developers.google.com/apis/dashboard
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys'); // ./config/keys.js file

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});
// In callbackURI, we have two options to ensure https usage:
// 1) use exact address via dev.js/prod.js
// e.g. redirectURL: http://localhost:5000/auth/google/callback (in DEV)
// OR REDIRECT_URL = https://abc123.herokuapp.com/auth/google/callback) (in PROD)
// 2) tell GoogleStrategy via 'proxy' config variable to trust heroku proxy and use https
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        // We already have a record with given profile ID
        return done(null, existingUser); // done(<error>, <response>
      }
      // NOTE: Use keyword 'return' to ensure we return if 'existingUser' is found
      // => get rid of if-else structure

      // We don't have user with this ID, make a new record
      const user = await new User({ googleId: profile.id }).save();
      done(null, user); // If user creation to DB was OK => return done(<error>, <response>)
    }
  )
);
