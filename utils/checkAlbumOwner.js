import Album from '../models/album.js'

const checkAlbumOwner=async(req,res,next)=>{
    if(req.isAuthenticated()){
        const album= await Album.findById(req.params.id)
        .exec()
     
        if(album.owner.id.equals(req.user._id)){
           next()
        }
        else{
            req.flash("error","You don't have permission to do that")
            res.redirect("back")
        }
    }
    else{
        req.flash("error","You you must be logged in")
        res.redirect("/login");
    }
}

export default checkAlbumOwner