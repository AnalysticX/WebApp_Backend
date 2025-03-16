import { isObjectIdOrHexString, isValidObjectId } from "mongoose";
import { Patient } from "../../models/dashboard/patient.js";
import { patientPdfGenerator } from "../../utils/patientPdfGenerator.js";

//Get controllers
export const findAllPatients = async function (req, res, next) {
  try {
    const patients = await Patient.find({});
    return res
      .status(200)
      .json({ success: true, message: "Got the patients.", data: patients });
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
      return res.status(500).json({
        success: false,
        message: "Patient Id does not follow the correct format.",
        data: {},
      });
    }

    const patient = await Patient.findById(patientId);
    //Check if there is a patient with this ID in our database or not
    if (!patient) {
      return res.status(500).json({
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
//Put controllers

export const findFilterPatients = async function (req, res, next) {
  try {
    const { ayushmanId, fullName, minAge, maxAge, gender } = req.body;
    let filterObject = {
      age: { $gte: minAge || 0, $lte: maxAge || 200 },
    };
    if (ayushmanId) {
      filterObject["ayushmanId"] = ayushmanId;
    }
    if (fullName) {
      filterObject["fullName"] = fullName;
    }
    if (gender) {
      filterObject["gender"] = gender;
    }
    const patients = await Patient.find(filterObject);
    return res
      .status(200)
      .json({ success: true, message: "Got the patients.", data: patients });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: [] });
  }
};

export const createPatient = async function (req, res, next) {
  try {
    const { ayushmanId, fullName, age, gender, address } = req.body;
    await Patient.create({
      ayushmanId,
      fullName,
      age,
      gender,
      address,
    });
    return res
      .status(200)
      .json({ success: true, message: "Patient created successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePatient = async (req, res, next) => {
  const patientId = req.params.id;
  try {
    if (!isValidObjectId) {
      return res.status(500).json({
        success: false,
        message: "Patient Id does not follow the correct format.",
        data: {},
      });
    }
    await Patient.findByIdAndDelete(patientId);
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
  const patientId = req.params.id;
  const { fullName, age, gender, address, active, lastVisit } = req.body;
  try {
    if (!isValidObjectId) {
      return res.status(500).json({
        success: false,
        message: "Patient Id does not follow the correct format.",
        data: {},
      });
    }
    await Patient.findByIdAndUpdate(patientId, {
      fullName,
      age,
      gender,
      address,
      active,
      lastVisit,
    });
    return res.status(200).json({
      success: true,
      message: "Patient Updated Successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: {},
    });
  }
};
