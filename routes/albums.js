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

router.post("/vote",isLoggedIn,(req,res)=>{
    res.json({
        message:"Voted"
    })
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