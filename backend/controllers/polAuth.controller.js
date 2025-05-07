import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import POLUser from "../models/polUser.model.js";


export const createUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existing = await POLUser.findOne({ username });
    if (existing) {
      return res.status(400).json({ success: false, message: "Username already exists" });
    }

    const newUser = new POLUser({ username, password });
    await newUser.save();

    res.status(201).json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await POLUser.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ success: true, token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await POLUser.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user: { id: user._id, username: user.username } });
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
}; 