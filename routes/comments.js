import express from 'express'
import Album from '../models/album.js';
import Comment from '../models/comment.js'
import isLoggedIn from '../utils/isLoggedIn.js'
import checkCommentOwner from '../utils/checkCommentOwner.js'
const router = express.Router({mergeParams:true});

router.get("/new",isLoggedIn,(req,res)=>{
    res.render("comments_new.ejs",{albumId:req.params.id})
})

router.post("/", isLoggedIn,async (req,res)=>{
  
    try{
        const comment= await  Comment.create({
            user:{
                id:req.user._id,
                username:req.user.username
            },
            text:req.body.text,
            albumId: req.body.albumId
        })
         res.redirect(`/albums/${req.body.albumId}`)
    }
    catch(err){
        console.log(err)
        res.send("Error can't post comment")
    }
})

router.get("/:commentId/edit", checkCommentOwner, isLoggedIn,async(req,res)=>{
    try{
            //const album = await Album.findById(req.params.id).exec()
            const comment = await Comment.findById(req.params.commentId).exec()
            console.log(comment)
            res.render("comments_edit.ejs",{albumId: req.params.id,comment})
    }
    catch(err){
        console.log(err)
        res.send("Error comment edit")
    }
})

router.put("/:commentId", checkCommentOwner,isLoggedIn,async(req,res)=>{
    try{
const commentUpdated = await Comment.findByIdAndUpdate(req.params.commentId, {text :req.body.text}, {new:true})
res.redirect(`/albums/${req.params.id}`)
    }
    catch(err){
console.log(err)
res.send("Updating comment error")
    }
})

router.delete("/:commentId", checkCommentOwner,isLoggedIn, async(req,res)=>{
    try{
        const deletedComment = await Comment.findByIdAndDelete(req.params.commentId).exec()
        res.redirect(`/albums/${req.params.id}`)
    }
    catch(err){
        console.log(err)
        res.send("Error comment delete")
    }
})


export default router