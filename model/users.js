const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        
    },
    image:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:'user',
        enum:['user','admin']
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        }
]

   
})


const userModel = mongoose.model('horaaa', UserSchema)

module.exports = userModel