
// import Document from '../models/Document.js';
// import Request from "../models/Request.js";
// export const saveAnalyzedDocumentsToDB = (reqId, analyzedDocs) => {
//     console.log("analyzed docs : ", analyzedDocs);
  
// }

import Document from '../models/Document.js';
import Request from "../models/Request.js";

export const saveAnalyzedDocumentsToDB = async (reqId, analyzedDocs) => {
  try {
      console.log("ama",analyzedDocs)
    const request = await Request.findById(reqId);

    if (!analyzedDocs || !Array.isArray(analyzedDocs) || analyzedDocs.length === 0) {
      console.log("No documents to save.");
      return;
    }

    const savedDocuments = [];

    for (const doc of analyzedDocs) {
      const newDoc = new Document({
        requestId:reqId,
        requsetName: request.name,
        docname: doc.name,
        nameInHindi: doc.nameInHindi,
        wardNumber: doc.wardNumber,
        phoneNumber: doc.phoneNumber || '',
        countryCode: doc.countryCode || '+91',
        issues: doc.issues || [],
        problems: doc.problems || [],
        docUrl: doc.docUrl || '', // Make sure this is available in `doc`
      });

      const savedDoc = await newDoc.save();
   // save doc id to request
   request.documentsId.push(savedDoc._id);
     await request.save();
      savedDocuments.push(savedDoc);
    }

    
    console.log("Documents saved successfully.");
  } catch (err) {
    console.error("Error saving analyzed documents:", err);
  }
};
