import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js"; 
import polAuthRoutes from "./routes/polAuth.route.js";
import blogPostRoutes from "./routes/blogPost.route.js";
import contactRoutes from "./routes/contact.route.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import adfRoutes from "./routes/adf.js";
import xcsRoutes from "./routes/xcs.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
const allowedOrigins = [
    "https://five40airbasegroup-paf-frontend.onrender.com",
    "https://five40airbasegroup-paf-backend.onrender.com"
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log(`❌ Blocked by CORS: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pol", polAuthRoutes);
app.use("/api/posts", blogPostRoutes);
app.use("/api/contact", contactRoutes);

app.use("/api/adf", adfRoutes);
app.use("/api/xcs", xcsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Connect to database
connectDB();

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});