const express = require("express");

const {
  create,
  verifyEmail,
  resendEmailVerifiationToken,
  forgetPassword,
  sendResendPasswordTokenStatus,
  resetPassword,
  signIn,
} = require("../controllers/user");
const {
  userValidator,
  validate,
  validatePassword,
  signInValidator,
} = require("../middlewares/validator");
const { isValidPasswordResetToken } = require("../middlewares/user");

const router = express.Router();

//Create User '/api/create-user';
router.post("/create", userValidator, validate, create);

//Sign in;
router.post("/sign-in", signInValidator, validate, signIn);

//verify email
router.post("/verify-email", verifyEmail);

//Resend verification token
router.post("/resend-email-verifiation-token", resendEmailVerifiationToken);

//Forget password
router.post("/forget-password", forgetPassword);

//Verify Password Reset Token
router.post(
  "/verify-password-reset-token",
  isValidPasswordResetToken,
  sendResendPasswordTokenStatus
);

//Reset Password
router.post(
  "/reset-password",
  validatePassword,
  validate,
  isValidPasswordResetToken,
  resetPassword
);

// router.post(
// "/sign-in",
//Middleware
// (req, res, next) => {
// const { email, password } = req.body;
//if (!email || !password) {
// return res.json({ error: "Email / Password is required" });
//}
//We can create logic here and according to decide go to next or not
//next();
//},
//(req, res) => {
//res.send("<h1>Sign in.</h1>");
//}
//);

//Home Route
//router.get("/home", (req, res) => {
//res.send(
//"<h1>Hello I am From Backend Server, You are visiting Home Page.</h1>"
//);
//});

//About Route
//router.get(
//"/about",
//Middleware
//(req, res, next) => {
//We can create logic here and according to decide go to next or not
// next();
//},
//(req, res) => {
//res.send("<h1>You are visiting About Page.</h1>");
//}
//);

module.exports = router;
