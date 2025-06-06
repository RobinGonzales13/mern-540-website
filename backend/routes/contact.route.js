import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import validator from "validator";
import rateLimit from "express-rate-limit";
import axios from "axios";

dotenv.config();
const router = express.Router();

const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: "Too many requests, please try again later." },
});

router.post("/", contactLimiter, async (req, res) => {
    let { name, email, message, captcha } = req.body;

    if (!name || !email || !message || !captcha) {
        return res.status(400).json({ success: false, message: "All fields are required, including CAPTCHA." });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format." });
    }

    try {
        const captchaSecret = process.env.RECAPTCHA_SECRET_KEY;
        const captchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${captchaSecret}&response=${captcha}`;

        const captchaResponse = await axios.post(captchaVerifyUrl);

        if (!captchaResponse.data.success) {
            return res.status(400).json({ success: false, message: "CAPTCHA verification failed." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error verifying CAPTCHA." });
    }

    name = validator.escape(name.replace(/(\r\n|\n|\r)/gm, ""));
    email = validator.escape(email.replace(/(\r\n|\n|\r)/gm, ""));
    message = validator.escape(message);

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Contact Us Form" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `📩 New Contact Message from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px;">
                    <h2 style="color: #333; text-align: center;">New Contact Form Submission</h2>
                    <p style="font-size: 16px;"><strong>Name:</strong> ${validator.escape(name)}</p>
                    <p style="font-size: 16px;"><strong>Email:</strong> ${validator.escape(email)}</p>
                    <p style="font-size: 16px;"><strong>Message:</strong></p>
                    <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #007bff; font-style: italic;">
                        ${validator.escape(message)}
                    </blockquote>
                    <hr>
                    <p style="font-size: 14px; text-align: center; color: #555;">This message was sent from the contact form on your website.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Email sent successfully!" });

    } catch (error) {
        console.error("❌ Error sending email:", error);
        res.status(500).json({ success: false, message: "Error sending email" });
    }
});

export default router;