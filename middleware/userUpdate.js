const userModel = require("../model/users")
const bcrypt = require('bcrypt')


const checkUpdateUser=(req,res,next)=>{
    try{
        console.log(req)
        const id = req.params
        const{name,password} = req.body
        const imageUrl = req.file.image
        console.log(req.body)
    
        const user = userModel.findById({_id:id})
    
        if(name === user.name){
            throw new Error("You can't set the old name again")
        }
    
        const passCheck = bcrypt.compare(password, user.password)
    
        if(!passCheck){
            throw new Error("You can't set the old password again")
        }

        const userRole = user.role
        const userId = user._id
        req.User = {name,password,image:imageUrl, role:userRole,id :userId}
        next()
    }catch(e){
        next(e)
    }

}

const userDelete=()=>{

}

module.exports = {checkUpdateUser}