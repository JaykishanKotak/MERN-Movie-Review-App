//Send mail for OTP
// var transport = nodemailer.createTransport({
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "1829c53d931cce",
//     pass: "56e96eb264acf6"
//   }
// });

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const passwordResetTokenSchema = mongoose.Schema(
  {
    //User id
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //Password Reset Token
    token: {
      type: String,
      required: true,
    },
    //Expire Timer 1hr
    createAt: {
      type: Date,
      expires: 3600,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

//Hash OTP/Token before save in into DB
passwordResetTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await bcrypt.hash(this.token, 10);
  }
  next();
});

//Compare token
passwordResetTokenSchema.methods.compareToken = async function (token) {
  //Compare result token with token stored in db
  const result = await bcrypt.compare(token, this.token);
  return result;
};
module.exports = mongoose.model("PasswordResetToken", passwordResetTokenSchema);
