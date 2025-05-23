import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { createPost, getPosts, deletePost, updatePost  } from "../controllers/blogPost.controller.js";

const router = express.Router();

router.post("/create", upload.array("images", 10), createPost);
router.get("/", getPosts);
router.delete("/:id", deletePost);
router.put("/:id", upload.array("images", 10), updatePost);

export default router;
