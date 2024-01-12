const { check, validationResult } = require("express-validator");
const genres = require("../utils/genres");
const { isValidObjectId } = require("mongoose");

exports.userValidator = [
  check("name").trim().not().isEmpty().withMessage("Name is missing"),
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password Must be 8 to 20 characters long"),
];

//Validate the values or convert into error
exports.validate = (req, res, next) => {
  const error = validationResult(req).array();
  console.log(error);
  if (error.length) {
    return res.json({ error: error[0].msg });
  }
  next();
};

//Validate New Password
exports.validatePassword = [
  check("newPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password Must be 8 to 20 characters long"),
];

//Validate sign in
exports.signInValidator = [
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid"),
  check("password").trim().not().isEmpty().withMessage("Password is missing"),
];

//To validate actor inputs
exports.actorInfoValidator = [
  check("name").trim().not().isEmpty().withMessage("Actor Name is invalid"),
  check("about")
    .trim()
    .not()
    .isEmpty()
    .withMessage("About is a required field"),
  check("gender")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Gender is a required field"),
];

//To Validate Movie
exports.validateMovie = [
  check("title").trim().not().isEmpty().withMessage("Movie title is missing !"),
  check("storyLine")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Storyline is important !"),
  check("language").trim().not().isEmpty().withMessage("Language is missing !"),
  check("releseDate").isDate().withMessage("Relese date is important !"),
  check("status")
    .isIn(["public", "private"])
    .withMessage("Movie status must be Public or Private !"),
  check("type")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Movie type title is missing !"),
  //Check if genra is array
  check("genres")
    .isArray()
    .withMessage("Genres must be an array of string !")
    .custom((value, { req }) => {
      //Check if enter genras are from list of genras
      for (let g of value) {
        if (!genres.includes(g)) {
          throw Error("Invalid genres !");
        }
      }
      //Its Important to pass return true; else it won't move further
      return true;
    }),
  check("tags")
    .isArray({ min: 1 })
    .withMessage("Tags must be an array of string !")
    .custom((tags, { req }) => {
      //Check if enter tags is type of string or not
      for (let tag of tags) {
        if (typeof tag !== "string") {
          throw Error("Tags must be an array of string !");
        }
      }
      return true;
    }),
  check("cast")
    .isArray()
    .withMessage("Genres must be an array of objects !")
    .custom((cast) => {
      //Check if cast have valid object id, roalAs and leadActor status
      for (let c of cast) {
        //Check for valid ObjectId
        if (!isValidObjectId(c.actor)) {
          throw Error("Invalid cast id inside cast !");
        }
        //Check for valid role
        if (!c.roleAs?.trim()) {
          throw Error("Role as missing inside cast !");
        }
        //Check for valid leadActor
        if (typeof c.leadActor != "boolean") {
          throw Error("Only Accept boolean values of lead actor inside cast !");
        }
      }
      return true;
    }),

  // check("poster").custom((_, { req }) => {
  //   if (!req.file) {
  //     throw Error("Poster file is invalid !");
  //   }
  //   return true;
  // }),
];

exports.validateTrailer = check("trailer")
  .isObject()
  .withMessage("trailer must be an objects with url and public id!")
  .custom(({ url, public_id }) => {
    try {
      const result = new URL(url);
      //If try to upload URL Without http / https
      if (!result.protocol.includes("http")) {
        throw Error("Trailer URL is invalid !");
      }
      //Check public id
      //Ex : https://res.cloudinary.com/dsibkqsgu/video/upload/v1703335838/bhkb6muxfeow5hg2t3ot.mp4
      const arr = url.split("/");
      //Get last element of Arr URL
      const publicId = arr[arr.length - 1].split(".")[0];

      if (publicId !== public_id) {
        throw Error("Trailer Public id is invalid !");
      }
      return true;
    } catch (error) {
      throw Error("Trailer URL is invalid !");
    }
  });
