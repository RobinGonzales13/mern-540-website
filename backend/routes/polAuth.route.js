import express from "express";
import { login, verifyToken } from "../controllers/polAuth.controller.js";

const router = express.Router();


import { createUser } from "../controllers/polAuth.controller.js";
router.post("/create-user", createUser); // 👈 Add this line


router.post("/login", login);
router.get("/verify", verifyToken);

export default router; 