const CustomAPIError = require("./custom-error");
const BadRequestError = require("./bad-request-error");
const UnauthenticatedError = require("./unauthenticated-error");
const NotFoundError = require("./not-found-error");
const UnauthorizedError = require("./unauthorized-error");

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
  UnauthorizedError
}