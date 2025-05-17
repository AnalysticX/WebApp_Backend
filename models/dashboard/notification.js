import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["Disease", "Patient"] },
  patientId: { type: mongoose.Types.ObjectId, ref: "Patient" },
  userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  diseaseId: { type: mongoose.Types.ObjectId, ref: "Disease" },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
});

export const Notification = mongoose.model("Notification", notificationSchema);
