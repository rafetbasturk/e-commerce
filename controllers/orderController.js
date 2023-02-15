const Order = require("../models/orderModel")
const Product = require("../models/productModel")
const { StatusCodes } = require("http-status-codes")
const CustomError = require("../errors")
const { checkPermissions } = require("../utils")

const fakeStripeAPI = async ({ amount, currency }) => {
  const clientSecret = "random_secret"
  return { clientSecret, amount, currency }
}

exports.createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("No cart items provided!")
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError("Please provide tax and shipping fee!")
  }
  // cartItems.map(item => {
  //   console.log(item);
  // })
  let orderItems = [];
  let subtotal = 0

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product })
    if (!dbProduct) {
      throw new CustomError.NotFoundError(`No item found with id ${item.product}!`)
    }
    const { name, price, image } = dbProduct
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: item.product,
    }
    // add item to order
    orderItems = [...orderItems, singleOrderItem]
    // calculate subtotal
    subtotal += item.amount * price
  }
  // calculate total
  const total = tax + shippingFee + subtotal
  // get client secret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd"
  })
  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.clientSecret,
    user: req.user.userId
  })
  res.status(StatusCodes.CREATED).json({
    order,
    clientSecret: order.clientSecret
  })
}

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find({})
  res.status(StatusCodes.OK).json({
    count: orders.length,
    orders
  })
}

exports.getSingleOrder = async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (!order) throw new CustomError.NotFoundError(`No order with id ${req.params.id}`)
  checkPermissions(req.user, order.user)
  res.status(StatusCodes.OK).json({
    order
  })
}

exports.getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId })
  res.status(StatusCodes.OK).json({
    count: orders.length,
    orders
  })
}

exports.updateOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id })
  if (!order) throw new CustomError.NotFoundError(`No order with id ${req.params.id}`)
  checkPermissions(req.user, order.user)
  order.paymentIntentId = req.body.paymentIntentId
  order.status = "paid"
  await order.save()
  res.status(StatusCodes.OK).json({
    order
  })
}