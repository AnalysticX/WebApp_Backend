import express from "express";
import {
  getAllReports,
  exportReports,
} from "../../controllers/dashboard/report.js";

const router = express.Router();

// Route to get all reports
router.get("/api/v1/dashboard/report/all", getAllReports);

// Route to export reports by IDs
router.post("/api/v1/dashboard/report/export", exportReports);

export const reportRoutes = router;
