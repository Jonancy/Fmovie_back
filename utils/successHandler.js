
const successHandler=(
    res,data={}, message='',status= 200
)=>{
  return  res.status(status).send({
        success:true,
        message,
        data
    })
}


module.exports = successHandler