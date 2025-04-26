import express from "express";
import {
  getAllReports,
  exportReports,
  deleteReport,
  createReport,
  findSingleReport,
} from "../../controllers/dashboard/report.js";

const router = express.Router();

// Route to get all reports
router.get("/report/all", getAllReports);
//Route to get a single report
router.get("/report/:id",findSingleReport)
// Route to export reports by IDs
router.post("/report/export", exportReports);
//Route to generate a new report
router.post("/report/new",createReport)
//Route to delete single report
router.delete("/report/:id",deleteReport)

export default router
