const express = require('express')
const {  authorizeUserandAdminRole, loginUserMiddleware} = require('../middleware/userAuth')
const {addUser, checkUser, userAuthCheck, addUserComments, getUserComments, getUserCommentByUser} = require('../controller/userController')
const router = express.Router()
const multer = require('multer')
const successHandler = require('../utils/successHandler')
const upload = multer({dest:'uploads/'})


// router.get('/', )

//?For signUp user
router.post('/addUser',upload.single('image'), addUser)

//?For logging in user 
router.post('/login',loginUserMiddleware, checkUser)

//!For verifying jwt and authorizing the roles
router.get('/verify', [...authorizeUserandAdminRole()], userAuthCheck);


router.post('/addComment/:id',addUserComments)

router.get('/getComment/:id',getUserComments)


router.get('/getUserComments/:id', getUserCommentByUser)


//   router.get('/verify-admin', jwtVerifiction, authAdmin, (req, res) => {
//     console.log(req.user);
//     res.json({ message: 'Admin is authorized' });
//   });

module.exports = router