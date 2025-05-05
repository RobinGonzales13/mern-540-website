const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    controlNumber: { type: String, required: true, unique: true },
    purpose: { type: String, required: true },
    receivedBy: { type: String, required: true },
    liters: { type: Number, required: true }
});

const Record = mongoose.model("adf", recordSchema, "adf");

module.exports = Record;
