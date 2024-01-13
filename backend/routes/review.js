const {
  addReview,
  updateReview,
  deleteReview,
  getReviewsByMovie,
} = require("../controllers/review");
const { isAuth } = require("../middlewares/auth");
const { validateRatings, validate } = require("../middlewares/validator");

const router = require("express").Router();

//Add a review - only a auth user can add a review
router.post("/add/:movieId", isAuth, validateRatings, validate, addReview);

//Update Review
router.patch("/:reviewId", isAuth, validateRatings, validate, updateReview);

//Delete Review
router.delete("/:reviewId", isAuth, deleteReview);

//Get Reviews by Movie
router.get("/get-reviews-by-movie/:movieId", getReviewsByMovie);

module.exports = router;
