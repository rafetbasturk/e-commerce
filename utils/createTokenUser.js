exports.createTokenUser = (user) => {
  return {
    userId: user._id,
    name: user.name,
    role: user.role
  }
}