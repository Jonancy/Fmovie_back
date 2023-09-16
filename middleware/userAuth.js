const userModel = require("../model/users");
const bcrypt = require("bcrypt");
const { verifyToken } = require("../utils/jsonWT");

//!For SignUp Authentication but dont need it, can add user straight without making middleware
const signUpMiddleware = async (req, res, next) => {
  try {
    console.log(req);
    const { name, email, password } = req.body;
    const imageUrl = req.file.path;

    const user = await userModel.findOne({ email });

    if (user) {
      throw Error("User already exists");
    }

    if (!name || !email || !password) {
      throw Error("Fill up all the forms");
    }

    //!Stored in userData so that router can use it, injected values basically
    req.userData = { name, email, password };
    req.file.path;
    next();
  } catch (error) {
    //    return res.status(400).json({error :error?.message})
    next(error);
  }
};


//!For user LoginAuthentication
const loginUserMiddleware = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      throw Error("User not found");
    }

    if (!email || !password) {
      throw Error("Fill up all the forms");
    }

    const pass = await bcrypt.compare(password, user.password);

    if (pass) {
      const username = user.name;
      const image = user.image;
      const userId = user.id;

      //!Injected value
      req.userData = { name: username, email, password, image: image, id: userId};

      //!For user Role
      req.userRole = user;
      next();
    } else {
      throw Error("Enter your password correctly");
    }
  } catch (error) {
    next(error);
  }
};


//!For jwt verification like authentecation and authorization
const jwtVerifiction =async(req, res, next) => {
  const bearer = req.headers.authorization;
    // console.log(req)
  try {
    if (!bearer) {
      throw new Error("Bearer token needed");
    }

    const[tokenType, tokenValue] = bearer.split(' ')
    console.log(tokenType)
    console.log(tokenValue)

    if(!tokenType === 'Bearer' || !tokenValue){
        throw new Error('Token is invalid')
    }

    const decodedValue = verifyToken(tokenValue)

    //!Conditional rendering. If theres value it shows but if theres not then it will ignore it like it wont show null or undefined
    if(!decodedValue?.id){
        throw new Error('Token malformed')
    }

    const user = await userModel.findById(decodedValue.id)

    if(!user){
        throw new Error('User not found please try again')
    }

    req.user = user

    next();
  } catch (e) {
    next(e);
  }
};


//!For authorization 
const authorizeRole = (req, res, next) => {
  console.log(req.user)

  if(req.user.role === 'user'){
      try {
        if (!req.user) {
          throw new Error("Cant resloved user");
        }
    
        if (req.user.role !== "user") {
          throw new Error("No authorize for this privilege");
        }
    
        next();
      } catch (e) {
        next(e);
      }
  }else if(req.user.role === 'admin'){
    try {
        if (!req.user) {
          throw new Error("Cant resloved admin");
        }
    
        if (req.user.role !== "admin") {
          throw new Error("No authorize for this admin privilege");
        }
        console.log(req.user.role)
    
        next();
      } catch (e) {
        next(e);
      }
  }
};




const authorizeUserandAdminRole = () => {
  return [jwtVerifiction, authorizeRole];
};

// const authorizeAdminRole = () => {
//   return [jwtVerifiction, authAdmin];
// };



module.exports = {loginUserMiddleware, authorizeUserandAdminRole};
