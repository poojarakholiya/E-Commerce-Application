const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-usr_password");
      next();
    } catch (err) {
      console.log('err :', err);
      return next(new ErrorResponse("Not authorized, token failed", 401));
    }
  }

  if (!token) return next(new ErrorResponse("Not authorized, no token", 401));

};

exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.usr_role === "admin") next();
  else next(new ErrorResponse("Access denied - Admins only", 403))
};
