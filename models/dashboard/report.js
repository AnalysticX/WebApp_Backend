import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportName: {
      type: String,
      required: [true, "Please enter the report name"],
    },
    generatedBy: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please provide the user ID"],
    },
    timeFrameStart: {
      type: Date,
      required: [true, "Please provide the start date of the time frame"],
    },
    timeFrameEnd: {
      type: Date,
      required: [true, "Please provide the end date of the time frame"],
    },
    filePath:String,
  },
  { timestamps: true }
);

export const Report = mongoose.model("Report", reportSchema);
