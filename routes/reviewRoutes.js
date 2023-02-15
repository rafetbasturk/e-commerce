const { Router } = require("express")
const reviewController = require("../controllers/reviewController")
const { authenticateUser } = require("../middlewares/authentication")

const router = Router()

router.route("/")
  .get(reviewController.getAllReviews)
  .post(authenticateUser, reviewController.createReview)

router.route("/:id")
  .get(reviewController.getSingleReview)
  .patch(authenticateUser, reviewController.updateReview)
  .delete(authenticateUser, reviewController.deleteReview)

module.exports = router