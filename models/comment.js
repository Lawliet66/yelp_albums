import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    user:{
        id:{
          type: mongoose.Schema.Types.ObjectId,
          ref:  "User"
        },
        username:String
    },
    text:String,
    albumId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Album"
    }

})

const Comment= mongoose.model("comment",commentSchema)

export default Comment;