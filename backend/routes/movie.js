const express = require("express");
const { isAuth, isAdmin } = require("../middlewares/auth");
const { uploadVideo, uploadImage } = require("../middlewares/multer");
const {
  uploadTrailer,
  createMovie,
  updateMoviewWithoutPoster,
  updateMoviewWithPoster,
  removeMovie,
} = require("../controllers/movie");
const { parseData } = require("../utils/helper");
const { validateMovie, validate } = require("../middlewares/validator");

const router = express.Router();

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

//delete a movie
router.delete("/:movieId", isAuth, isAdmin, removeMovie);
module.exports = router;
