// import fs from "fs";
// import path from "path";
// import { PDFDocument } from "pdf-lib";
// import Request from "../models/Request.js";
// import { requestStatus } from '../constants/index.js';
// import os from "os";
// import { v4 as uuidv4 } from "uuid";
// import { fileURLToPath } from "url";
// import { io } from '../config/socket.js';
// import dotenv from 'dotenv';
// import OpenAI from 'openai';
// import Tesseract from 'tesseract.js';
// import { Translate } from '@google-cloud/translate/build/src/v2/index.js';
// dotenv.config();
// import pdf2pic from "pdf2pic";
// const { fromPath } = pdf2pic;




// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);



// // OpenAI API Setup
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// // Google Translate API Setup
// const translate = new Translate({
//   projectId: process.env.GCP_PROJECT_ID,
//   keyFilename: process.env.GCP_CREDENTIALS_PATH // path to JSON key file
// });


// const convertPDFToImage = async (pdfPath) => {
//   const outputPath = path.join(__dirname, "../converted-images");
//   const converter = fromPath(pdfPath, {
//     density: 300,
//     saveFilename: "converted_page",
//     savePath: outputPath,
//     format: "jpeg",
//     width: 1200,
//     height: 1600,
//   });

//   try {
//     const result = await converter(1); // Convert first page only
//     return result.path; // Full path to image
//   } catch (err) {
//     console.error("❌ PDF to Image conversion failed:", err);
//     throw err;
//   }
// };

// export const newrequest = async (req, res) => {
//   try {
//     const { name, description } = req.body;

//     if (!req.file) {
//       return res.status(400).json({ error: "PDF file is required." });
//     }

//     const filePath = `/uploads/newrequest/${req.file.filename}`;
//     const absoluteFilePath = path.resolve(`./uploads/newrequest/${req.file.filename}`);

//     // ✅ Read PDF and count pages using pdf-lib
//     const pdfBytes = fs.readFileSync(absoluteFilePath);
//     const pdfDoc = await PDFDocument.load(pdfBytes);
//     const pageCount = pdfDoc.getPageCount();

//     const request = new Request({
//       name,
//       description,
//       documentCount: pageCount, // 👈 Set from PDF
//       uploadedFileUrl: filePath,
//       status: "Draft",
//       createdBy: req.session.userId, // Assuming the user creating this is the logged-in user
//       deleteStatus: requestStatus.active, // 0 for not deleted, 1 for deleted
//     });

//     await request.save();

//     res.status(200).json({ message: "Request created successfully", request });
//   } catch (error) {
//     console.error("Error creating request:", error);
//     res.status(500).json({ error: "Server error while creating request" });
//   }
// };

// export const getrequest = async (req, res) => {
//     try {
//       // fetach all request creted by the user and deleteStatus is 1
//       const requests = await Request.find({ createdBy: req.session.userId, deleteStatus: requestStatus.active })// Sort by creation date, most recent first    
//       res.json(requests);
//     }catch{

//     }
// }

// export const deleteRequest = async (req, res) => {
//     try {
//       const id = req.params.id;
//       // update deleteStatus to 1
//       await Request.findByIdAndUpdate(id, { deleteStatus: requestStatus.deleted });
//       res.status(200).json({ message: "Request deleted successfully" });
//     } catch (error) {
//       console.error("Error deleting request:", error);
//       res.status(500).json({ error: "Server error while deleting request" });
//     }
// };

// export const previewRequest = async (req, res) => {
//   const { requestId } = req.body;

//   if (!requestId) {
//     return res.status(400).json({ error: "Request ID is required." });
//   }

//   try {
//     const request = await Request.findById(requestId);
//     if (!request) {
//       return res.status(404).json({ error: "Request not found." });
//     }

//     const fileRelativePath = request.uploadedFileUrl;
//     if (!fileRelativePath) {
//       return res.status(400).json({ error: "No template file associated with this request" });
//     }

//     const inputPath = path.join(process.cwd(), fileRelativePath.replace(/\\/g, "/"));

//     if (!fs.existsSync(inputPath)) {
//       return res.status(404).json({ error: "Template file not found" });
//     }

//     // Stream the existing PDF directly
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", 'inline; filename="template.pdf"');

//     const stream = fs.createReadStream(inputPath);
//     stream.pipe(res);

//     stream.on("error", (err) => {
//       console.error("Streaming error:", err);
//       res.status(500).json({ error: "Failed to stream PDF file" });
//     });

//   } catch (err) {
//     console.error("Error previewing template:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export const generateRequest = async (req, res) => {
//   const { requestId } = req.body;

//   if (!requestId) {
//     return res.status(400).json({ error: "Request ID is required." });
//   } 
//   try{
//     const request = await Request.findById(requestId);
//     if (!request) {
//       return res.status(404).json({ error: "Request not found." });
//     }
//     const fileRelativePath = request.uploadedFileUrl;
//     console.log("fileRelativePath", fileRelativePath);
//     if (!fileRelativePath) {
//       return res.status(400).json({ error: "No template file associated with this request" });
//     }
//     request.status = "In Progress"; // Update status to "In Progress"
//    // await request.save();
//     // io.emit('request-statusUpdate', {
//     //   yourId: request.createdBy,
//     // });
//     io.to(request.createdBy.toString()).emit('request-statusUpdate', {
//   yourId: request.createdBy.toString(),
//    });
//     console.log("socket done");
//     const generate = await generatedData(fileRelativePath);
//    res.status(200).json({ message: "Request status updated to In Progress" });
//   }catch{

//   }
// }

// const generateData = (filePath) =>{
//  clg("Generating data for file:", filePath);
// }


import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import Request from "../models/Request.js";
import { requestStatus } from '../constants/index.js';
import os from "os";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { io } from '../config/socket.js';
import dotenv from 'dotenv';
dotenv.config();
import { createWorker } from 'tesseract.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import axios from 'axios';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const execAsync = promisify(exec);
import  { convertPdfToImages } from '../services/pdfToImg.js';
import { analyzeComplaintImages } from '../services/aiData.js'; // Assuming you have this service for AI analysis
import { saveAnalyzedDocumentsToDB } from '../services/saveData.js'; // Assuming you have this service for saving analyzed data


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
      documentCount: pageCount, // 👈 Set from PDF
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
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found." });
    }
    request.status = "In Progress"; // Update status to "In Progress"
    io.to(request.createdBy.toString()).emit('request-statusUpdate', {
  yourId: request.createdBy.toString(),
   });
    console.log("socket done");
    // const generate = await generateData(fileRelativePath);
    const result = await generateData(requestId);
console.log("✅ Final OCR & Translations:", result);

   res.status(200).json({ message: "Request status updated to In Progress" });
  }catch{

  }
}
const generateData = async (requestId) => {
  try {
    const request = await Request.findById(requestId);
    if (!request) {
      console.error("❌ Request not found.");
      return;
    }

    const fileRelativePath = request.uploadedFileUrl;
    const pdfPath = path.join(process.cwd(), fileRelativePath.replace(/\\/g, "/"));

    if (!fs.existsSync(pdfPath)) {
      console.error("❌ PDF file not found at:", pdfPath);
      return;
    }

    const outputDir = path.join(__dirname,'..','uploads', 'requestImg', requestId);
    // console relative path to the generated images
    console.log("📂 Output directory for images:", outputDir);
    // Create the output directory if it doesn't exist
    fs.mkdirSync(outputDir, { recursive: true });

    console.log("📄 Converting PDF to images...");
    const imagePaths = await convertPdfToImages({ pdfPath, outputDir });

     const analyzedDocs = await analyzeComplaintImages(imagePaths);
      //  console.log("AI output:", analyzedDocs);

    const result = await saveAnalyzedDocumentsToDB(requestId, analyzedDocs);
                console.log("result : ", result);

    console.log("✅ PDF converted to images:", imagePaths);

    return imagePaths;

  } catch (error) {
    console.error("❌ Error in generateData:", error);
  }
};
