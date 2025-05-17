import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["Disease", "Patient"] },
  patientId: { type: mongoose.Types.ObjectId, ref: "Patient" },
  diseaseId: { type: mongoose.Types.ObjectId, ref: "Disease" },
  userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  message: { type: String, required: true },
  isActive: { type: Boolean, default: false },
});

export const Alert = mongoose.model("Alert", alertSchema);
