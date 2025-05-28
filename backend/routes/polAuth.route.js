import express from "express";
import { login, verifyToken, requestPasswordReset, verifyResetToken, resetPassword } from "../controllers/polAuth.controller.js";

const router = express.Router();

router.post("/login", login);
router.get("/verify", verifyToken);
router.post("/request-password-reset", requestPasswordReset);
router.get("/verify-reset-token/:token", verifyResetToken);
router.post("/reset-password", resetPassword);

export default router;