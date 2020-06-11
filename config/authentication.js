module.exports=function ensureAuthenticated(req,res,next){
        if(req.isAuthenticated()){
               return next();
        }
        req.flash("error_msg","You are logged out, please login again");
        res.redirect("/users/login");
        
}