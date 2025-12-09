import nodemailer from "nodemailer";
import { config } from "../config/env.js";

export const sendOTPEmail = async (to, subject, message) => {
    
  const transporter = nodemailer.createTransport({

    service: "gmail",          
    
  });

  const mailOptions = {
    from: config.user,
    to,
    subject,
    text: message,
  };

  return transporter.sendOTPEmail(mailOptions);
}

