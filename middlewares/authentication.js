const CustomError = require("../errors")
const { isTokenValid } = require("../utils/jwt")

exports.authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token
  if (!token) throw new CustomError.UnauthenticatedError("Authentication Invalid!")
  try {
    const { name, userId, role } = isTokenValid(token)
    req.user = { name, userId, role }
    next()
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid!")
  }
}

exports.authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) throw new CustomError.UnauthorizedError("Not authorized to access this route!")
    next()
  }
}