import express from "express";
import {
  createPatient,
  deletePatient,
  exportPatients,
  findAllPatients,
  findFilterPatients,
  findSinglePatient,
  updatePatient,
} from "../../controllers/dashboard/patient.js";

const app = express();

app.post("/api/v1/dashboard/patient/new", createPatient);
app.post("/api/v1/dashboard/patient/filter", findFilterPatients);
app.get("/api/v1/dashboard/patient/all", findAllPatients);
app.get("/api/v1/dashboard/patient/:id", findSinglePatient);
app.delete("/api/v1/dashboard/patient/:id", deletePatient);
app.post("/api/v1/dashboard/patient/export", exportPatients);
app.put("/api/v1/dashboard/patient/:id", updatePatient);

export const patientRoutes = app;
