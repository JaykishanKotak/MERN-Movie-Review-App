// const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../models/user");
const EmailVerifiationToken = require("../models/emailVerificationToken");
const PasswordRestToken = require("../models/passwordRestToken");
const { isValidObjectId } = require("mongoose");
const { genrateMailTranspoter, genrateOTP } = require("../utils/mail");
const { sendError, genrateRandomByte } = require("../utils/helper");
const jwt = require("jsonwebtoken");

exports.create = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  //Check for duplicate user
  const oldUser = await User.findOne({ email });
  //return console.log(oldUser);
  if (oldUser) {
    //return res.status(401).json({ error: "Email is alredy in use !" });
    return sendError(res, "Email is alredy in use !");
  }
  //Create new user using mongo models
  const newUser = new User({ name, email, password });

  //Genrate 6 Digit Otp and Store in DB
  // let OTP = "";
  // for (let i = 0; i <= 5; i++) {
  //   const randomVal = Math.round(Math.random() * 9);
  //   OTP += randomVal;
  // }

  //Genrate 6 Digitl OTP Function
  let OTP = genrateOTP();

  const newEmailVerifiationToken = EmailVerifiationToken({
    owner: newUser._id,
    token: OTP,
  });

  await newEmailVerifiationToken.save();

  //Send mail for OTP
  // var transport = nodemailer.createTransport({
  //   host: "sandbox.smtp.mailtrap.io",
  //   port: 2525,
  //   auth: {
  //     user: "1829c53d931cce",
  //     pass: "56e96eb264acf6",
  //   },
  // });

  //Genrate Mail transpoter function
  const transport = genrateMailTranspoter();
  //Mail for OTP
  transport.sendMail({
    from: "verification@moviereview.app",
    to: newUser.email,
    subject: "Email Verifiaction",
    html: `
    <p>Your Verification Token / OTP is</p>
    <h1>${OTP}</h1>
    `,
  });
  //Create in Db
  await newUser.save();
  // return res.status(201).json({
  //   //user: newUser
  //   message:
  //     "Please verify your email. OTP has been sent to your email account!",
  // });
  return res.status(201).json({
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
  //res.send("<h1>Create User Controller.</h1>");
};

exports.verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body;

  if (!isValidObjectId(userId)) {
    //return res.json({ error: "Invalid user!" });
    return sendError(res, "Invalid user!");
  }
  const user = await User.findById(userId);
  if (!user) {
    //return res.json({ error: "User not found!" });
    return sendError(res, "User not found!", 404);
  }

  if (user.isVerified) {
    //return res.json({ error: "User is alredy verified!" });
    return sendError(res, "User is alredy verified!");
  }

  const token = await EmailVerifiationToken.findOne({ owner: userId });

  if (!token) {
    //return res.json({ error: "Token not found!" });
    return sendError(res, "Token not found!", 404);
  }

  const isMatched = await token.compareToken(OTP);

  if (!isMatched) {
    //return res.json({ error: "Please submit a valid otp!" });
    return sendError(res, "Please submit a valid OTP!");
  }
  user.isVerified = true;

  await user.save();

  //Delete token after use
  await EmailVerifiationToken.findByIdAndDelete(token._id);

  //Welcome email
  //Send mail for OTP
  const transport = genrateMailTranspoter();

  //Mail for OTP
  transport.sendMail({
    from: "verification@moviereview.app",
    to: user.email,
    subject: "Email Verifiaction",
    html: `
    <h1>Welcome to Movie Review App</h1>
    <p>Thanks for Choosing Us !</p>
    `,
  });
  //res.status(200).json({ message: "Your Email is verified." });

  const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });

  res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      token: jwtToken,
    },
    message: "Your email is verified.",
  });
};

exports.resendEmailVerifiationToken = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    //return res.json({ error: "User not found!" });
    return sendError(res, "User not found!", 404);
  }

  //If user is already verified
  if (user.isVerified) {
    //return res.json({ error: "This email id is alredy verified!" });
    return sendError(res, "This email id is alredy verified!");
  }

  //if valid token is alredy exists
  const alredyHasToken = await EmailVerifiationToken.findOne({ owner: userId });

  if (alredyHasToken) {
    // return res.json({
    //   error: "Only after one hour you can request for a new token!",
    // });
    return sendError(
      res,
      "Only after one hour you can request for a new token!"
    );
  }

  //Genrate new token
  //Genrate 6 Digit Otp and Store in DB
  let OTP = genrateOTP();

  const newEmailVerifiationToken = EmailVerifiationToken({
    owner: user._id,
    token: OTP,
  });

  await newEmailVerifiationToken.save();

  //Send mail for OTP
  const transport = genrateMailTranspoter();

  //Mail for OTP
  transport.sendMail({
    from: "verification@moviereview.app",
    to: user.email,
    subject: "Email Verifiaction",
    html: `
     <p>Your Verification Token / OTP is</p>
     <h1>${OTP}</h1>
     `,
  });

  return res.status(200).json({
    message:
      "Please verify your email. OTP has been sent to your email account!",
  });
};

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return sendError(res, "Email is missing!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    return sendError(res, "User not found!", 404);
  }

  const alreadyHasToken = await PasswordRestToken.findOne({ owner: user._id });

  if (alreadyHasToken) {
    return sendError(
      res,
      "Only after one hour you can request for a new token!"
    );
  }

  const token = await genrateRandomByte();

  const newPasswordResetToken = await PasswordRestToken({
    owner: user._id,
    token: token,
  });
  await newPasswordResetToken.save();

  //Genrate Password reset link and sent to user on mail
  const resetPasswordUrl = `localhost:3000/auth/reset-password?token=${token}&id=${user._id}`;

  const transport = genrateMailTranspoter();

  //Mail for Reset password
  transport.sendMail({
    from: "security@moviereview.app",
    to: user.email,
    subject: "Reset Password Link",
    html: `
       <p>Click here to reset password</p>
       <a href='${resetPasswordUrl}'> Change password</a>

       `,
  });

  res.status(200).json({
    message: "Reset password link has been sent to your email account!",
  });
};

exports.sendResendPasswordTokenStatus = (req, res) => {
  res.json({ valid: true });
};

exports.resetPassword = async (req, res) => {
  const { newPassword, userId } = req.body;

  const user = await User.findById(userId);

  const matched = await user.comparePassword(newPassword);

  if (matched) {
    return sendError(
      res,
      "The new password must be different from the old one !"
    );
  }

  //Update new password
  user.password = newPassword;
  await user.save();

  //Remove password reset token
  await PasswordRestToken.findByIdAndDelete(req.resetToken._id);

  const transport = genrateMailTranspoter();

  //Mail for Successful Reset password
  transport.sendMail({
    from: "security@moviereview.app",
    to: user.email,
    subject: "Password Reset Successfully",
    html: `
       <h1>Password Reset Successfully</h1>
       <p> Now you can use new password.</p>

       `,
  });

  res.status(200).json({
    message: "Password reset successfully, now you can use new password.!",
  });
};

exports.signIn = async (req, res, next) => {
  //try {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return sendError(res, "Email/Password mismatch!");
  }

  const matched = await user.comparePassword(password);

  if (!matched) {
    return sendError(res, "Email/Password mismatch!");
  }

  const { _id, name, isVerified } = user;
  //If email and password corrert, create a jwt token
  //Don't use any sensitive data in JWT, its just a sign and check token
  const jwtToken = jwt.sign({ userId: _id }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });

  res.json({ user: { id: _id, name, email, isVerified, token: jwtToken } });
  // } catch (error) {
  //   //return sendError(res, error.message);

  //   //It will not go to front-end
  //   next(error.message);
  // }
};
