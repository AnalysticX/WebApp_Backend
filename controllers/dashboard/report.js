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
