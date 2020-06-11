require("dotenv").config();
const express= require("express");
const ejs= require("ejs");
const mongoose= require("mongoose");
const bodyParser= require("body-parser");
const session= require("express-session");
const flash= require("connect-flash");
const passport= require("passport");
const app=express();
const GoogleStrategy= require("passport-google-oauth2").Strategy;
const findOrCreate= require("mongoose-findorcreate");
 

app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/oauth', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(session({
       secret: process.env.VAR,
       saveUninitialized: true,
       resave: true

}));

app.use(passport.initialize());
app.use(passport.session());


require("./config/localStrategy")(passport);
require("./config/googleStrategy")(passport);


app.use(flash());

//creating global variables middleware, so that we can access them anywhere

app.use((req,res,next)=>{
    res.locals.success_msg= req.flash("success_msg");
    res.locals.error_msg= req.flash("erorr_msg");
    res.locals.error_password=req.flash("error_password");
    next();
});

app.use("/",require("./routes/home"));
app.use("/users",require("./routes/user")); 


const PORT= process.env.PORT||3000

app.listen(PORT,function(){
    console.log("The server is up and running on " + PORT);
});