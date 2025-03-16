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

const app = express();

app.post("/api/v1/dashboard/disease/new", createDisease);
app.post("/api/v1/dashboard/disease/filter", findFilterDiseases);
app.get("/api/v1/dashboard/disease/all", findAllDiseases);
app.get("/api/v1/dashboard/disease/:id", findSingleDisease);
app.delete("/api/v1/dashboard/disease/:id", deleteDisease);
app.post("/api/v1/dashboard/disease/export", exportDisease);
app.put("/api/v1/dashboard/disease/:id", updateDisease);

export const diseaseRoutes = app;
