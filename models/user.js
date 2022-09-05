import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

const userSchema = new mongoose.Schema({
    favorites:[String],
    email: {type:String, required:true, unique:true},
    username: {type:String, required:true, unique:true}
})

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model("user",userSchema)

export default User;