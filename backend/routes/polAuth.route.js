import express from "express";
import { login, verifyToken } from "../controllers/polAuth.controller.js";


import { createUser } from "../controllers/polAuth.controller.js";
router.post("/create-user", createUser); // 👈 Add this line


const router = express.Router();

router.post("/login", login);
router.get("/verify", verifyToken);

export default router; 