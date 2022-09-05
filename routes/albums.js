import express from 'express'
import Album from '../models/album.js'
import Comment from '../models/comment.js'
import isLoggedIn from '../utils/isLoggedIn.js'
import checkAlbumOwner from '../utils/checkAlbumOwner.js'
const router = express.Router();

router.get("/", async (req,res)=>{
   // console.log(req.user)
    try{
    const foundAlbums= await Album.find().exec()
    res.render("albums.ejs",{albums:foundAlbums})
    }
    catch(err){
        console.log(err)
    }
 
})

router.post("/", isLoggedIn, async (req,res)=>{
   const genre = req.body.genre.toLowerCase()
    const newAlbum={
        title: req.body.title,
        description: req.body.description,
        artist: req.body.artist,
        trackListLength: req.body.trackListLength,
        notableTracks:req.body.notableTracks,
        recordLabel: req.body.recordLabel,
        date : req.body.date,
        genre: genre,
        image : req.body.image,
        owner:{
            id:req.user._id,
            username:req.user.username
        },
        upvotes:[req.user.username],
        downvotes:[]
    }
    try{
    const createdAlbum = await Album.create(newAlbum)
    req.flash("success","Album created")
    res.redirect("/albums/" +createdAlbum._id)
    }
    catch(err){
        req.flash("error","Error creating album")
        res.redirect("/albums")
    }
    
   
 
})

router.get("/new",isLoggedIn,(req,res)=>{
    res.render("albums_new.ejs")
})


router.get("/search",async (req,res)=>{
    try{
        const albums = await Album.find({
            $text:{
                $search:req.query.term
            }
        })
        res.render("albums.ejs",{albums})
    }
    catch(err){
        console.log(err)
        res.send("Error search not working")
    }
})

router.get("/genre/:genreName", async(req,res)=>{
    
    
    const validGenres =["alternative-indie","punk","rnb","garage rock","grunge","nu metal","pop"]
    if(validGenres.includes(req.params.genreName.toLowerCase())){
        const albums = await Album.find({genre:req.params.genreName}).exec()
        res.render("albums.ejs",{albums})
    }
    else[
        res.send("Please enter a valid genre")
    ]
})



router.post("/favorites",isLoggedIn, async(req,res)=>{
    const user = await req.user
    const album = await Album.findById(req.body.albumId)
    console.log(user.username)
    console.log(album._id)
    console.log(user.favorites)
    const inFavorites = user.favorites.findIndex(item=>item.favid===album._id.toString())
   // console.log(inFavorites)
    let response={}
    if(inFavorites===-1){
        user.favorites.push({favid:album._id.toString(),image:album.image,title:album.title})
        user.save()
        response ={message:"Added to favorites", code:1}
        console.log(user.favorites)
    }
    else if(inFavorites>=0){
        user.favorites.splice(inFavorites,1) 
        user.save()
        response ={message:"Removed from favorites", code:0}
        console.log(user.favorites)
        console.log("removed")
    }
    else{
        response ={message:"Error", code:-1}
    }
    res.json(
        response
    )
})

router.post("/vote",isLoggedIn, async (req,res)=>{
   
    const album = await Album.findById(req.body.albumId)
    const alreadyUpvoted = album.upvotes.indexOf(req.user.username)
    const alreadyDownvoted = album.downvotes.indexOf(req.user.username)

    let response ={}
    if(alreadyUpvoted ===-1 && alreadyDownvoted ===-1){
        if(req.body.voteType ==='up'){
            album.upvotes.push(req.user.username)
            album.save()
            response = {message:"Upvote Tallied",code:1}
        }
        else if(req.body.voteType==='down'){
            album.downvotes.push(req.user.username)
            album.save()
            response = {message:"Downvote Tallied",code:-1}
        }
        else{
            response = {message:"Error 1",code:"err"}
        }
    }
    else if(alreadyUpvoted>=0){
        if(req.body.voteType==='up'){
            album.upvotes.splice(alreadyUpvoted,1)
            album.save()
            response = {message:"Upvote Removed",code:0}
        }
        else if(req.body.voteType ==='down'){
            album.upvotes.splice(alreadyUpvoted,1)
            album.downvotes.push(req.user.username)
            album.save()
            response = {message:"Downvote Tallied and Upvote Removed",code:-1}
        }
        else{
            response = {message:"Error 2",code:"err"}
        }
    }
    else if(alreadyDownvoted>=0){
        if(req.body.voteType==='up'){
            album.downvotes.splice(alreadyUpvoted,1)
            album.upvotes.push(req.user.username)
            album.save()
            response = {message:"Upvote Tallied and DownVote Removed",code:1}
           
        }
        else if(req.body.voteType ==='down'){
            album.downvotes.splice(alreadyUpvoted,1)
            album.save()
            response = {message:"Downvote Removed",code:0}
        }
        else{
            response = {message:"Error 3",code:"err"}
        }
    }
    else{
        response = {message:"Error 4",code:"err"}
    }

    response.score = album.upvotes.length-album.downvotes.length
    res.json(
        response
    )
})


router.get("/:id", async (req,res)=>{
try{
const album = await Album.findById(req.params.id ).exec()   
const comments = await Comment.find({albumId:req.params.id})       
res.render("albums_show.ejs",{album,comments})
}
catch(err){
    console.log(err)
    res.send("Broke album display")
}
        

})

router.get("/:id/edit", checkAlbumOwner,isLoggedIn, async (req,res)=>{
  
        const album= await Album.findById(req.params.id)
        .exec()
      
         res.render("albums_edit.ejs",{album})
     
   
})

router.put("/:id",  checkAlbumOwner,isLoggedIn,async (req,res)=>{
    const genre = req.body.genre.toLowerCase();
    const album={
        title: req.body.title,
        description: req.body.description,
        artist: req.body.artist,
        trackListLength: req.body.trackListLength,
        notableTracks:req.body.notableTracks,
        recordLabel: req.body.recordLabel,
        date : req.body.date,
        genre: genre,
        image : req.body.image
    }
    try{
    const updatedalbum= await Album.findByIdAndUpdate(req.params.id, album, {new:true}).exec()
    req.flash("success","Album updated")
     res.redirect(`/albums/${req.params.id}`);
    }
    
    catch(err){
        req.flash("error","Album updated")
        res.redirect("/albums")
    }
})

router.delete("/:id",checkAlbumOwner,isLoggedIn,async (req,res)=>{
    
    try{
    const deletedAlbum = await Album.findByIdAndDelete(req.params.id).exec()
    req.flash("success","Album deleted")
    res.redirect("/albums")
    }
    catch(err){
        req.flash("error","Error Deleting album")
        res.send("Error deleting album")
    }
})



export default router;