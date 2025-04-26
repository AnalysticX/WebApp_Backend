import express from "express";
import {
  createPatient,
  deletePatient,
  diseaseList,
  exportPatients,
  findAllPatients,
  findFilterPatients,
  findSinglePatient,
  patientStats,
  updatePatient,
} from "../../controllers/dashboard/patient.js";

const router = express();

//Route to create a single patient
router.post("/patient/new", createPatient);
//Route to put filters on patients
router.get("/patient/filter", findFilterPatients);
//Route to get all patients
router.get("/patient/all", findAllPatients);
//Route to get quick statistics
router.get("/patient/quick", patientStats);
//Route to get unique disease list
router.get("/patient/disease-list", diseaseList);
//Route to get single patient
router.get("/patient/:id", findSinglePatient);
//Route to delete single patient
router.delete("/patient/:id", deletePatient);
//Route to update single patient
router.put("/patient/:id", updatePatient);
//Route to export patient report
router.post("/patient/export", exportPatients);

export default router;
