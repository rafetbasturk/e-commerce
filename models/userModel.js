const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name!"],
    minlength: [3, "Name should be at least 3 characters!"],
    maxlength: [25, "Name shouldn't be more than 25 characters!"]
  },
  email: {
    type: String,
    required: [true, "Please provide email!"],
    unique: true,
    validate: {
      validator: isEmail,
      message: "Please provide a valid email!"
    }
  },
  password: {
    type: String,
    required: [true, "Please provide password!"],
    minlength: [4, "Password should be at least 4 characters!"]
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  }
}, {
  timestamps: true
})

UserSchema.pre("save", async function () {
  // console.log(this.modifiedPaths());
  // console.log(this.isModified("password"));
  if (!this.isModified("password")) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model("User", UserSchema)