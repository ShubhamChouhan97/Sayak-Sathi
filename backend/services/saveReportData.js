import Report from "../models/Report.js";
import mongoose from "mongoose";
import Request from "../models/Request.js";
export const saveReportToDB = async (requestId, aiReport) => {
  try {
    // 1. Initial check for overall AI Report data
    if (!aiReport || Object.keys(aiReport).length === 0) {
      console.warn(" AI Report data is empty or missing. Not saving to DB.");
      return; // Exit the function if there's no data
    }

    // Map commonProblems - now also checking if the source array is meaningfully populated
    const commonProblems = (aiReport.commonProblems || []).map(cp => {
      // Ensure required fields exist
      if (!cp.problem || !cp.category || cp.count === undefined) {
        console.warn("Skipping common problem due to missing required fields:", cp);
        return null;
      }
      return {
        problem: cp.problem,
        category: cp.category,
        count: cp.count,
        reporters: (cp.reporters || []).map(rep => {
          if (!rep.docname || (!rep._id && !rep.id)) {
            console.warn("Skipping reporter in common problem due to missing docname or ID:", rep);
            return null;
          }
          return {
            docname: rep.docname,
            wardNumber: rep.wardNumber,
            id: new mongoose.Types.ObjectId(rep._id || rep.id),
          };
        }).filter(Boolean)
      };
    }).filter(Boolean);

    // Map wardWiseProblems
    const wardWiseProblems = (aiReport.wardWiseProblems || []).map(wardItem => {
      if (!wardItem.ward) {
        console.warn("Skipping ward-wise problem due to missing ward number:", wardItem);
        return null;
      }
      return {
        ward: wardItem.ward,
        problems: (wardItem.problems || []).map(problem => {
          if (!problem.problem || !problem.category || problem.count === undefined) {
            console.warn("Skipping problem in ward-wise data due to missing required fields:", problem);
            return null;
          }
          return {
            problem: problem.problem,
            category: problem.category,
            count: problem.count,
            reporters: (problem.reporters || []).map(rep => {
              if (!rep.docname || (!rep._id && !rep.id)) {
                console.warn("Skipping reporter in ward-wise problem due to missing docname or ID:", rep);
                return null;
              }
              return {
                docname: rep.docname,
                id: new mongoose.Types.ObjectId(rep._id || rep.id),
              };
            }).filter(Boolean)
          };
        }).filter(Boolean)
      };
    }).filter(Boolean);

    // Map analytics
    const analytics = (aiReport.analytics || []).map(a => {
      if (!a.ward || a.totalProblems === undefined) {
        console.warn("Skipping analytics entry due to missing ward or totalProblems:", a);
        return null;
      }
      return {
        ward: a.ward,
        totalProblems: a.totalProblems
      };
    }).filter(Boolean);

    // 2. Check if the mapped data for essential sections is empty
    if (commonProblems.length === 0 && wardWiseProblems.length === 0 && analytics.length === 0) {
      console.warn(" All main sections of the report (commonProblems, wardWiseProblems, analytics) are empty after mapping. Not saving to DB.");
      return; // Exit if all key sections are empty
    }

    const newReport = new Report({
      requestId: requestId,
      commonProblems,
      wardWiseProblems,
      analytics
    });

    await newReport.save();
    //save this report id to requests collection
    const request = await Request.findByIdAndUpdate(requestId, { $set: { reportId: newReport.id } });
    console.log("Report successfully saved to MongoDB");
  } catch (error) {
    console.error(" Failed to save report:", error.message);
    console.error(error.stack);
    throw error;
  }
};