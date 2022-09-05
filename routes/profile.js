import express, { application } from 'express'
import Album from '../models/album.js'
//import Comment from '../models/comment.js'
import isLoggedIn from '../utils/isLoggedIn.js'
//import checkAlbumOwner from '../utils/checkAlbumOwner.js'
const router = express.Router();

router.get("/",isLoggedIn,async (req,res)=>{
    const user = await req.user
    let albums =[]
    if(user.favorites.length>5){
        albums =  await user.favorites.slice(0,5)
    }
    else{
        albums = await user.favorites
    }
 
  // console.log(albums)

    res.render("profile.ejs",{albums})
})

router.get("/favorites",(req,res)=>{
    res.send("Hit Favorites Route")
})

export default router;