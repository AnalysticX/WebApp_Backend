// Packages
import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./utils/database.js";
import bodyParser from "body-parser";
import cors from "cors";
export const app = express();
//Route Imports
import patientRoutes from "./routes/dashboard/patient.js";
import diseaseRoutes from "./routes/dashboard/disease.js";
import reportRoutes from "./routes/dashboard/report.js";
import alertRoutes from "./routes/dashboard/alert.js";
import notifcationRoutes from "./routes/dashboard/notification.js";
import transcriptRoutes from "./routes/dashboard/transcript.js";
import homeRoutes from "./routes/dashboard/home.js";
import userRoutes from "./routes/user.js";
import cookieParser from "cookie-parser";

//Cors configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//Configurations
dotenv.config({
  path: ".env",
});
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

//Middlewares
app.use("/api/v1", userRoutes);
app.use("/api/v1/dashboard", diseaseRoutes);
app.use("/api/v1/dashboard", patientRoutes);
app.use("/api/v1/dashboard", reportRoutes);
app.use("/api/v1/dashboard", alertRoutes);
app.use("/api/v1/dashboard", notifcationRoutes);
app.use("/api/v1/dashboard", transcriptRoutes);
app.use("/api/v1/dashboard", homeRoutes);

connectDb();
const PORT = process.env.PORT || 3002;

app.listen(PORT, () =>
  console.log("Server is connected to http://localhost:" + PORT)
);
