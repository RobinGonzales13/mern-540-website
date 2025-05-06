import express from "express";
import { requestOTP, verifyOTP, requestPasswordReset, resetPassword, verifyToken } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", requestOTP);
router.post("/verify-otp", verifyOTP);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.get("/verify", verifyToken);

export default router;
