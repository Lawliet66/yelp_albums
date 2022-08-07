import mongoose from 'mongoose'

const albumSchema = new mongoose.Schema({
    title:String,
    description: String,
    artist: String,
    trackListLength: Number,
    notableTracks: String,
    recordLabel: String,
    date: Date,
    genre: String,
    image:String,
    owner:{
        id:{
          type: mongoose.Schema.Types.ObjectId,
          ref:  "User"
        },
        username:String
    }

})

albumSchema.index({'$**':'text'})

const Album = mongoose.model("album",albumSchema)

export default Album;