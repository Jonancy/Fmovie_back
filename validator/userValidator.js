const {body} = require('express-validator')


const UserValidation=()=>{
    body('email').isEmail().withMessage('')
}