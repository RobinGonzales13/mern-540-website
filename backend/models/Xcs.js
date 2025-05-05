const mongoose = require("mongoose");

const xcsSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    controlNumber: { type: String, required: true, unique: true },
    purpose: { type: String, required: true },
    receivedBy: { type: String, required: true },
    liters: { type: Number, required: true }
});

const Xcs = mongoose.model("Xcs", xcsSchema, "xcs");

module.exports = Xcs;
