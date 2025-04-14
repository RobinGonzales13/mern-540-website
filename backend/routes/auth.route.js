import express from "express";
import { requestOTP, verifyOTP, requestPasswordReset, resetPassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", requestOTP);
router.post("/verify-otp", verifyOTP);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;
