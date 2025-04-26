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

const router = express();

//Route to create a new disease
router.post("/disease/new", createDisease);
//Route to put filters on disease
router.post("/disease/filter", findFilterDiseases);
//Route to get all patients
router.get("/disease/all", findAllDiseases);
//Route to get single disease
router.get("/disease/:id", findSingleDisease);
//Route to delete single disease
router.delete("/disease/:id", deleteDisease);
//Route to update single disease
router.put("/disease/:id", updateDisease);
//Route to export disease
router.post("/disease/export", exportDisease);


export default router;
