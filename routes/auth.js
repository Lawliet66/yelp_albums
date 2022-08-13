import express from 'express'
const router = express.Router({mergeParams:true});
import User from '../models/user.js'
import passport from 'passport'

//Sign up

router.get("/signup",(req,res)=>{
    res.render('signup.ejs')
})

router.post("/signup", async (req,res)=>{
    try{
        const newUser = await User.register(new User({username:req.body.username, email:req.body.email}),req.body.password)
 
        passport.authenticate('local')(req,res,()=>{
            res.redirect('/albums')
        })
      
    }
    catch(err){
        console.log(err)
        res.send(err)
    }
})

//Log In

router.get("/login",(req,res)=>{
    res.render('login.ejs')
})

router.post("/login", passport.authenticate('local',{
    successRedirect:'/albums',
    failureRedirect:'/login',
    failureFlash: true,
    successFlash: true
}))

//Log Out

router.get("/logout", (req, res,err) => {
    req.logout(err => {
      if(err) return next(err);
      res.redirect("/albums");
    });
  });

export default router