const jwt = require('jsonwebtoken')
const User = require('../models/authModel');
const expressAsyncHandler = require('express-async-handler');
const protect = expressAsyncHandler(async (req, res, next) => {
  let token;
  try {
    // Check If Token is Coming with req
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Get Token
        token = req.headers.authorization.split(' ')[1]
        // Validate Token
        let decoded = jwt.verify(token, process.env.JWT_SECRET)
        // Check if User  Exists
        const user = await User.findById(decoded.id).select('-password')
        // Store User Into Req Object
        req.user = user
      next();
    } else {
      res.status(401);
      throw new Error("Token Not Found!");
    }
  } catch (error) {
    res.status(401);
    throw new Error("Unauthorised Access");
  }
});
module.exports = protect;
