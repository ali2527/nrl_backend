const jwt = require("jsonwebtoken");
const User = require("../Models/User")
const { ApiResponse } = require("../Helpers");
const { errorHandler } = require("../Helpers/errorHandler");
require("dotenv").config();

exports.authenticatedRoute = async (req, res, next) => {

  //extracting bearer token
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(403).json(ApiResponse({}, "Access Forbidden", false))
  }
  try {

    //verifying and decoding token
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

    //finding user by id
    let user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json(ApiResponse({}, "Unauthorized Access", false))
    }
    req.user = user;
    next()
  } catch (err) {
    return res.status(401).send(ApiResponse({}, "Session expired, Please sign in again", false))
  }
  // return next();
};

exports.adminRoute = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(403).json(ApiResponse({}, "Access Forbidden", false))
  }
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    
    if (!decoded.isAdmin) {
      return res.status(401).json(ApiResponse({}, "Unauthorized Access", false))
    }
    User.findById(decoded._id, (err, user) => {
      if (err) {
        return res.json(ApiResponse({}, errorHandler(err), false))
      }
      if (!user) {
        return res.json(ApiResponse({}, "User not found", false))
      }
      req.user = user;
      next()
    })
  } catch (err) {
    return res.status(401).send(ApiResponse({}, "Invalid Token, Please sign in again", false));
  }
}