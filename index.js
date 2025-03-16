// Packages
import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./utils/database.js";
import { patientRoutes } from "./routes/dashboard/patient.js";
import { diseaseRoutes } from "./routes/dashboard/disease.js";
import { reportRoutes } from "./routes/dashboard/report.js";
import bodyParser from "body-parser";
export const app = express();

//Configurations
dotenv.config({
  path: ".env",
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Middlewares
app.use(patientRoutes);
app.use(diseaseRoutes);
app.use(reportRoutes);

connectDb();
const PORT = process.env.PORT || 3002;

app.listen(PORT, () =>
  console.log("Server is connected to http://localhost:" + PORT)
);
