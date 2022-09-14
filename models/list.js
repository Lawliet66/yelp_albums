import mongoose from 'mongoose'

const listSchema = new mongoose.Schema({
    owner:{
        id:{
          type: mongoose.Schema.Types.ObjectId,
          ref:  "User"
        },
        username:String
    },
    Name:String,
    Description:String,
    Albums:[{id:String, image:String, title:String}]
   

})

const List= mongoose.model("list",listSchema)

export default List;