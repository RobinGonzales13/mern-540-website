const express = require("express");
const Record = require("../models/Record");

const router = express.Router();

router.post("/addMany", async (req, res) => {
    try {
        const { adf } = req.body;
        if (!adf || !Array.isArray(adf)) {
            return res.status(400).json({ error: "Invalid data format" });
        }
        await Record.insertMany(adf);
        res.status(201).json({ message: "Records added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error adding records", details: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const records = await Record.find();
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving records" });
    }
});

module.exports = router;
