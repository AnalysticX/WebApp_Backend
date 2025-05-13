import mongoose from "mongoose";
import validator from "validator";

const patientSchema = new mongoose.Schema(
  {
    ayushmanId: {
      type: String,
      required: [true, "Please provide your AyushmanId"],
      unique: true,
    },
    name: { type: String, required: [true, "Please enter your Full Name"] },
    age: { type: Number, required: [true, "Please provide your age"] },
    gender: {
      type: String,
      required: [true, "Please provide your gender"],
      enum: ["Male", "Female", "Others"],
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
    address: { type: String, required: [true, "Please enter your address"] },
    bloodGroup: {
      type: String,
      required: [true, "Please enter your blood group"],
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    contactNumber: {
      type: String,
      validate: {
        validator: (value) => {
          // Indian phone number regex: 10 digits starting with 6-9
          return /^[6-9]\d{9}$/.test(value);
        },
        message: "Invalid Indian phone number",
      },
      required: [true, "Please enter your mobile number"],
    },
    email: {
      type: String,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Invalid email address",
      },
      required: [true, "Email is required"],
    },
    photo: {
      data: String, // binary data of the image
      contentType: String, // like 'image/jpeg' or 'image/png'
      path: String,
    },
    user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
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
