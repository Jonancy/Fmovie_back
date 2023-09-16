const mongoose = require('mongoose')
require('dotenv').config()

const mongodb_PORT = process.env.mongodbPORT


const db=async()=>{
    try{
        await mongoose.connect(mongodb_PORT)
        console.log(mongodb_PORT)
        console.log('Db connected successfully')
    }catch(e){
        console.log('error bish')
    }
}

module.exports = db

