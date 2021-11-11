const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");

dotenv.config();

async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.URL}users/verify/${token}`;

  const msg = {
    to: email,
    from: "test.oksentiuk@gmail.com",
    subject: "Please verify your email",
    html: `To verify your account please go by <a href="${verificationUrl}">this link</a>`,
  };

  await sgMail.send(msg);
}

module.exports = {
  sendVerificationEmail,
};
