import express from "express";
import { login, verifyToken, createUser } from "../controllers/polAuth.controller.js";

const router = express.Router();

router.post("/login", login);
router.get("/verify", verifyToken);
router.post("/create-user", createUser); // ✅ This must come AFTER router is initialized

export default router;