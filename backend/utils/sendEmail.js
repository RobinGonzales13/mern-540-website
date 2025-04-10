import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Admin Login OTP",
    text: `Your OTP for login is: ${otp}. This OTP expires in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully to:", email);
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};
