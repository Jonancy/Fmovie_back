const express = require('express')
const {  authorizeUserandAdminRole, loginUserMiddleware} = require('../middleware/userAuth')
const {addUser, checkUser, userAuthCheck, updateUser, getAllUsers, deleteUser} = require('../controller/userController')
const router = express.Router()
const multer = require('multer')
const successHandler = require('../utils/successHandler')
const { addUserComments, getUserComments, getUserCommentByUser } = require('../controller/commentController')
const { checkUpdateUser } = require('../middleware/userUpdate')
const upload = multer({dest:'uploads/'})


router.get('/userDetails', getAllUsers)

router.delete('/userDelete/:id', deleteUser)

//?For signUp user
router.post('/addUser',upload.single('image'), addUser)

//?For logging in user 
router.post('/login',loginUserMiddleware, checkUser)

//!For verifying jwt and authorizing the roles
router.get('/verify', [...authorizeUserandAdminRole()], userAuthCheck);

//!Add commments
router.post('/addComment/:id/:movie_id',addUserComments)

//!Specific users comments
router.get('/getComment/:id',getUserComments)

//!User comments by movie id
router.get('/getUserComments/:movie_id', getUserCommentByUser)

//!Update user
router.patch('/updateUser/:id',upload.single('image'), checkUpdateUser,updateUser)


//   router.get('/verify-admin', jwtVerifiction, authAdmin, (req, res) => {
//     console.log(req.user);
//     res.json({ message: 'Admin is authorized' });
//   });

module.exports = router