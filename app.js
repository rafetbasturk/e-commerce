require("dotenv").config()
require("express-async-errors")
const express = require("express")
const connect = require("./db/connect")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")
const rateLimiter = require("express-rate-limit")
const helmet = require("helmet")
const xss = require("xss-clean")
const cors = require("cors")
const mongoSanitize = require("express-mongo-sanitize")

const authRouter = require("./routes/authRoutes")
const userRouter = require("./routes/userRoutes")
const productRouter = require("./routes/productRoutes")
const reviewRouter = require("./routes/reviewRoutes")
const orderRouter = require("./routes/orderRoutes")
const { notFoundMiddleware } = require("./middlewares/not-found")
const { errorHandlerMiddleware } = require("./middlewares/error-handler")

const app = express()

app.set("trust proxy", 1)
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 60
}))
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())

app.use(express.static("public"))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(fileUpload({
  useTempFiles: true
}))

app.use("/api/v1/auth", authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/orders', orderRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000
const start = async () => {
  try {
    await connect(process.env.MONGO_URI)
    app.listen(port, console.log(`Server started on port ${port}`))
  }
  catch (err) {
    console.log(err)
  }
}

start()