import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { sendOTP } from "../utils/sendEmail.js";

let otpStore = {};

export const requestOTP = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await User.findOne({ email, role: "admin" });
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

        await sendOTP(email, otp);
        res.json({ success: true, message: "OTP sent to email" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    if (!otpStore[email] || otpStore[email].otp !== parseInt(otp)) {
        return res.status(401).json({ success: false, message: "Invalid or expired OTP" });
    }

    const admin = await User.findOne({ email, role: "admin" });
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    delete otpStore[email];

    res.json({ success: true, message: "Login successful", token });
};

export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // 5 mins expiry

        await sendOTP(email, otp);

        res.json({ success: true, message: "OTP sent to your email" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const storedOTP = otpStore[email];

        if (!storedOTP || storedOTP.otp !== parseInt(otp) || Date.now() > storedOTP.expiresAt) {
            return res.status(401).json({ success: false, message: "Invalid or expired OTP" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.findOneAndUpdate({ email }, { password: hashedPassword });

        delete otpStore[email];

        res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};