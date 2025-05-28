import express from "express";
import { login, verifyToken, requestPasswordReset } from "../controllers/polAuth.controller.js";

const router = express.Router();

router.post("/login", login);
router.get("/verify", verifyToken);
router.post("/request-password-reset", requestPasswordReset);

export default router;