import express from "express";
import {
  createDisease,
  deleteDisease,
  exportDisease,
  findAllDiseases,
  findFilterDiseases,
  findSingleDisease,
  updateDisease,
} from "../../controllers/dashboard/disease.js";
import verifyUser from "../../middlewares/verifyUser.js";

const router = express();

//Route to create a new disease
router.post("/disease/new", verifyUser, createDisease);
//Route to put filters on disease
router.post("/disease/filter", verifyUser, findFilterDiseases);
//Route to get all patients
router.get("/disease/all", verifyUser, findAllDiseases);
//Route to get single disease
router.get("/disease/:id", verifyUser, findSingleDisease);
//Route to delete single disease
router.delete("/disease/:id", verifyUser, deleteDisease);
//Route to update single disease
router.put("/disease/:id", verifyUser, updateDisease);
//Route to export disease
router.post("/disease/export", verifyUser, exportDisease);

export default router;
