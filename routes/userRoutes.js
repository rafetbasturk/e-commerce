const { Router } = require("express")
const userController = require("../controllers/userController")
const { authenticateUser, authorizePermissions } = require("../middlewares/authentication")

const router = Router()

router.use(authenticateUser)

router.route("/")
  .get(authorizePermissions("admin"), userController.getAllUsers)

router.route("/showMe")
  .get(userController.showCurrentUser)

router.route("/updateUser")
  .patch(userController.updateUser)

router.route("/updateUserPassword")
  .patch(userController.updateUserPassword)

router.route("/:id")
  .get(userController.getSingleUser)

module.exports = router