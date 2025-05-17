import { Alert } from "../../models/dashboard/alert.js";
import { User } from "../../models/user.js";

export const getAllAlerts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("alerts");
    console.log(user);
    const alerts = user.alerts;
    if (!alerts) {
      return res
        .status(404)
        .json({ success: false, message: "No alert found." });
    }
    return res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: [] });
  }
};

export const findSingleAlert = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(404)
        .json({ success: false, message: "Please provide alert id" });
    }
    const alert = await Alert.findById(id);
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "No alert with this ID found.",
      });
    }
    return res.status(200).json({ success: true, data: alert });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const findFilteredAlerts = async (req, res) => {
  try {
    console.log("Hello");
    const { type, patientId, diseaseId } = req.body;
    let filterObject = {};
    if (type) {
      filterObject["type"] = type;
    }
    if (patientId) {
      filterObject["patientId"] = patientId;
    }
    if (diseaseId) {
      filterObject["diseaseId"] = diseaseId;
    }
    const alerts = await Alert.find(filterObject);
    if (!alerts) {
      return res
        .status(404)
        .json({ success: false, message: "No alert found." });
    }
    return res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: [] });
  }
};

export const createAlert = async (req, res) => {
  try {
    const type = req.params.type;
    let patientId = null,
      diseaseId = null;
    if (type === "Patient") {
      patientId = req.params.id;
    } else {
      diseaseId = req.params.id;
    }
    const { message, isActive } = req.body;
    if (!type || !message) {
      return res.status(400).json({
        success: false,
        message: "Provide all required entries to create an alert.",
      });
    }
    const alert = await Alert.create({
      type,
      patientId,
      diseaseId,
      message,
      isActive,
    });
    await User.findByIdAndUpdate(req.user.id, {
      $push: { alerts: alert._id },
    });
    return res
      .status(201)
      .json({ success: true, message: "Alert created successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAlert = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Please provide alert id to delete",
      });
    }
    const alert = await Alert.findByIdAndDelete(id);
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { alerts: alert._id },
    });
    return res
      .status(200)
      .json({ success: true, message: "Alert deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleAlert = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Please provide alert id to toggle",
      });
    }
    const alert = await Alert.findById(id);
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "No alert with this id found.",
      });
    }
    alert.isActive = !alert.isActive;
    alert.save();
    return res.status(200).json({
      success: true,
      message: `${
        alert.isActive ? "Alert is active." : "Notication is not active yet."
      }`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
