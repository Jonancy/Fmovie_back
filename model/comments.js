const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
 
    
    comment:{
        type:String,
        required:true
    },
    movieId:{
        type:Number,
        required:true
    },
    // date:{
    //     type:Date,
    //     date:Date.now()
    // }
    //!As there is no relation in mongo db this is the one way to like make a relation like primary or foreign key, 
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'horaaa' //! This refers to horaa document or table 
    }
})

const commentModel = mongoose.model('Comment',commentSchema)

module.exports = commentModel