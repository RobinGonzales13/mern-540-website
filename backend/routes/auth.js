const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const router = express.Router();

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Store OTPs temporarily (in production, use Redis or similar)
const otpStore = new Map();

router.post("/login", async (req, res) => {
    console.log("Incoming Login Request:", req.body);

    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: { id: user._id, email: user.email } });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

router.get("/user", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Send OTP
router.post("/send-otp", async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        
        // Store OTP with timestamp
        otpStore.set(email, {
            otp,
            timestamp: Date.now()
        });

        // Send OTP via email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP for POL Dump Login",
            text: `Your OTP is: ${otp}. This OTP will expire in 5 minutes.`
        });

        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Error sending OTP" });
    }
});

// Verify OTP and login
router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        // Get stored OTP
        const storedOtp = otpStore.get(email);
        
        if (!storedOtp) {
            return res.status(400).json({ message: "OTP not found or expired" });
        }

        // Check if OTP is expired (5 minutes)
        if (Date.now() - storedOtp.timestamp > 5 * 60 * 1000) {
            otpStore.delete(email);
            return res.status(400).json({ message: "OTP expired" });
        }

        // Verify OTP
        if (storedOtp.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Clear OTP after successful verification
        otpStore.delete(email);

        // Generate JWT token
        const user = await User.findOne({ email });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ token });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Error verifying OTP" });
    }
});

module.exports = router;
