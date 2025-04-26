import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    ayushmanId: {
      type: String,
      required: [true, "Please provide your AyushmanId"],
      unique: true,
    },
    fullName: { type: String, required: [true, "Please enter your Full Name"] },
    age: { type: Number, required: [true, "Please provide your age"] },
    gender: {
      type: String,
      required: [true, "Please provide your gender"],
      enum: ["Male", "Female", "Other"],
    },
    disease: {
      type: String,
      required: [true, "Please enter the disease"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    lastVisit: { type: Date },
    address: String,
  },
  { timestamps: true }
);

patientSchema.pre("save", function (next) {
  if (!this.lastVisit) {
    this.lastVisit = this.createdAt;
  }
  next();
});

export const Patient = mongoose.model("Patient", patientSchema);
