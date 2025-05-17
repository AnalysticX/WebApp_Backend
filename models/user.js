import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: Number,
  specialty: String,
  department: String,
  gender: { type: String, enum: ["Male", "Female", "Others"] },
  hospitalName: String,
  hospitalAddress: String,
  backgroundImage: String,
  profileImage: String,
  patients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
  ],
  diseases: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Disease",
    },
  ],
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
  alerts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alert",
    },
  ],
  transcripts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transcript",
    },
  ],
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
  ],
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

export const User = mongoose.model("User", userSchema);
