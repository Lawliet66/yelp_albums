import express from 'express'
import Album from '../models/album.js';
import List from '../models/list.js'
import isLoggedIn from '../utils/isLoggedIn.js'
import checkCommentOwner from '../utils/checkCommentOwner.js'
const router = express.Router({mergeParams:true});


router.get("/new", isLoggedIn,(req,res)=>{
    res.render("lists_new.ejs")
})

router.post("/", isLoggedIn, async(req,res)=>{
    try{
        const list= await  List.create({
            owner:{
                id:req.user._id,
                username:req.user.username
            },
            Name:req.body.title,
            Description: req.body.text
        })
        req.flash("success", "List created")
         res.redirect(`/profile/${req.user.username}`)
    }
    catch(err){
        req.flash("error","Error creating comment")
        res.send("Error can't post comment")
    }
})
export default router;