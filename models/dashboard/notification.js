import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
   type:{type:String,required:true,enum:['Disease','Patient']},
   patientId:{type:mongoose.Types.ObjectId, ref:'Patient'},
   diseaseId:{type:mongoose.Types.ObjectId, ref:'Disease'},
   message:{type:String,required:true},
   isRead:{type:Boolean,default:false}
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);