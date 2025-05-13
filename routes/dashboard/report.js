import express from "express";
import {
  getAllReports,
  exportReports,
  deleteReport,
  createReport,
  findSingleReport,
} from "../../controllers/dashboard/report.js";
import verifyUser from "../../middlewares/verifyUser.js";

const router = express.Router();

// Route to get all reports
router.get("/report/all", verifyUser, getAllReports);
//Route to get a single report
router.get("/report/:id", verifyUser, findSingleReport);
// Route to export reports by IDs
router.post("/report/export", verifyUser, exportReports);
//Route to generate a new report
router.post("/report/new", verifyUser, createReport);
//Route to delete single report
router.delete("/report/:id", verifyUser, deleteReport);

export default router;
