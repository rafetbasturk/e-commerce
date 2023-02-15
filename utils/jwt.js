const jwt = require("jsonwebtoken")

exports.createToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME
  })
}

exports.isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET)

exports.attachCookiesToResponse = ({ res, user }) => {
  const token = this.createToken(user)
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    secure: process.env.NODE_ENV === "production",
    signed: true
  })
}