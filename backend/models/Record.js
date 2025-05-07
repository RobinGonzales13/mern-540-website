import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    controlNumber: { type: String, required: true, unique: true },
    purpose: { type: String, required: true },
    receivedBy: { type: String, required: true },
    liters: { type: Number, required: true }
});

// It looks like the model name in the `mongoose.model` function should be "Record" instead of "adf"
const Record = mongoose.model("Record", recordSchema, "adf");

export default Record;