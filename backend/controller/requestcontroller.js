import fs from "fs";
// fs from 'fs/promises'; // ✅ This gives you a promise-based fs

import path from "path";
import { PDFDocument } from "pdf-lib";
import Request from "../models/Request.js";
import Report from "../models/Report.js";
import  Document from "../models/Document.js";
import { requestStatus } from '../constants/index.js';
import { fileURLToPath } from "url";
import { io } from '../config/socket.js';
import dotenv from 'dotenv';
dotenv.config();
import { exec } from 'child_process';
import { promisify } from 'util';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup upload directory
import  { convertPdfToImages } from '../services/pdfToImg.js';
import { analyzeComplaintImages } from '../services/aiData.js'; // Assuming you have this service for AI analysis
import { saveAnalyzedDocumentsToDB } from '../services/saveData.js'; // Assuming you have this service for saving analyzed data
import { analysisReportAI } from '../services/aiReportData.js';
import { saveReportToDB } from '../services/saveReportData.js'; // Assuming you have this servic

export const newrequest = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required." });
    }

    const filePath = `/uploads/newrequest/${req.file.filename}`;
    const absoluteFilePath = path.resolve(`./uploads/newrequest/${req.file.filename}`);

    // ✅ Read PDF and count pages using pdf-lib
    const pdfBytes = fs.readFileSync(absoluteFilePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pageCount = pdfDoc.getPageCount();

    const request = new Request({
      name,
      description,
      documentCount: pageCount, //  Set from PDF
      uploadedFileUrl: filePath,
      status: "Draft",
      createdBy: req.session.userId, // Assuming the user creating this is the logged-in user
      deleteStatus: requestStatus.active, // 0 for not deleted, 1 for deleted
    });

    await request.save();

    res.status(200).json({ message: "Request created successfully", request });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ error: "Server error while creating request" });
  }
};

export const getrequest = async (req, res) => {
    try {
      // fetach all request creted by the user and deleteStatus is 1
      const requests = await Request.find({ createdBy: req.session.userId, deleteStatus: requestStatus.active })// Sort by creation date, most recent first    
      res.json(requests);
    }catch{

    }
}

export const deleteRequest = async (req, res) => {
    try {
      const id = req.params.id;
      // update deleteStatus to 1
      await Request.findByIdAndUpdate(id, { deleteStatus: requestStatus.deleted });
      res.status(200).json({ message: "Request deleted successfully" });
    } catch (error) {
      console.error("Error deleting request:", error);
      res.status(500).json({ error: "Server error while deleting request" });
    }
};

export const previewRequest = async (req, res) => {
  const { requestId } = req.body;

  if (!requestId) {
    return res.status(400).json({ error: "Request ID is required." });
  }

  try {
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found." });
    }

    const fileRelativePath = request.uploadedFileUrl;
    if (!fileRelativePath) {
      return res.status(400).json({ error: "No template file associated with this request" });
    }

    const inputPath = path.join(process.cwd(), fileRelativePath.replace(/\\/g, "/"));

    if (!fs.existsSync(inputPath)) {
      return res.status(404).json({ error: "Template file not found" });
    }

    // Stream the existing PDF directly
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="template.pdf"');

    const stream = fs.createReadStream(inputPath);
    stream.pipe(res);

    stream.on("error", (err) => {
      console.error("Streaming error:", err);
      res.status(500).json({ error: "Failed to stream PDF file" });
    });

  } catch (err) {
    console.error("Error previewing template:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const generateRequest = async (req, res) => {
  const { requestId } = req.body;

  if (!requestId) {
    return res.status(400).json({ error: "Request ID is required." });
  } 
  try{
    const updatedRequest = await Request.findById(requestId);
    if (!updatedRequest) {
      return res.status(404).json({ error: "Request not found." });
    }
    updatedRequest.status = "In Progress"; // Update status to "In Progress"
    await updatedRequest.save();

 io.to(updatedRequest.createdBy.toString()).emit('request-statusUpdate', {
  _id: updatedRequest._id,
  name: updatedRequest.name,
  description: updatedRequest.description,
  status: updatedRequest.status,
  documentCount: updatedRequest.documentCount,
  yourId: updatedRequest.createdBy.toString(),
   });
    console.log("socket done");
    // const generate = await generateData(fileRelativePath);
    const result = generateData(requestId,updatedRequest.createdBy.toString());
console.log(" Final OCR & Translations:", result);

   res.status(200).json({ message: "Request status updated to In Progress" });
  }catch{

  }
}
// genertae data dcoucmnets and report file 
const generateData = async (requestId, createdBy) => {
  try {
    const request = await Request.findById(requestId);
    if (!request) {
      console.error(" Request not found.");
      return;
    }

    const fileRelativePath = request.uploadedFileUrl;
    const pdfPath = path.join(process.cwd(), fileRelativePath.replace(/\\/g, "/"));

    if (!fs.existsSync(pdfPath)) {
      console.error(" PDF file not found at:", pdfPath);
      return;
    }

    const outputDir = path.join(__dirname, '..', 'uploads', 'requestImg', requestId);
    console.log("Output directory for images:", outputDir);

    // Create the output directory if it doesn't exist
    fs.mkdirSync(outputDir, { recursive: true });

    console.log("Converting PDF to images...");
    const imagePaths = await convertPdfToImages({ pdfPath, outputDir });

    const analyzedDocs = await analyzeComplaintImages(imagePaths);
    const result = await saveAnalyzedDocumentsToDB(requestId, analyzedDocs);
    console.log("Analysis result saved:", result);

    // Update request status to Completed
    
    await request.save();
//  Clean up: delete the output directory after processing
    fs.rmSync(outputDir, { recursive: true, force: true });
    console.log(" directory cleaned up:", outputDir);

    try{
     const documents = await Document.find({ requestId: requestId }).lean();
    const safeDocuments = JSON.parse(JSON.stringify(documents));

   //  console.log("documents found", safeDocuments);
      const aiReport =  await analysisReportAI(safeDocuments);
    console.log("data",aiReport);
       await saveReportToDB(requestId, aiReport);
  } catch (error) {
    console.error(" ERROR in RequestReport:", error.message);
    console.error(error.stack);
  }
     request.status = "Completed";
     await request.save();
    // Emit socket update to client
    io.to(request.createdBy.toString()).emit('request-statusUpdate', {
      _id: request._id,
      name: request.name,
      description: request.description,
      status: request.status,
      documentCount: request.documentCount,
      yourId: request.createdBy.toString(),
    });

    console.log("Request status updated to Completed");
  } catch (error) {
    console.error(" Error in generateData:", error);
  }
};

export const RequestDocumentDetails = async (req, res) => {
  const { id } = req.body;
   // find all document where requestidi sthis 
   try{
    const documents = await Document.find({ requestId: id });
    if(!documents){
      return res.status(404).json({ message: "No documents found for this request" });
    }
  //  console.log("documents found", documents);
    res.json(documents);
   }catch{
    res.status(500).json({ message: "Error fetching documents" });
    }

}

export const DocumentDetails = async (req, res) => {
  const { requestId, documentId  } = req.body;
  try{
   const document = await Document.findById(documentId);
   res.json(document);
  }catch{
   res.status(500).json({ message: "Error fetching document" });
  }

}
// export const downloadDocument = async (req, res) => {
//   const { requestId } = req.body;

//   try {
//     const request = await Request.findById(requestId);
//     if (!request) {
//       return res.status(404).json({ error: "Request not found." });
//     }

//     const fileRelativePath = request.uploadedFileUrl;
//     if (!fileRelativePath) {
//       return res.status(400).json({ error: "No template file associated with this request" });
//     }

//     const filePath = path.join(process.cwd(), fileRelativePath.replace(/\\/g, "/"));
//     const fileBuffer = await fs.readFile(filePath);

//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename="${request.name || 'document.pdf'}"`);
//     res.send(fileBuffer);

//   } catch (err) {
//     console.error("Download error:", err);
//     res.status(500).json({ message: "Error downloading document" });
//   }
// };

export const downloadDocument = async (req, res) => {
  const { requestId } = req.body;

  try {
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found." });
    }

    const fileRelativePath = request.uploadedFileUrl;
    if (!fileRelativePath) {
      return res.status(400).json({ error: "No template file associated with this request" });
    }

    const filePath = path.join(process.cwd(), fileRelativePath.replace(/\\/g, "/"));
    console.log("Attempting to read file from:", filePath); // Debugging line

    // Wrap fs.readFile in a Promise
    const fileBuffer = await new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${request.name || 'document.pdf'}"`);
    res.send(fileBuffer);

  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ message: "Error downloading document" });
  }
};

export const RequestReport = async (req, res) => {
    const { requestId } = req.body;
    console.log("Request ID:", requestId);
   try{
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    const reportid =  request.reportId;
    const report = await Report.findById(reportid);
    res.json(report);

   }catch{
    return res.status(500).json({ message: "Error fetching request report" });
   }
}