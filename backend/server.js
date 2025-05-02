import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js"; 
import blogPostRoutes from "./routes/blogPost.route.js";
import contactRoutes from "./routes/contact.route.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjusting for both dev (localhost) and prod (Render)
const allowedOrigins = [
  "http://localhost:5173",  // Localhost for dev
  "https://five40airbasegroup-paf-frontend.onrender.com", // Render Frontend URL
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes); 
app.use("/api/posts", blogPostRoutes);
app.use("/api/contact", contactRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});