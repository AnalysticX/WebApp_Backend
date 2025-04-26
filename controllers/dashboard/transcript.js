import { Transcript } from "../../models/dashboard/transcript.js"

export const getAllTranscripts = async(req,res)=>{
    try {
        const transcripts = await Transcript.find({})
        if(!transcripts){
            return res.status(404).json({success:false,message:'No transcript found.'})
        }
        return res.status(200).json({success:true,data:transcripts})    
    } catch (error) {
        return res
          .status(500)
          .json({ success: false, message: error.message, data: [] });
    }
    
}

export const findSingleTranscript = async(req,res)=>{
    try {
        const id = req.params.id;
        if(!id){
            return res.status(404).json({success:false,message:"Please provide transcript id"})
        }
        const transcript = await Transcript.findById(id);
        return res.status(200).json({success:true,data:transcript});
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}

export const findFilteredTranscript = async(req,res)=>{
    try {
        const { uploadedBy} = req.body;
        let filterObject = {};
        if (uploadedBy) {
          filterObject["uploadedBy"] = uploadedBy;
        }
        const transcripts = await Transcript.find(filterObject);
        if(!transcripts){
            return res.status(404).json({success:false,message:"No transcript found."})
        }
        return res
          .status(200)
          .json({ success: true, data: transcripts });
      } catch (error) {
        return res
          .status(500)
          .json({ success: false, message: error.message, data: [] });
      }
}

export const createTranscript = async(req,res)=>{
    try {
        const {uploadedBy,s3Bucket,s3Key,ayushmanId} = req.body;
        if(!uploadedBy || !s3Bucket || !s3Key || !ayushmanId){
            return res.status(400).json({success:false,message:"Provide all required entries to create an transcript."})
        }
        await Transcript.create({
            uploadedBy,s3Bucket,s3Key,ayushmanId
        })
        return res.status(201).json({success:true,message:"Transcript created successfully."})    
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
    
}


export const deleteTranscript = async(req,res)=>{
    try {
        const id = req.params.id;
        if(!id){
            return res.status(404).json({success:false,message:"Please provide transcript id to delete"})
        }
        await Transcript.findByIdAndDelete(id)
        return res.status(200).json({success:true,message:"Transcript deleted successfully."})
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}