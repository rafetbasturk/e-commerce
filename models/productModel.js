const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide product name!"],
    maxlength: [100, "Name shouldn't be more than 100 characters!"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Please provide product price!"],
    default: 0
  },
  description: {
    type: String,
    required: [true, "Please provide product description!"],
  },
  image: {
    type: String,
    default: "/uploads/example.jpeg"
  },
  category: {
    type: String,
    required: [true, "Please provide product category!"],
    enum: ["office", "kitchen", "bedroom"]
  },
  company: {
    type: String,
    required: [true, "Please provide company!"],
    enum: {
      values: ["ikea", "liddy", "marcos"],
      message: "{VALUE} is not supprted!"
    }
  },
  colors: {
    type: [String],
    default: ["#222"],
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  freeShipping: {
    type: Boolean,
    default: false
  },
  inventory: {
    type: Number,
    required: true,
    default: 15
  },
  averageRating: {
    type: Number,
    default: 0
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
})

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
  // match: { rating: 5 }
})

ProductSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ product: this._id })
  next()
})

module.exports = mongoose.model("Product", ProductSchema)