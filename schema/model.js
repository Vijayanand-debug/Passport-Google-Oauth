const mongoose= require("mongoose");
const findOrCreate= require("mongoose-findorcreate");

const userSchema= new mongoose.Schema({

       email: String,
       password: String,
       googleId: String,
       secret: String
});

userSchema.plugin(findOrCreate);  //(since findOrCreate is pseudo code)

const User= mongoose.model("User", userSchema);

module.exports= User;