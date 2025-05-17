import { Router } from "express";
import {
  chartData,
  patientCountStats,
  tableData,
} from "../../controllers/dashboard/home.js";
import verifyUser from "../../middlewares/verifyUser.js";

const router = Router();

router.get("/home/chart/:range", verifyUser, chartData);

router.get("/home/table", verifyUser, tableData);
router.get("/home/count", verifyUser, patientCountStats);

export default router;
