import mongoose from "mongoose";

const transcriptSchema = new mongoose.Schema(
  {
    ayushmanId:{
        type:String,
        required:true
    },
    s3Bucket:{
        type:String,
        required:true
    },
    s3Key:{
        type:String,
        required:true
    },
    uploadedBy:{
        // type:mongoose.Types.ObjectId,
        type:String,
        required:true,
        // ref:'User'
    }
  },
  { timestamps: true }
);

export const Transcript = mongoose.model("Transcript", transcriptSchema);
