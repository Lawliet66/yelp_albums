import Album from '../models/album.js'

const checkAlbumOwner=async(req,res,next)=>{
    if(req.isAuthenticated()){
        const album= await Album.findById(req.params.id)
        .exec()
     
        if(album.owner.id.equals(req.user._id)){
           next()
        }
        else{
            res.redirect("back")
        }
    }
    else{
        res.redirect("/login");
    }
}

export default checkAlbumOwner