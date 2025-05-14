import { Patient } from "../../models/dashboard/patient.js";
import { User } from "../../models/user.js";

export const chartData = async (req, res) => {
  try {
    const range = req.params.range;
    const now = new Date();

    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const sixMonthsAgo = new Date(currentMonth);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const twelveMonthsAgo = new Date(currentMonth);
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    let startDate, endDate;
    if (range == "recent") {
      startDate = new Date(sixMonthsAgo);
    } else if (range == "previous") {
      startDate = new Date(twelveMonthsAgo);
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Please give valid range" });
    }
    endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    let sixMonths = [];

    for (let i = 0; i < 6; i++) {
      startDate.setMonth(startDate.getMonth() + 1);
      endDate.setMonth(endDate.getMonth() + 1);
      const monthName = startDate.toLocaleString("default", { month: "long" });
      const user = await User.findById(req.user.id).populate("patients");
      const patients = user.patients.filter(
        (patient) =>
          patient.createdAt > startDate && patient.createdAt <= endDate
      );
      //   1. Fetch all the disease with their counts
      const diseaseObj = {};
      patients.forEach((patient) => {
        if (Object.keys(diseaseObj).includes(patient.disease)) {
          diseaseObj[patient.disease] += 1;
        } else {
          diseaseObj[patient.disease] = 1;
        }
      });
      const finalObj = {
        diseaseCount: patients.length,
        month: monthName,
      };
      //   2. Find top 3 diseases and mark all others in 'Other' category.
      const sortedKeys = Object.keys(diseaseObj).sort(
        (a, b) => diseaseObj[a] > diseaseObj[b]
      );
      for (let i = 0; i < sortedKeys.length; i++) {
        const key = sortedKeys[i];
        if (i < 3) {
          finalObj[key] = diseaseObj[key];
        } else {
          if (Object.keys(finalObj).includes("others")) {
            finalObj["others"] += diseaseObj[key];
          } else {
            finalObj["others"] = diseaseObj[key];
          }
        }
      }
      sixMonths.push(finalObj);
    }
    //   3. Return this updated data
    return res.status(200).json({ success: true, data: sixMonths.reverse() });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const tableData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("patients")
      .sort({ createdAt: -1 })
      .limit(8);
    const patients = user.patients;
    if (!patients) {
      return res
        .status(404)
        .json({ success: false, message: "No patient found." });
    }
    const updatedPatients = patients.map((ins) => {
      const result = {
        id: ins.ayushmanId,
        name: ins.name,
        disease: ins.disease,
        status: "normal",
      };
      let status = "";
      if (
        ins.disease == "Tuberclosis" ||
        ins.disease == "Hypertension" ||
        ins.disease == "Flu"
      ) {
        status = "hyper";
      } else if (
        ins.disease == "Cardiovascular Disease" ||
        ins.disease == "Arthritis" ||
        ins.disease == "Asthama"
      ) {
        status = "moderate";
      } else {
        status = "normal";
      }
      result["status"] = status;

      return result;
    });
    return res.status(200).json({ success: true, data: updatedPatients });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
