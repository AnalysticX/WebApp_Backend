//Get requests
import { isValidObjectId } from "mongoose";
import { Disease } from "../../models/dashboard/disease.js";
import { diseasePdfGenerator } from "../../utils/diseasePdfGenerator.js";
import cleanAndCapitalize from "../../utils/cleanAndCapitalize.js";
import { Patient } from "../../models/dashboard/patient.js";

export const findAllDiseases = async function (req, res, next) {
  try {
    let diseases = await Disease.find({});
    return res
      .status(200)
      .json({ success: true, message: "Got the diseases.", data: diseases });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: [] });
  }
};

export const findSingleDisease = async function (req, res, next) {
  try {
    const diseaseId = req.params.id;
    //Check for valid diseaseId
    if (!isValidObjectId(diseaseId)) {
      return res.status(404).json({
        success: false,
        message: "Disease Id does not follow the correct format.",
        data: {},
      });
    }
    const disease = await Disease.findById(diseaseId);
    //Check if this disease exists in database
    if (!disease) {
      return res.status(500).json({
        success: false,
        message: "There is no disease with this ID.",
        data: {},
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Got the disease.", data: disease });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: {} });
  }
};

export const exportDisease = async function (req, res, next) {
  const { ids } = req.body; // Expecting an array of report IDs
  try {
    const diseases = await Disease.find({ _id: { $in: ids } });
    const pdfStream = diseasePdfGenerator(diseases); // Generate PDF from diseases
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="diseases.pdf"',
    });
    pdfStream.pipe(res); // Pipe the PDF stream to the response
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const commonDiseaseStats = async (req, res) => {
  try {
    const total = await Disease.countDocuments({});
    const chronic = await Disease.countDocuments({
      isChronic: true,
    });
    const diseases = await Disease.find({}).sort({ totalCases: -1 });
    const active = diseases.reduce(
      (accumulator, currentValue) => accumulator + currentValue.activeCases,
      0
    );

    const mostCommon = diseases[0] ? diseases[0].diseaseName : "..........";

    return res.status(200).json({
      success: true,
      data: {
        total,
        active,
        chronic,
        increasing: Math.floor(total / 2),
        decreasing: Math.floor(total / 2),
        mostCommon,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const singleDiseaseStats = async (req, res) => {
  try {
    const id = req.params.id;
    const { diseaseName, totalCases, activeCases, isChronic } =
      await Disease.findById(id);
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const newCases = await Patient.countDocuments({
      createdAt: { $gte: sevenDaysAgo, $lte: today },
      disease: diseaseName,
    });
    const stats = {
      totalCases,
      activeCases,
      isChronic,
      newCases,
      decreasing: Math.floor(totalCases / 2),
    };
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const diseasesPatients = async (req, res) => {
  try {
    const diseaseName = req.params.diseaseName;
    const patients = await Patient.find({ disease: diseaseName });
    return res.status(200).json({ success: true, data: patients });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//Put requests
export const findFilterDiseases = async function (req, res, next) {
  try {
    const { id, diseaseName, trend, isChronic } = req.body;
    let filterObject = {
      isChronic: { $lte: isChronic || 1000000 },
    };
    if (id) {
      filterObject["_id"] = id;
    }
    if (diseaseName) {
      filterObject["diseaseName"] = diseaseName;
    }
    if (trend) {
      filterObject["trend"] = trend;
    }
    const diseases = await Disease.find(filterObject);
    return res
      .status(200)
      .json({ success: true, message: "Got the diseases.", data: diseases });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: [] });
  }
};

export const createDisease = async function (req, res, next) {
  try {
    const { diseaseName, totalCases, activeCases, isChronic, trend } = req.body;
    await Disease.create({
      diseaseName: cleanAndCapitalize(diseaseName),
      totalCases,
      activeCases,
      isChronic,
      trend,
    });
    return res
      .status(200)
      .json({ success: true, message: "Disease created successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDisease = async (req, res, next) => {
  const diseaseId = req.params.id;
  try {
    if (!isValidObjectId) {
      return res.status(500).json({
        success: false,
        message: "Disease Id does not follow the correct format.",
        data: {},
      });
    }
    await Disease.findByIdAndDelete(diseaseId);
    return res.status(200).json({
      success: true,
      message: "Disease Removed Successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: {},
    });
  }
};

export const updateDisease = async (req, res, next) => {
  const diseaseId = req.params.id;
  const { diseaseName, totalCases, activeCases, isChronic, trend } = req.body;
  try {
    if (!isValidObjectId) {
      return res.status(500).json({
        success: false,
        message: "Disease Id does not follow the correct format.",
        data: {},
      });
    }
    await Disease.findByIdAndUpdate(diseaseId, {
      diseaseName,
      totalCases,
      activeCases,
      isChronic,
      trend,
    });
    return res.status(200).json({
      success: true,
      message: "Disease Updated Successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: {},
    });
  }
};
