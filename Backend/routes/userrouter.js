const express = require('express');
const app = express();
const router = express.Router();
const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
router.post('/register' , async(req,res)=> {
    const {username , password , email} = req.body;
       
    // console.log( "Register email : " , email);

    if(!username && !password && !email) {
        return res.status(402).json({error : 'Enter user all fields'});
    }

    const isuserExist = await User.findOne({
        $or : [{username} , {email}]
    })
    
    if(isuserExist){
       console.log("User already exists");
       return res.status(401).json({error : 'User already exists'})
    }

    const newuser = new User({
        username ,
        password,
        email
    })

    const savedata = await newuser.save()
    console.log('user data' , savedata)

    const usersaved = User.findById(savedata._id)

    if(!usersaved){
        return res.status(401).json({error : 'Error while saving user data'})
    }

     res.json({msg : 'User Registred Successfully' , user : savedata});
})

router.post('/login' , async(req,res)=> {
    const {email , password} = req.body;
    console.log('login email' , email);

    if(!email && !password) {
        return res.status(401).json({error : 'Please enter email and password'});
    }

    const user = await User.findOne({email})
    if(!user){
        return res.json({Error : "user not found"})
    }

    const validemail = bcrypt.compare(password ,user.password);

   if(validemail){
    const token = jwt.sign({_id : user._id} , process.env.JWT_SECRET);
    // console.log( "json token", token)

    if(token)
        res.status(200).json({msg : "User login successfully" , token , user})
    }
    else{
        return res.status(401),json({error : 'Error in token creation '})
   }
})
module.exports = router;