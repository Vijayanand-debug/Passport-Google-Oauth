const express= require("express");
const router= express.Router();
const bcrypt= require("bcryptjs");
const flash= require("connect-flash");
const passport= require("passport");
const GoogleStrategy= require("passport-google-oauth2").Strategy;
const ensureAuthenticated= require("../config/authentication");
const bodyParser= require("body-parser");

//REQURING MONGOOSE MODEL
const User= require("../schema/model");

//REGISTER PAGE

router.get("/register",(req,res)=>{
   res.render("register");
});

//HANDLING REGISTER PAGE 

router.post("/register",(req,res)=>{
       const {email,password}=req.body;
       const errors=[];
    
       if(!email || !password){
                 errors.push({msg:"Please fill in all the fields"});
       }
       
       if(password.length>0 && password.length<6){
                 errors.push({msg:"Password must be atleast 6 characters"});
       }
       if(errors.length>0){
                 res.render("register",{errors,email,password});
       }else{
          User.findOne({email:email},(err,docs)=>{
            if(docs){
                     errors.push({msg:"This emai already registered, please login"}); 
                     res.render("register",{errors,email,password});               
                    }
            else{
                 bcrypt.genSalt(10,(err,salt)=>{
                        bcrypt.hash(password,salt,(err,hash)=>{
                               const newUser= new User({
                                     email,
                                     password:hash
                               });
                               newUser.save();
                               req.flash("success_msg","You are now registered and can login");
                               res.redirect("/users/login");
                       });
                 });  
            }  
       });
       } 
});    


//LOGIN PAGE

router.get("/login",(req,res)=>{
       res.render("login");
});

//HANDLING LOGIN PAGE

router.post("/login",(req,res,next)=>{
  
            passport.authenticate('local',{successRedirect: "/users/secrets",
                                      failureFlash: req.flash("error_password","Incorrect Password"),
                                      failureRedirect: "/users/login"})(req,res,next);
    
});


//SECRETS PAGE
router.get("/secrets",ensureAuthenticated,(req,res)=>{
       
    User.find({},(err,docs)=>{
             
             if(err){
                     console.log(err);
                     }
             else{
                  if(docs){
                       res.render("secrets",{userWithSecrets:docs});
                 }else{
                        res.render("secrets",{userWithSecrets: " "});
                      }
             }
    });
});

//LOGOUT PAGE 

router.get("/logout",(req,res)=>{
       req.logout();
       req.flash("success_msg","You are successfully logged out"); 
       res.redirect("/users/login");

});

//GOOGLE ROUTES

router.get('/auth/google',
  passport.authenticate('google', { scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.profile.emails.read'
]
})
);

router.get('/auth/google/callback', 
  passport.authenticate('google', {failureRedirect: '/users/login',
       successRedirect: "/users/secrets"
}));
  

//SUBMIT ROUTE

router.get("/submit",(req,res)=>{
          res.render("submit");
});

router.post("/submit",(req,res)=>{
       
       User.findById(req.user.id,(err,docs)=>{
             if(err){
                     console.log(err);
                     }
             else{
                  if(docs){
                           docs.secret= req.body.secret;
                           docs.save(function(){
                               res.redirect("/users/secrets");
                           });
                    }
             }
                            
        });
});


module.exports=router;