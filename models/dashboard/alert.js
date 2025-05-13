import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    alertType: { type: String, required: true, enum: ["Disease", "Patient"] },
    patientId: { type: mongoose.Types.ObjectId, ref: "Patient" },
    diseaseId: { type: mongoose.Types.ObjectId, ref: "Disease" },
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    alertMessage: { type: String, required: true },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Alert = mongoose.model("Alert", alertSchema);
