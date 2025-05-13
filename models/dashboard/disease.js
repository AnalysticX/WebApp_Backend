import mongoose from "mongoose";

const diseaseSchema = new mongoose.Schema(
  {
    diseaseName: {
      type: String,
      required: [true, "Please enter Disease Name"],
      unique: [true, "Disease with this name already exists."],
    },
    totalCases: { type: Number, required: true },
    activeCases: { type: Number, required: true },
    chronicCases: { type: Number, required: true },
    trend: {
      type: String,
      enum: ["Rising", "Stable", "Decreasing"],
      default: "Stable",
    },
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Disease = mongoose.model("Disease", diseaseSchema);
