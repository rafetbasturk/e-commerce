const User = require("../models/userModel")
const { StatusCodes } = require("http-status-codes")
const { attachCookiesToResponse, createTokenUser } = require("../utils")
const CustomError = require("../errors")

exports.register = async (req, res) => {
  const { name, email, password } = req.body
  // gives first user admin role
  const isFirstRegistered = await User.countDocuments({}) === 0
  const role = isFirstRegistered ? "admin" : "user"
  const user = await User.create({
    name,
    email,
    password,
    role
  })
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })
  res.status(StatusCodes.CREATED).json({
    user: tokenUser
  })
}
exports.login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) throw new CustomError.BadRequestError("Please provide email and password")
  const user = await User.findOne({ email })
  if (!user) throw new CustomError.UnauthenticatedError("Please check your credentials!")
  const isPasswordTrue = await user.comparePassword(password)
  if (!isPasswordTrue) throw new CustomError.UnauthenticatedError("Please check your credentials!")
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })
  res.status(StatusCodes.OK).json({
    user: tokenUser
  })
}

exports.logout = async (req, res) => {
  // res.clearCookie("token")
  res.cookie("token", "loggedOut", {
    httpOnly: true,
    maxAge: 1
  })
  res.status(StatusCodes.OK).json({
    msg: "logged out"
  })
}























// const { StatusCodes } = require("http-status-codes");
// const { BadRequestError, UnauthenticatedError } = require("../errors");
// const User = require("../models/userModel")

// exports.register = async (req, res) => {
//   const user = await User.create(req.body)
//   const token = user.createToken()
//   res.status(StatusCodes.CREATED).json({
//     user: {
//       email: user.email,
//       lastName: user.lastName,
//       location: user.location,
//       name: user.name,
//       token,
//     }
//   })
// }

// exports.login = async (req, res) => {
//   const { email, password } = req.body
//   if (!email || !password) {
//     throw new BadRequestError("Please provide email and password!")
//   }
//   const user = await User.findOne({ email })
//   if (!user) {
//     throw new UnauthenticatedError("Invalid credentials!")
//   }
//   const isPasswordCorrect = await user.comparePassword(password)
//   if (!isPasswordCorrect) {
//     throw new UnauthenticatedError("Invalid credentials!")
//   }
//   const token = user.createToken()
//   res.status(StatusCodes.OK).json({
//     user: {
//       email: user.email,
//       lastName: user.lastName,
//       location: user.location,
//       name: user.name,
//       token,
//     }
//   })
// }

// exports.updateUser = async (req, res) => {
//   const { name, email, lastName, location } = req.body

//   if (!name || !email || !lastName || !location) {
//     throw new BadRequestError("Please provide all values!")
//   }

//   const user = await User.findOne({_id: req.user.userId})

//   user.name = name
//   user.email = email
//   user.lastName = lastName
//   user.location = location

//   await user.save()

//   const token = user.createToken()

//   res.status(StatusCodes.OK).json({
//     user: {
//       email: user.email,
//       lastName: user.lastName,
//       location: user.location,
//       name: user.name,
//       token,
//     }
//   })
// }