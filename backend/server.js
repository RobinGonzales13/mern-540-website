import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js"; 
import blogPostRoutes from "./routes/blogPost.route.js";
import contactRoutes from "./routes/contact.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json()); 
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/uploads", express.static("uploads")); // ✅ Serve images

// ✅ Fix CORS (Move to the top, before routes)
app.use(cors({ 
    origin: "http://localhost:5173", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Manually set CORS headers for all responses
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// ✅ Routes
app.use("/api/auth", authRoutes); 
app.use("/api/posts", blogPostRoutes);
app.use("/api/contact", contactRoutes);

// ✅ Connect to MongoDB
connectDB();

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
