import express from 'express'
import isLoggedIn from '../utils/isLoggedIn.js'
const router = express.Router();

router.get("/",(req,res)=>{
    res.render("landing.ejs")
})

router.get('/account', isLoggedIn, (req,res)=>{
    res.render("account.ejs")
})



export default router