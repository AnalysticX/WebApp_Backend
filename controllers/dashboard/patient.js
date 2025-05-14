import { isValidObjectId } from "mongoose";
import { Patient } from "../../models/dashboard/patient.js";
import { Disease } from "../../models/dashboard/disease.js";
import { patientPdfGenerator } from "../../utils/patientPdfGenerator.js";
import fs from "fs";
import cleanAndCapitalize from "../../utils/cleanAndCapitalize.js";
import { User } from "../../models/user.js";

//Get controllers
export const findAllPatients = async function (req, res) {
  try {
    const user = await User.findById(req.user.id).populate("patients");
    const patients = user.patients;
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
    const user = await User.findById(req.user.id).populate("patients");
    const patients = user.patients;
    const stats = {
      totalPatients: patients.length,
      newThisWeek: patients.filter(
        (patient) => patient.createdAt >= startOfWeek
      ).length,
      active: patients.filter((patient) => patient.active == true).length,
      inactive: patients.filter((patient) => patient.active == false).length,
      male: patients.filter((patient) => patient.gender == "Male").length,
      female: patients.filter((patient) => patient.gender == "Female").length,
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
      disease: cleanAndCapitalize(disease),
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
    const currentDisease = await Disease.findOne({
      diseaseName: patient.disease,
    });
    if (currentDisease) {
      currentDisease.totalCases += 1;
      currentDisease.activeCases += 1;
      currentDisease.save();
    } else {
      await Disease.create({
        diseaseName: patient.disease,
        totalCases: 1,
        chronicCases: 0,
        activeCases: 1,
      });
    }
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

    //Disease status update
    const currentDisease = await Disease.findOne({
      diseaseName: patient.disease,
    });
    currentDisease.totalCases -= 1;
    if (patient.active) currentDisease.activeCases -= 1;
    console.log(currentDisease);
    if (currentDisease.totalCases == 0) await currentDisease.deleteOne();
    else currentDisease.save();

    //Delete the patient from the database
    await patient.deleteOne();
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { patients: patient._id },
    });
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
    //Update Disease Status
    let updatedDisease;
    //Find old disease of patient
    const currentDisease = await Disease.findOne({
      diseaseName: patient.disease,
    });
    if (updatedPatient.disease) {
      updatedPatient.disease = cleanAndCapitalize(updatedPatient.disease);
      updatedDisease = await Disease.findOne({
        diseaseName: updatedPatient.disease,
      });

      //Check if disease exists in database, if not, create it.
      if (!updatedDisease) {
        updatedDisease = await Disease.create({
          diseaseName: updatedPatient.disease,
          totalCases: 0,
          activeCases: 0,
          isChronic: false,
        });
      }

      if (currentDisease.diseaseName !== updatedDisease.diseaseName) {
        //Cases Count Update
        currentDisease.totalCases -= 1;
        currentDisease.activeCases -= 1;
        updatedDisease.totalCases += 1;
        updatedDisease.activeCases += 1;
        currentDisease.save();
        updatedDisease.save();
        if (currentDisease.totalCases === 0) await currentDisease.deleteOne();
      }
    } else {
      //Active Cases Update
      if (updatedPatient.active == true && patient.active == false) {
        currentDisease.activeCases += 1;
      } else if (updatedPatient.active == false && patient.active == true) {
        currentDisease.activeCases -= 1;
      }
      currentDisease.save();
    }

    //Update photo details
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
