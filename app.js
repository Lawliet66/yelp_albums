//NPM imports
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import methodOverride from 'method-override'
import morgan from 'morgan'
import passport from 'passport'
import passportLocal from 'passport-local'
import expressSession from 'express-session'
import flash from 'connect-flash'
//Model imports
import Album from './models/album.js'
import Comment from './models/comment.js'
import User from './models/user.js'

//Connect to DB
mongoose.connect(config.db.connection,{useNewUrlParser:true, useUnifiedTopology:true});



//Config import
import config from './config.js'

//Routes imports
import albumRoutes from './routes/albums.js'
import commentRoutes from './routes/comments.js'
import mainRoutes from './routes/main.js'
//import seed from './utils/seed.js'
import authRoutes from './routes/auth.js'

//seed()
//import fetch from 'node-fetch'

const app = express("view engine","ejs")
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(morgan('tiny'))
app.use(expressSession({secret:"skjfsnjkdfbfdjkberaulsnkjdvbeiau",resave:false,saveUninitialized:false}))

app.use(flash());


app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
const LocalStrategy = passportLocal.Strategy
passport.use(new LocalStrategy(User.authenticate()))

app.use((req,res,next)=>{
    res.locals.user = req.user
    res.locals.errorMessage = req.flash("error")
    res.locals.successMessage = req.flash("success")
    next()
})

app.use("/",mainRoutes)
app.use("/",authRoutes)
app.use("/albums",albumRoutes)
app.use("/albums/:id/comments",commentRoutes)


app.listen(3000,(req,res)=>{
    console.log("App is running")
})