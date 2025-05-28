import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import POLUser from "../models/polUser.model.js";
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

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await POLUser.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ success: true, token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await POLUser.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user: { id: user._id, username: user.username } });
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export const requestPasswordReset = async (req, res) => {
    const { username, reason } = req.body;

    try {
        // Check if user exists
        const user = await POLUser.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Send email to admin
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "POL User Password Reset Request",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p><strong>Username:</strong> ${username}</p>
                    <p><strong>Reason for Reset:</strong></p>
                    <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #007bff; font-style: italic;">
                        ${reason}
                    </blockquote>
                    <hr>
                    <p style="color: #666;">Please review this request and reset the password for this user.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.json({ 
            success: true, 
            message: "Password reset request has been sent to the administrator" 
        });
    } catch (error) {
        console.error("Password reset request error:", error);
        res.status(500).json({ success: false, message: "Failed to process password reset request" });
    }
}; 