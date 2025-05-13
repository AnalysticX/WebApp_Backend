import { isValidObjectId } from "mongoose";
import { Patient } from "../../models/dashboard/patient.js";
import { patientPdfGenerator } from "../../utils/patientPdfGenerator.js";
import fs from "fs";
import { User } from "../../models/user.js";

//Get controllers
export const findAllPatients = async function (req, res) {
  try {
    const patients = await User.findById(req.user.id).populate("patients");
    return res.status(200).json({
      success: true,
      message: "Got the patients.",
      data: patients,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: [] });
  }
};

export const exportPatients = async (req, res) => {
  const { ids } = req.body; // Expecting an array of report IDs
  try {
    const patients = await Patient.find({ _id: { $in: ids } });
    const pdfStream = patientPdfGenerator(patients); // Generate PDF from patients
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="patients.pdf"',
    });
    pdfStream.pipe(res); // Pipe the PDF stream to the response
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const findSinglePatient = async function (req, res, next) {
  try {
    const patientId = req.params.id;

    //Check if patientId is in correct format or not
    if (!isValidObjectId(patientId)) {
      return res.status(404).json({
        success: false,
        message: "Patient Id does not follow the correct format.",
        data: {},
      });
    }

    const patient = await Patient.findById(patientId);
    //Check if there is a patient with this ID in our database or not
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "There is no patient with this ID",
        data: {},
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Got the patients.", data: patient });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: {} });
  }
};

export const patientStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const patients = await User.findById(req.user.id).populate("patients");
    console.log(patients);
    const [totalPatients, newThisWeek, active, inactive, male, female] = [
      patients.length,
      patients.filter((patient) => patient.createdAt >= startOfWeek),
      patients.filter((patient) => patient.active == true),
      patients.filter((patient) => patient.active == false),
      patients.filter((patient) => patient.gender == "Male"),
      patients.filter((patient) => patient.gender == "Female"),
    ];
    const stats = {
      totalPatients,
      newThisWeek,
      active,
      inactive,
      male,
      female,
    };
    return res.status(200).json({ success: false, data: stats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const diseaseList = async (req, res) => {
  try {
    const diseases = await User.findById(req.user.id)
      .populate("Patient")
      .distinct("disease");
    return res.status(200).json({ success: true, data: diseases });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createPatient = async function (req, res, next) {
  try {
    const {
      ayushmanId,
      name,
      age,
      gender,
      address,
      disease,
      contactNumber,
      email,
      bloodGroup,
    } = req.body;
    if (
      !ayushmanId ||
      !name ||
      !age ||
      !gender ||
      !address ||
      !disease ||
      !contactNumber ||
      !email ||
      !bloodGroup ||
      !req.file.filename
    ) {
      return res.status(400).json({
        success: false,
        message: "All details are not provided.",
        file: req.file,
      });
    }
    const patient = await Patient.create({
      ayushmanId,
      user: req.user.id,
      name,
      age,
      gender,
      address,
      disease,
      contactNumber,
      email,
      bloodGroup,
      photo: {
        data: req.file.filename,
        contentType: req.file.mimetype,
        path: req.file.path,
      },
    });
    await User.findByIdAndUpdate(req.user.id, {
      $push: { patients: patient._id },
    });
    return res
      .status(201)
      .json({ success: true, message: "Patient created successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePatient = async (req, res, next) => {
  const patientId = req.params.id;
  try {
    if (!isValidObjectId) {
      return res.status(404).json({
        success: false,
        message: "Patient Id does not follow the correct format.",
        data: {},
      });
    }
    //Find patient by patient id
    const patient = await Patient.findById(patientId);

    //Delete Photo of Image from Multer Storage
    fs.unlink(patient.photo.path, (err) => {
      if (err) throw err;
    });

    //Delete the patient from the database
    await patient.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Patient Removed Successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: {},
    });
  }
};

export const updatePatient = async (req, res, next) => {
  try {
    const patientId = req.params.id;
    if (!isValidObjectId) {
      return res.status(404).json({
        success: false,
        message: "Patient Id does not follow the correct format.",
      });
    }
    const patient = await Patient.findById(patientId);
    let updatedPatient = req.body;
    if (req.file) {
      fs.unlink(patient.photo.path, (err) => {
        if (err) throw err;
      });
      updatedPatient.photo = {
        data: req.file.filename,
        contentType: req.file.mimetype,
        path: req.file.path,
      };
    }
    await patient.updateOne(updatedPatient);
    return res.status(200).json({
      success: true,
      message: "Patient Updated Successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
