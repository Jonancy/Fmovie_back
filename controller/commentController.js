const commentModel = require("../model/comments");
const userModel = require("../model/users");
const successHandler = require("../utils/successHandler");




//!For adding user Comments
const addUserComments = async (req, res, next) => {
    try {
      let {comment} = req.body;
      console.log(comment);
      // if(comment = ''){
      //     throw new Error('Cant be empty ')
      // }
      // const userId = parseInt(id,10)
      const userId = req.params.id;
      console.log(userId);
  
      const movieId = req.params.movie_id;
      console.log(movieId);
  
      const User = await userModel.findById(userId);
      // console.log(User)
      // const userId = User._id
      // const role = User.role
      // console.log(role)
      // console.log(userId)
  
      // if(!User){
      //     res.send('User not found')
      // }
      const userComments = await commentModel.create({
        comment,
        movieId,
        userId,
      });
      
      console.log(userComments);
  
      //!This is for adding the comment object id to the users document for like creating a relation lol
      User.comments.push(userComments._id);
      await User.save();
  
      if (!userComments) {
        console.log("failed"); 
      } else {
        return successHandler(res, {}, "New Comment added");
      }
    } catch (e) {
      next(e);
    }
  };


  const deleteUserComment=()=>{

  }
  
  //!Using this one
  const getUserCommentByUser = async (req, res, next) => {
    try {
      //!For now will comment it if i need to get one users comments then i will do it
      // const user_id = req.params.id;
      const movie_id = req.params.movie_id;
      console.log(movie_id);
    //   console.log(req);
      // //!Populate is used to retrive referenced documents in this situation the comment is our refrenced document
      // //?This is for specific users comment okay
      // const user = await userModel.findById({_id:user_id}).populate('comments')
      // const allComments = await commentModel.find({movieId:movie_id})
      // console.log(allComments);
      // const mapAllCommentsId = allComments.map((comment)=>comment.userId)
      // console.log(mapAllCommentsId)
      // const userMovie = await commentModel.find({userId:mapAllCommentsId}).populate('userId')
  
      // const userMovieFilter = userMovie.filter((userComment)=>{return userComment.movieId === movie_id})
      // console.log(userMovieFilter);
  
      // Find the user and populate their comments
  
      //?Will do this later on
      //! const user = await userModel.findById(user_id).populate("comments");
  
      // console.log('user.comments:', user.comments);
      // console.log('movie_id:', movie_id);
      // console.log('comments:', commentsForMovie);
      // Fetch all comments for the specified movie
  
      //!This one is for all comments of one movie
      // //!Find returns array of documents so it should be looped to use the values
      const commentsForMovie = await commentModel
        .find({ movieId: movie_id })
        .populate("userId");
  
  
      //!Map is used cuz there are too many documents or tables and find function returns different docs
      const usersAllComnments = commentsForMovie.map((comment) => {
          return{
              userId:comment.userId._id,
              name:comment.userId.name,
              comment:comment.comment,
              movieId:comment.movieId,
              image:comment.userId.image
          }
      });
      // console.log(commentsUserName);
  
      //!This comments are of the specific person of the required movie
      // const userCommentsForMovies = user.comments.filter((comment) =>
      //   movie_id.includes(comment.movieId)
      // );
  
      // console.log(usersAllComnments);
  
      return successHandler(
        res,
        {
          usersAllComnments
        },
        "User's comments"
      );
  
      // if(!user){
      //     throw new Error('User dosent exists')
      // }
  
      // const userComments = user.comments
      // const mapUserComments = userComments.map((comment)=> comment)
      // console.log(userComments)
      // const userCommentsByMovieId = userComments.filter((comment)=> comment.movieId === movie_id)
      // const findUserComments = commentModel.find({movieId:movie_id})
      // const meroComm = findUserComments.comment
      // console.log(meroComm)
      // // console.log(userCommentsByMovieId)
      // const userProfile = user.image
      // //!Using map cuz its an array and One user has multiple comments
      // // const userComm = userComments.map((comments)=>comments)
    } catch (e) {
      next(e);
    }
  };
  
  //!Not using this one
  const getUserComments = async (req, res) => {
    const user_id = req.params.id;
    const userName = await userModel.findById({ _id: user_id });
    console.log(userName);
  
    const userComments = await commentModel.find({ userId: user_id });
  
    const comments = userComments.map((comment) => comment.comment);
    console.log(comments);
  
    if (!userComments) {
      console.log("no user");
    }
    res.send(comments);
  };



  module.exports ={addUserComments,getUserCommentByUser,getUserComments}