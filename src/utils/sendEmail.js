import createError from "http-errors";
import { sendEmailWithNodemailer } from "./nodeMailer.js";

const sendEmail = async (emailData) => {
  try {
    await sendEmailWithNodemailer(emailData);
  } catch (emailError) {
    throw createError(500, "Failed to send verification email!!");
  }
};

export { sendEmail };
