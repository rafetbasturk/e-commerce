const { Router } = require("express");
const productController = require("../controllers/productController");
const { getSingleProductReviews } = require("../controllers/reviewController");
const { authenticateUser, authorizePermissions } = require("../middlewares/authentication");

const router = Router()

router.get("/", productController.getAllProducts)

router.get("/:id", productController.getSingleProduct)
router.get("/:id/reviews", getSingleProductReviews)

router.use(authenticateUser)
router.use(authorizePermissions("admin"))

router.post('/', productController.createProduct)

router.post('/uploadImage', productController.uploadImage)

router.route('/:id')
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct)

module.exports = router