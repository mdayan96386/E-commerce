const bcrypt = require("bcryptjs");
const User = require("../models/authModel");
const jwt = require("jsonwebtoken");
const expressAsyncHandler = require('express-async-handler');

const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check all Field
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Fill All Details!");
  }

  // Check User Already Exists
  const emailExist = await User.findOne({ email: email });

  if (emailExist) {
    res.status(400);
    throw new Error("User Already Exists");
  }

  // Hash Password
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);

  const user = await User.create({ name, email, password: hashPassword });

  if (!user) {
    res.status(400);
    throw new Error("User Account Not Created!!");
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    __v: user.__v,
    token: generateToken(user._id),
  });
});

const loginUser =expressAsyncHandler( async (req, res) => {
  const { email, password } = req.body;

  // Check all field
  if (!email || !password) {
    res.status(400);
    throw new Error("Please Fill All Details!");
  }
  // Check if user Exists
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      __v: user.__v,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Credentials");
  }
});

const privateController = async(req, res) => {
  res.json({
    msg: `Request By : ${req.user.name}` ,
    user : req.user
  })
}

const generateToken = (id) => {
  let token = jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: "10d"});
  return token;
};

module.exports = { registerUser, loginUser, privateController };
