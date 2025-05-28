import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import POLUser from "../models/polUser.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Store reset tokens temporarily (in production, use Redis or similar)
const resetTokens = new Map();

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
    try {
        const { username, reason } = req.body;

        // Check if user exists
        const user = await POLUser.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a secure token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

        // Store token temporarily (in production, use Redis or similar)
        resetTokens.set(token, {
            username,
            expiresAt
        });

        // Send email to admin
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "POL User Password Reset Request",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #2c5282;">Password Reset Request</h2>
                    <p>A POL user has requested a password reset:</p>
                    <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <p><strong>Username:</strong> ${username}</p>
                        <p><strong>Reason:</strong> ${reason}</p>
                    </div>
                    <p>Click the button below to reset the password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://five40airbasegroup-paf-frontend.onrender.com/admin-reset-password/${token}" 
                           style="background-color: #4299e1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #718096; font-size: 0.9em;">This link will expire in 1 hour.</p>
                    <p style="color: #718096; font-size: 0.9em;">If you did not request this password reset, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "Password reset request sent to admin" });
    } catch (error) {
        console.error("Password reset request error:", error);
        res.status(500).json({ message: "Failed to process password reset request" });
    }
};

export const verifyResetToken = async (req, res) => {
    const { token } = req.params;

    try {
        const resetData = resetTokens.get(token);
        
        if (!resetData) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        if (Date.now() > resetData.expiresAt) {
            resetTokens.delete(token);
            return res.status(400).json({ success: false, message: "Reset token has expired" });
        }

        res.json({ 
            success: true, 
            username: resetData.username 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error verifying reset token" });
    }
};

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const resetData = resetTokens.get(token);
        
        if (!resetData) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        if (Date.now() > resetData.expiresAt) {
            resetTokens.delete(token);
            return res.status(400).json({ success: false, message: "Reset token has expired" });
        }

        const user = await POLUser.findOne({ username: resetData.username });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.password = newPassword;
        await user.save();

        resetTokens.delete(token);

        const updatedUser = await POLUser.findOne({ username: resetData.username });
        const isMatch = await bcrypt.compare(newPassword, updatedUser.password);
        
        if (!isMatch) {
            throw new Error("Password update verification failed");
        }

        res.json({ success: true, message: "Password has been reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ success: false, message: "Error resetting password" });
    }
}; 