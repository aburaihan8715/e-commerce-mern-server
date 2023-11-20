import nodemailer from "nodemailer";
import { smtpPass, smtpUser } from "../secret.js";

// setup transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

const sendEmailWithNodemailer = async (emailData) => {
  try {
    const mailOptions = {
      from: smtpUser, // sender address
      to: emailData.email, // list of receivers
      subject: emailData.subject, // Subject line
      html: emailData.html, // html body
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error occur while sending email:", error);
    throw error;
  }
};

export { sendEmailWithNodemailer };
