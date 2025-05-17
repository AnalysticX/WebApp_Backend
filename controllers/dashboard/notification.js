import { Notification } from "../../models/dashboard/notification.js";
import { User } from "../../models/user.js";

export const getAllNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("notifications");
    let notifications = user.notifications;
    if (String(req.params.unread) == "true") {
      notifications = notifications.filter(
        (notification) =>
          String(notification.isRead) != String(req.params.unread)
      );
    }
    if (!notifications) {
      return res
        .status(404)
        .json({ success: false, message: "No notification found." });
    }
    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: [] });
  }
};

export const findSingleNotification = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(404)
        .json({ success: false, message: "Please provide notification id" });
    }
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "No notification with this ID found.",
      });
    }
    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const findFilteredNotifications = async (req, res) => {
  try {
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
    const notifications = await Notification.find(filterObject);
    if (!notifications) {
      return res
        .status(404)
        .json({ success: false, message: "No notification found." });
    }
    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: [] });
  }
};

export const createNotification = async (req, res) => {
  try {
    const type = req.params.type;
    let patientId = null,
      diseaseId = null;
    if (type === "Patient") {
      patientId = req.params.id;
    } else {
      diseaseId = req.params.id;
    }
    const { message, isRead } = req.body;
    if (!type || !message) {
      return res.status(400).json({
        success: false,
        message: "Provide all required entries to create an notification.",
      });
    }
    const notification = await Notification.create({
      type,
      patientId,
      diseaseId,
      message,
      isRead,
    });
    await User.findByIdAndUpdate(req.user.id, {
      $push: { notifications: notification._id },
    });
    return res
      .status(201)
      .json({ success: true, message: "Notification created successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Please provide notification id to delete",
      });
    }
    const notification = await Notification.findByIdAndDelete(id);
    console.log(notification);
    console.log(req.user.id);
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { notifications: notification._id },
    });
    return res
      .status(200)
      .json({ success: true, message: "Notification deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleNotification = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Please provide notification id to toggle",
      });
    }
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "No notification with this id found.",
      });
    }
    notification.isRead = !notification.isRead;
    notification.save();
    return res.status(200).json({
      success: true,
      message: `${
        notification.isRead
          ? "Notification is read."
          : "Notication is not read yet."
      }`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
