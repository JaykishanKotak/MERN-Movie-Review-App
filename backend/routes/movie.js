const express = require("express");
const { isAuth, isAdmin } = require("../middlewares/auth");
const { uploadVideo, uploadImage } = require("../middlewares/multer");
const {
  uploadTrailer,
  createMovie,
  updateMoviewWithoutPoster,
  updateMoviewWithPoster,
  removeMovie,
  getMovies,
  getMovieForUpdate,
  updateMovie,
  searchMovie,
  getLatestUploads,
  getSingleMovie,
  getRelatedMovies,
  getTopRatedMovies,
} = require("../controllers/movie");
const { parseData } = require("../utils/helper");
const {
  validateMovie,
  validate,
  validateTrailer,
} = require("../middlewares/validator");

const router = express.Router();

// ======================== For Admin Only ========================

//Upload movie trailer
router.post(
  "/upload-trailer",
  isAuth,
  isAdmin,
  uploadVideo.single("video"),
  uploadTrailer
);

//Create a movie
router.post(
  "/create",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validateTrailer,
  validate,
  createMovie
);

//Update a movie without a poster
//We use patch because we don't want to updare entier doucumet
//Put use to update entier document
router.patch(
  "/update-movie-without-poster/:movieId",
  isAuth,
  isAdmin,
  //parseData,
  validateMovie,
  validate,
  updateMoviewWithoutPoster
);

//Update a movie with a poster
router.patch(
  "/update-movie-with-poster/:movieId",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validate,
  updateMoviewWithPoster
);

//This will be final update method, ignore above two- its just for refrances
router.patch(
  "/update/:movieId",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validate,
  updateMovie
);

//Search movie
router.get("/search", isAuth, isAdmin, searchMovie);

//delete a movie
router.delete("/:movieId", isAuth, isAdmin, removeMovie);

//Get admin movies - admin can fetch private as well as public movies
router.get("/movies", isAuth, isAdmin, getMovies);

//For movie update
router.get("/for-update/:movieId", isAuth, isAdmin, getMovieForUpdate);

// ======================== For Normal Users ========================

//get latest uploads
router.get("/latest-uploads", getLatestUploads);

//get single movie
router.get("/single/:movieId", getSingleMovie);

//get releted movies
router.get("/related/:movieId", getRelatedMovies);

//get top rated movies
router.get("/top-rated", getTopRatedMovies);

module.exports = router;
