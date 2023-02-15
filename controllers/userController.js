const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { createTokenUser, attachCookiesToResponse, checkPermissions } = require("../utils");


exports.getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password")

  res.status(StatusCodes.OK).json({
    count: users.length,
    users
  })
}

exports.getSingleUser = async (req, res) => {
  checkPermissions(req.user, req.params.id)
  const user = await User.findById(req.params.id, "name email role")
  if (!user) throw new CustomError.NotFoundError(`There is no user with id: ${req.params.id}`)
  res.status(StatusCodes.OK).json({
    user
  })
}

exports.showCurrentUser = (req, res) => {
  res.status(StatusCodes.OK).json({
    user: req.user
  })
}

exports.updateUserPassword = async (req, res) => {
  const { password, newPassword } = req.body

  if (!password || !newPassword) throw new CustomError.BadRequestError("Please provide current and new passwords!")

  const user = await User.findOne({ _id: req.user.userId })
  if (!await user.comparePassword(password)) throw new CustomError.UnauthenticatedError("Invalid credentials!")

  user.password = newPassword
  await user.save()

  res.status(StatusCodes.OK).json({
    msg: "Success! Password updated."
  });
}

// update user with findOneAndUpdate
// exports.updateUser = async (req, res) => {
//   const { name, email } = req.body
//   if (!name || !email) throw new CustomError.BadRequestError("Please provide both name and email values!")
//   const user = await User.findOneAndUpdate({ _id: req.user.userId }, {
//     name,
//     email
//   }, {
//     runValidators: true,
//     new: true
//   })
//   const tokenUser = createTokenUser(user)
//   attachCookiesToResponse({ res, user: tokenUser })
//   res.status(StatusCodes.OK).json({
//     user: tokenUser
//   });
// }
exports.updateUser = async (req, res) => {
  const { name, email } = req.body
  if (!name || !email) throw new CustomError.BadRequestError("Please provide both name and email values!")
  const user = await User.findOne({ _id: req.user.userId })
  user.name = name
  user.email = email
  await user.save()
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })
  res.status(StatusCodes.OK).json({
    user: tokenUser
  });
}