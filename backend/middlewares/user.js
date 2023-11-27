const { isValidObjectId } = require("mongoose");
const PasswordRestToken = require("../models/passwordRestToken");
const { sendError } = require("../utils/helper");

exports.isValidPasswordResetToken = async (req, res, next) => {
  const { token, userId } = req.body;

  if (!token.trim() || !isValidObjectId(userId)) {
    return sendError(res, "Invalid request!");
  }

  const resetToken = await PasswordRestToken.findOne({ owner: userId });
  if (!resetToken) {
    return sendError(res, "Unauthroized access, Invalid token!");
  }

  const matched = await resetToken.compareToken(token);
  if (!matched) {
    return sendError(res, "Unauthroized access, Invalid token!");
  }

  //to access resetToken in controller file
  req.resetToken = resetToken;
  next();
};
