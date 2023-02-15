const { StatusCodes } = require("http-status-codes")
const CustomError = require("../errors")
const Review = require("../models/reviewModel")
const Product = require("../models/productModel")
const { checkPermissions } = require("../utils")

exports.createReview = async (req, res) => {
  const { product: productId } = req.body
  const product = await Product.findById(productId)
  if (!product) throw new CustomError.NotFoundError(`No product with id ${productId}!`)
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId
  })
  if (alreadySubmitted) throw new CustomError.BadRequestError("Already submitted review for this product!")
  req.body.user = req.user.userId
  const review = await Review.create(req.body)
  res.status(StatusCodes.CREATED).json({
    review
  })
}
exports.getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price"
  }).populate({
    path: "user",
    select: "name"
  })
  res.status(StatusCodes.OK).json({
    count: reviews.length,
    reviews
  })
}
exports.getSingleReview = async (req, res) => {
  const review = await Review.findById(req.params.id)

  if (!review) throw new CustomError.NotFoundError(`No review with id: ${req.params.id}`)

  res.status(StatusCodes.OK).json({
    review
  })
}
exports.deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id)
  if (!review) throw new CustomError.NotFoundError(`No review with id: ${req.params.id}`)

  checkPermissions(req.user, review.user)
  await review.remove()
  res.status(StatusCodes.OK).json({
    msg: "Success! Review deleted."
  })
}
exports.updateReview = async (req, res) => {
  const review = await Review.findById(req.params.id)
  if (!review) throw new CustomError.NotFoundError(`No review with id: ${req.params.id}`)

  checkPermissions(req.user, review.user)

  const { rating, title, comment } = req.body
  if (!rating || !title || !comment) throw new CustomError.BadRequestError("Please provide all values!")

  review.rating = rating
  review.title = title
  review.comment = comment
  await review.save()

  res.status(StatusCodes.OK).json({
    review
  })
}

exports.getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params
  const reviews = await Review.find({ product: productId })
  res.status(StatusCodes.OK).json({
    count: reviews.length,
    reviews
  })
}