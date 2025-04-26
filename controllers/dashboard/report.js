import { isValidObjectId } from "mongoose";
import { Report } from "../../models/dashboard/report.js";
import { reportPdfGenerator } from "../../utils/reportPdfGenerator.js"; // Assuming a utility function for PDF generation

// Get all reports
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({});
    return res.status(200).json({ success: true, data: reports });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//Find single report
export const findSingleReport = async(req,res)=>{
  try {
    const id = req.params.id
    if(!id){
      return res.status(404).json({success:false,message:'Provide report id to search for.'})
    }
    if(!isValidObjectId(id)){
      return res.status(422).json({success:false,message:'Invalid type of report id'})
    }
    const report = await Report.findById(id)
    if(!report){
      return res.status(404).json({success:false,message:'No report with this id found.'})
    }
    return res.status(200).json({success:true,data:report})
  } catch (error) {
    return res.status(500).json({success:false,message:error.message})
  }
}

//Create new report
export const createReport = async(req,res)=>{
  try {
    const {reportName,generatedBy,timeFrameStart,timeFrameEnd,filePath} = req.body;
    if(!reportName || !generatedBy ||timeFrameStart ||!timeFrameEnd){
      return res.status(422).json({success:false,message:"Please provide all required entries."})
    }
    await Report.create({reportName,generatedBy,timeFrameEnd,timeFrameStart,filePath})
    return res.status(200).json({success:true,message:"Report created successfully."})
  } catch (error) {
    return res.status(500).json({success:false,message:error.message})
  }
}

//Delete single report
export const deleteReport = async(req,res)=>{
  try {
    const id = req.params.id
    if(!id){
      return res.status(404).json({success:false,message:'Provide report id to delete it.'})
    }
    if(!isValidObjectId(id)){
      return res.status(422).json({success:false,message:'Invalid type of report id'})
    }
    await Report.findByIdAndDelete(id)
    return res.status(200).json({success:true,message:`Report deleted successfully.`})
  } catch (error) {
    return res.status(500).json({success:false,message:error.message})
  }
}


// Export multiple reports by IDs
export const exportReports = async (req, res) => {
  const { ids } = req.body; // Expecting an array of report IDs
  try {
    const reports = await Report.find({ _id: { $in: ids } });
    const pdfStream = reportPdfGenerator(reports); // Generate PDF from reports
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="reports.pdf"',
    });
    pdfStream.pipe(res); // Pipe the PDF stream to the response
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};