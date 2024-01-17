const { isValidObjectId } = require("mongoose");
const Movie = require("../models/movie");
const Review = require("../models/review");

const { sendError, getAverageRatings } = require("../utils/helper");

exports.addReview = async (req, res) => {
  const { movieId } = req.params;
  const { content, rating } = req.body;

  //User id will come from isAuth Middleware
  const userId = req.user._id;

  if (!isValidObjectId(movieId)) {
    return sendError(res, "Invalid movie!");
  }

  //We don't add reviews for private movie
  const movie = await Movie.findOne({ _id: movieId, status: "public" });

  if (!movie) {
    return sendError(res, "Movie not found!", 404);
  }

  //Check if user is alredy reviewed movie
  const isAlredyReviewed = await Review.findOne({
    owner: userId,
    parentMovie: movie._id,
  });
  if (isAlredyReviewed) {
    return sendError(res, "Invalid request, Review is alredy there!");
  }

  //Create and Update review
  const newReview = new Review({
    owner: userId,
    parentMovie: movie._id,
    content,
    rating,
  });

  //Save review in movie
  movie.reviews.push(newReview._id);

  //Updating review in Movie modal
  await movie.save();

  //Saving new Review
  await newReview.save();

  //We need to send average ratings so that we can update the UI With latest ratings.
  const reviews = await getAverageRatings(movie._id);
  res.json({
    message: "Your review has been added.",
    reviews,
  });
};

exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { content, rating } = req.body;

  const userId = req.user._id;

  //If user is not verified
  if (!req.user.isVerified) {
    return sendError(res, "Please Verify your email first !");
  }

  if (!isValidObjectId(reviewId)) {
    return sendError(res, "Invalid review ID!");
  }

  //Check the review and its belong to the owner
  const review = await Review.findOne({ owner: userId, _id: reviewId });

  //If no review
  if (!review) return sendError(res, "Review not found!", 404);

  review.content = content;
  review.rating = rating;

  await review.save();

  res.json({
    message: "Your review has been updated.",
  });
};

exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  const userId = req.user._id;

  if (!isValidObjectId(reviewId)) {
    return sendError(res, "Invalid review ID!");
  }

  const review = await Review.findOne({ owner: userId, _id: reviewId });

  if (!review) return sendError(res, "Invalid Request, Review not found!", 404);

  //remove review from movie database
  const movie = await Movie.findById(review.parentMovie).select("reviews");
  //Long Form if(rid !== reviewId) return rId => Short Form  rId !== reviewId
  movie.reviews = movie.reviews.filter((rId) => rId.toString() !== reviewId);

  await Review.findByIdAndDelete(reviewId);

  await movie.save();

  res.json({ message: "Review removed successfully!" });
};

exports.getReviewsByMovie = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) {
    return sendError(res, "Invalid movie ID!");
  }

  /**
   1. Find Movie by Id,
   2. Populate the reviews,
   3. Inside populate reviews, populate ony owner name as popluate chain
   4. select only reviews
   */
  const movie = await Movie.findById(movieId)
    .populate({
      path: "reviews",
      populate: {
        path: "owner",
        select: "name",
      },
    })
    .select("reviews title");

  const reviews = movie.reviews.map((r) => {
    const { owner, content, rating, _id: reviewId } = r;
    //Renameing _id as ownerId
    const { name, _id: ownerId } = owner;
    return {
      id: reviewId,
      owner: {
        id: ownerId,
        name,
      },
      content,
      rating,
    };
  });
  // res.json(movie.reviews);
  // res.json({ reviews });
  res.json({ movie: { title: movie.title, reviews } });
};
