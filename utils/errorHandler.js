
const errorHandler=(
    res,messasge='fail',status= 401
)=>{
  return  res.status(status).send({
        success:false,
        messasge,
        data
    })
}


module.exports = errorHandler