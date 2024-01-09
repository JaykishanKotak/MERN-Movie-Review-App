const express = require("express");
const {
  createActor,
  updateActor,
  removeActor,
  searchActor,
  getLatestActors,
  getSingleActor,
  getActors,
} = require("../controllers/actor");
const { uploadImage } = require("../middlewares/multer");
const { actorInfoValidator, validate } = require("../middlewares/validator");
const { isAuth, isAdmin } = require("../middlewares/auth");

const router = express.Router();

//Create actor
router.post(
  "/create",
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  createActor
);

//Update actor
router.post(
  "/update/:actorId",
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  updateActor
);

//Delete actor
router.delete("/:actorId", isAuth, isAdmin, removeActor);

//Search actor
router.get("/search", isAuth, isAdmin, searchActor);

//Get leatest actors -  no longer in use
router.get("/latest-uploads", isAuth, isAdmin, getLatestActors);

//Get leatest actors
router.get("/actors", isAuth, isAdmin, getActors);

//Get single actor
router.get("/single/:id", getSingleActor);

module.exports = router;
