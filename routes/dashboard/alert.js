import express from "express";
import {
  createAlert,
  deleteAlert,
  findFilteredAlerts,
  findSingleAlert,
  getAllAlerts,
  toggleAlert,
} from "../../controllers/dashboard/alert.js";
import verifyUser from "../../middlewares/verifyUser.js";
const router = express();

//Route to get all alerts
router.get("/alert/all", verifyUser, getAllAlerts);
//Route to get fileterd alerts(by type or user id or (user id + patient,disease id))
router.get("/alert/filter", verifyUser, findFilteredAlerts);
//Route to get single alert by id
router.get("/alert/:id", verifyUser, findSingleAlert);
//Route to create new alert
router.post("/alert/new/:type/:id", verifyUser, createAlert);
//Route to delete an alert
router.delete("/alert/:id", verifyUser, deleteAlert);
//Route to toggle alert active status
router.put("/alert/:id", verifyUser, toggleAlert);

export default router;

//Target for 19 march is to complete the basic api and understand the flow of it.
