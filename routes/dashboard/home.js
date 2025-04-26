import { Router } from "express";
import { chartData, tableData } from "../../controllers/dashboard/home.js";

const router = Router();

router.get("/home/chart/:range", chartData);

router.get("/home/table", tableData);

export default router;
