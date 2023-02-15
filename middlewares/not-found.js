const { StatusCodes } = require("http-status-codes")

exports.notFoundMiddleware = (req, res) => res.status(StatusCodes.NOT_FOUND).send("The Route doesn't exist!")