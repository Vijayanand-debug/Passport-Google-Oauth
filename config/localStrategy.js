const mongoose= require("mongoose");
const passport= require("passport");
const bcrypt= require("bcryptjs");
const localStrategy= require("passport-local").Strategy;

const User= require("../schema/model");

module.exports=function(passport){
  passport.use(new localStrategy({usernameField: "email"},
                function(email, password, done) {
                     User.findOne({ email: email }, function (err, user) {
                           if (err) { return done(err); 
                           }
                           if (!user) {
                                      return done(null, false, { message: 'This email is not registered'});
                           }
                           bcrypt.compare(password,user.password,function(err,res){
                                  if( res === true){
                                                    return done(null,user);
                                  }
                                  else{
                                       return done(null,false,{msg: "Password Incorrect"});
                                 }
                          });  
                       });
                  }));
 passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
 });
});
 

}

