
// import Document from '../models/Document.js';
// import Request from "../models/Request.js";
// export const saveAnalyzedDocumentsToDB = (reqId, analyzedDocs) => {
//     console.log("analyzed docs : ", analyzedDocs);
  
// }

import Document from '../models/Document.js';
import Request from "../models/Request.js";

export const saveAnalyzedDocumentsToDB = async (reqId, analyzedDocs) => {
  try {
    if (!analyzedDocs || !Array.isArray(analyzedDocs) || analyzedDocs.length === 0) {
      console.log("No documents to save.");
      return;
    }

    const savedDocuments = [];

    for (const doc of analyzedDocs) {
      const newDoc = new Document({
        name: doc.name,
        wardNumber: doc.wardNumber,
        phoneNumber: doc.phoneNumber || '',
        countryCode: doc.countryCode || '+91',
        issues: doc.issues || [],
        problems: doc.problems || [],
        docUrl: doc.docUrl || '', // Make sure this is available in `doc`
      });

      const savedDoc = await newDoc.save();
      savedDocuments.push(savedDoc);
    }

    // Optionally, update the Request with associated document references (if desired)
    // await Request.findByIdAndUpdate(reqId, {
    //   $push: { documents: { $each: savedDocuments.map(d => d._id) } } // If you have a 'documents' field
    // });

    console.log("Documents saved successfully.");
  } catch (err) {
    console.error("Error saving analyzed documents:", err);
  }
};
