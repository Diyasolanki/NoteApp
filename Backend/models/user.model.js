const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userschema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
})

userschema.pre('save' , async function(next){
    this.password =  await bcrypt.hash(this.password , 10)
    next()
})
const User = mongoose.model('User' , userschema);

module.exports = User;
