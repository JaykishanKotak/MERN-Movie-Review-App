const nodemailer = require("nodemailer");

exports.genrateOTP = (otp_length = 6) => {
  //Genrate 6 Digit Otp (otp_length) can by dynamically change
  let OTP = "";
  for (let i = 1; i <= otp_length; i++) {
    const randomVal = Math.round(Math.random() * 9);
    OTP += randomVal;
  }
  return OTP;
};

exports.genrateMailTranspoter = () =>
  nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_TRAP_USER,
      pass: process.env.MAIL_TRAP_PASSWORD,
    },
  });
