const mongoose = require("mongoose");

const adfSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    controlNumber: { type: String, required: true, unique: true },
    purpose: { type: String, required: true },
    receivedBy: { type: String, required: true },
    liters: { type: Number, required: true }
});

const Adf = mongoose.model("Adf", adfSchema, "adf");

module.exports = Adf;
