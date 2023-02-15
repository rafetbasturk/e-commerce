const path = require("path")
const { StatusCodes } = require("http-status-codes");
const Product = require("../models/productModel")
const CustomError = require("../errors")

exports.createProduct = async (req, res) => {
  req.body.user = req.user.userId
  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json({
    product
  })
}

exports.getAllProducts = async (req, res) => {
  const products = await Product.find({})

  res.status(StatusCodes.OK).json({
    count: products.length,
    products
  })
}

exports.getSingleProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("user").populate("reviews")

  if (!product) throw new CustomError.NotFoundError(`No product with id ${req.params.id}`)

  res.status(StatusCodes.OK).json({
    product
  })
}

exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      runValidators: true,
      new: true
    }
  )

  if (!product) throw new CustomError.NotFoundError(`No product with id ${req.params.id}`)

  res.status(StatusCodes.OK).json({
    product
  })
}

exports.deleteProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id })

  if (!product) throw new CustomError.NotFoundError(`No product with id ${req.params.id}`)

  await product.remove()

  res.status(StatusCodes.OK).json({
    msg: "Success! Product removed."
  })

}

exports.uploadImage = async (req, res) => {
  console.log(req.files);
  if (!req.files) throw new CustomError.BadRequestError("No file uploaded!")
  const { image: productImage } = req.files
  if (!productImage.mimetype.startsWith("image")) throw new CustomError.BadRequestError("Please upload an image format!")
  const maxSize = 1024 * 1024 // 1mb
  if (productImage.size > maxSize) throw new CustomError.BadRequestError("Max upload (1mb) size exceeded!")

  const imagePath = path.join(__dirname, `../public/uploads/${productImage.name}`)
  await productImage.mv(imagePath)
  res.status(StatusCodes.OK).json({
    image: `/uploads/${productImage.name}`
  })
}