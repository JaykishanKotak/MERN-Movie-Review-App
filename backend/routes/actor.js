const express = require("express");
const {
  createActor,
  updateActor,
  removeActor,
  searchActor,
  getLatestActors,
  getSingleActor,
} = require("../controllers/actor");
const { uploadImage } = require("../middlewares/multer");
const { actorInfoValidator, validate } = require("../middlewares/validator");

const router = express.Router();

//Create actor
router.post(
  "/create",
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  createActor
);

//Update actor
router.post(
  "/update/:actorId",
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  updateActor
);

//Delete actor
router.delete("/:actorId", removeActor);

//Search actor
router.get("/search", searchActor);

//Get leatest actors
router.get("/latest-uploads", getLatestActors);

//Get single actor
router.get("/single/:id", getSingleActor);

module.exports = router;
