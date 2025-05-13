import express from "express";
import {
  createPatient,
  deletePatient,
  diseaseList,
  exportPatients,
  findAllPatients,
  findSinglePatient,
  patientStats,
  updatePatient,
} from "../../controllers/dashboard/patient.js";
import { upload } from "../../middlewares/multer.js";
import verifyUser from "../../middlewares/verifyUser.js";

const router = express();

//Route to create a single patient
router.post("/patient/new", verifyUser, upload.single("photo"), createPatient);

//Route to get all patients
router.get("/patient/all", verifyUser, findAllPatients);
//Route to get quick statistics
router.get("/patient/quick", verifyUser, patientStats);
//Route to get unique disease list
router.get("/patient/disease-list", verifyUser, diseaseList);
//Route to get single patient
router.get("/patient/:id", verifyUser, findSinglePatient);
//Route to delete single patient
router.delete("/patient/:id", verifyUser, deletePatient);
//Route to update single patient
router.put("/patient/:id", verifyUser, upload.single("photo"), updatePatient);
//Route to export patient report
router.post("/patient/export", verifyUser, exportPatients);

export default router;
