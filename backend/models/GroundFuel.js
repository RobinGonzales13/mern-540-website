import mongoose from "mongoose";

const groundFuelSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    controlNumber: { type: String, required: true, unique: true },
    purpose: { type: String, required: true },
    receivedBy: { type: String, required: true },
    liters: { type: Number, required: true }
});

const GroundFuel = mongoose.model("GroundFuel", groundFuelSchema, "groundfuel");

export default GroundFuel;