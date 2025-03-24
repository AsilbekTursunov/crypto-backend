const BaseError = require("../errors/base.error");
const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    throw BaseError.Unathorization("User not authorized");
  }

  const token = authorization.split(" ")[1];
  if (!token) {
    throw BaseError.Unathorization("User not authorized");
  }

  const userData = jwt.verify(token, process.env.JWT_ACCESS_KEY);
  if (!userData) {
    throw BaseError.Unathorization("User not authorized");
  }

  req.user = userData;
  next();
};
