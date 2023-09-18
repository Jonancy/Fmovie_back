const userModel = require("../model/users")
const bcrypt = require('bcrypt')
const successHandler = require("../utils/successHandler")
const {createJWT} = require("../utils/jsonWT")
const errorHandler = require("../utils/errorHandler")
const { commentModel } = require("../model/comments")
// const errorHandler = require("../utils/errorHandler")


const addUser=async(req,res,next)=>{

    const{name,email,password}= req.body
    const image = req.file.path
    try{
        
        const user = await userModel.findOne({email})
        if(user){
            throw Error('User already exists')
        }
        const salt =await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        await userModel.create({name,email,password:hashedPassword,image:image})

        //?User return handler 
        return successHandler(res,{name,email}, 'New user added',201)
        // res.status(200).json({message:'New User added Successfully', userPass:hashedPassword})
    }catch(error){
        next(error)
    }

}

//!Controller for logging in the user to check whether the user is already exists or not 
const checkUser=async(req,res)=>{

    //!Injected Value send from loginAuth
    const{name,email,image, id }= req.userData
    try{
        const jwt = createJWT({name,email,image,id})
        console.log(jwt)
       return successHandler(res,{token:jwt},"User logged in successfully",201)
    }catch(error){
        next(error)
    }
}


//!Controller for verifying the users jwt and for authentication and authorization whether its user or admin 
const userAuthCheck=(req,res)=>{
    console.log(req.user);
    const id = req.user._id
    const name = req.user.name
    const email = req.user.email
    const image = req.user.image
    const role = req.user.role

    if(req.user.role === 'user'){
        return successHandler(res,{id,name,email,image,role},'User authorized',201)
    }else if(req.user.role === 'admin'){
        return successHandler(res,{id,name,email,image,role},'Admin authorized',201)
    }
  
}

//!For adding user Comments
const addUserComments=async(req,res,next)=>{

    try{
        console.log(req)
        const{comment} = req.body

        // if(comment = ''){
        //     throw new Error('Cant be empty ')
        // }
        // const userId = parseInt(id,10)
        const userId = req.params.id
        console.log(userId)
        const User = await userModel.findById(userId)
        // console.log(User)
        // const userId = User._id
        // const role = User.role
        // console.log(role)
        // console.log(userId)
    
        // if(!User){
        //     res.send('User not found')
        // }
        const userComments =await commentModel.create({comment,userId})
    
        //!This is for adding the comment object id to the users document for like creating a relation lol 
        User.comments.push(userComments._id);
        await User.save();
    
        if(!userComments){
            console.log('failed')
        }else{
    
            return successHandler(res,{},'New Comment added')
        } 
    }catch(e){
        next(e)
    }

}


//!Using this one
const getUserCommentByUser=async(req,res,next)=>{

    try{

        const user_id = req.params.id

        //!Populate is used to retrive referenced documents in this situation the comment is our refrenced document 
        const user = await userModel.findById({_id:user_id}).populate('comments')

        // if(!user){
        //     throw new Error('User dosent exists')
        // }
        
        const userComments = user.comments

        //!Using map cuz its an array and One user has multiple comments 
        const userComm = userComments.map((comments)=>comments.comment)
        console.log(userComm)

        return successHandler(res,{userComm},"User's comments",)


    }catch(e){
        next(e)
    }
    
}


//!Not using this one 
const getUserComments=async(req,res)=>{
    const user_id = req.params.id
    const userName = await userModel.findById({_id:user_id})
    console.log(userName)

    const userComments =await commentModel.find({userId:user_id})
    
    const comments = userComments.map((comment)=>comment.comment)
    console.log(comments)

    if(!userComments){
        console.log('no user')
    }
    res.send(comments)
}


module.exports = {addUser,checkUser,userAuthCheck, addUserComments, getUserComments,getUserCommentByUser}