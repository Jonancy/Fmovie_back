

const errorHandlerMiddleware=(err,req,res,next)=>{
    res.send({
        success: false,
        message: err?.message || " Something went wrong.",
      });
}

module.exports = errorHandlerMiddleware