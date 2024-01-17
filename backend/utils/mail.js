const nodemailer = require("nodemailer");
var SibApiV3Sdk = require("sib-api-v3-sdk");

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

//For Live - sendin blue mail service
exports.sendEmail = async (name, email, subject, htmlContent) => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;

  const apikey = defaultClient.authentications["api-key"];
  apikey.apikey = process.env.SIB_API_KEY;
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;

  sendSmtpEmail.sender = {
    name: "Five Star MRP",
    email: process.env.OFFICIAL_EMAIL,
  };

  sendSmtpEmail.to = [{ email, name }];

  return await apiInstance.sendTransacEmail(sendSmtpEmail);
};

/**
 * Examle :
  const htmlContext = `
      <p>Your Verification OTP</p>
      <h1>OTP ${OTP}</h1>
    `;
    
  await sendMail(user.name, user.email, "Email Verifiaction", htmlContext);
 */
