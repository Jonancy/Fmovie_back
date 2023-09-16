const jwt = require('jsonwebtoken');
require('dotenv').config();

const createJWT = ({name,email,image,id}) => {
 
  const token = jwt.sign({name,email,image,id}, process.env.SECRET_KEY, { expiresIn: '2hr' });
  return token;
};


const verifyToken =(token)=>{
  const verifiedToken = jwt.verify(token,process.env.SECRET_KEY)
  return verifiedToken 
}

module.exports ={ createJWT,verifyToken};



