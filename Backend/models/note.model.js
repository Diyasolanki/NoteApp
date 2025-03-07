const mongoose = require('mongoose');

const noteschema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    // username : {
    //     type : String,
    //     required : true
    // },
    note : {
        type : String,
        required: true,
    },
    rating : {
        type : Number,
        min : 0,
        max : 5, 
        default : 0,    
    },
    color : {
        type : String,
        default : function(){
            const colors = ["#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF", "#A0C4FF", "#BDB2FF", "#FFC6FF"];
            return colors[Math.floor(Math.random() * colors.length)];
        }
    },
    deleted : {
        type : Boolean,
        default : false
    },
    pinned: { type: Boolean, default: false },

} , {timestamps : true})

const Note = mongoose.model('Note' , noteschema);

module.exports = Note;