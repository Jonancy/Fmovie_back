const userModel = require("../model/users");
const bcrypt = require("bcrypt");
const successHandler = require("../utils/successHandler");
const { createJWT } = require("../utils/jsonWT");
const errorHandler = require("../utils/errorHandler");
// const errorHandler = require("../utils/errorHandler")

const addUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  const image = req.file.path;
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      throw Error("User already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await userModel.create({
      name,
      email,
      password: hashedPassword,
      image: image,
    });

    //?User return handler
    return successHandler(res, { name, email }, "New user added", 201);
    // res.status(200).json({message:'New User added Successfully', userPass:hashedPassword})
  } catch (error) {
    next(error);
  }
};

//!Controller for logging in the user to check whether the user is already exists or not
const checkUser = async (req, res) => {
  //!Injected Value send from loginAuth
  const { name, email, image, id } = req.userData;
  try {
    const jwt = createJWT({ name, email, image, id });
    console.log(jwt);
    return successHandler(
      res,
      { token: jwt },
      "User logged in successfully",
      201
    );
  } catch (error) {
    next(error);
  }
};

//!Controller for verifying the users jwt and for authentication and authorization whether its user or admin
const userAuthCheck = (req, res) => {
  console.log(req.user);
  const id = req.user._id;
  const name = req.user.name;
  const email = req.user.email;
  const image = req.user.image;
  const role = req.user.role;

  if (req.user.role === "user") {
    return successHandler(
      res,
      { id, name, email, image, role },
      "User authorized",
      201
    );
  } else if (req.user.role === "admin") {
    return successHandler(
      res,
      { id, name, email, image, role },
      "Admin authorized",
      201
    );
  }
};

const getAllUsers =async(req, res) => {
  const users = await userModel.find();

  const User = users.map((user)=>{
    return{
      name:user.name,
      email:user.email,
      image:user.image,
      role:user.role
    }
  })

  return successHandler(res,{User},'All users')
};

const updateUser = (req, res) => {
  const { name, password, image, role, id } = req.User;

  const newUser = userModel.findByIdAndUpdate(
    { _id: id },
    { name: name, password: password, image: image }
  );

  if (newUser) {
    return successHandler(
      res,
      {
        userName: name,
        password: password,
        userImage: image,
        role: role,
        userId: id,
      },
      "User updated successfully"
    );
  }
};

module.exports = {
  addUser,
  checkUser,
  userAuthCheck,
  updateUser,
  getAllUsers
};
