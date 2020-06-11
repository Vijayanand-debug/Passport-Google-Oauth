require("dotenv").config();
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const mongoose= require("mongoose");
const findOrCreate= require("mongoose-findorcreate");

const User= require("../schema/model");

module.exports= function(passport){
 passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/users/auth/google/callback",
    passReqToCallback: true
    },
  function(request,accessToken, refreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
 ));

 passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
 });
});

}