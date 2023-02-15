const CustomAPIError = require("./custom-error")
const { StatusCodes } = require("http-status-codes")

class Unauthorized extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.FORBIDDEN
  }
}

module.exports = Unauthorized