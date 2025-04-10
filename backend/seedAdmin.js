import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js"; // Ensure the path is correct

dotenv.config();

const createAdminUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const existingAdmin = await User.findOne({ role: "admin" });
        if (existingAdmin) {
            console.log("Admin user already exists.");
            process.exit();
        }

        const adminUser = new User({
            name: "Admin",
            email: "gceis540abg2024@gmail.com",
            password: "admin123",
        });

        await adminUser.save();
        console.log("Admin user created successfully.");
        process.exit();
    } catch (error) {
        console.error("Error creating admin user:", error.message);
        process.exit(1);
    }
};

createAdminUser();
