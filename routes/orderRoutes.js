const { Router } = require("express");
const orderController = require("../controllers/orderController");
const { authenticateUser, authorizePermissions } = require("../middlewares/authentication");

const router = Router()

router.use(authenticateUser)

router.route("/")
  .get(authorizePermissions("admin"), orderController.getAllOrders)
  .post(orderController.createOrder)

router.route('/showAllMyOrders')
  .get(orderController.getCurrentUserOrders)

router.route("/:id")
  .get(orderController.getSingleOrder)
  .patch(orderController.updateOrder)

module.exports = router