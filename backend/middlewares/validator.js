const { check, validationResult } = require("express-validator");

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
