// src/routes/requestRoute.ts
import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { newrequest,getrequest,deleteRequest,previewRequest,generateRequest } from "../../controller/requestcontroller.js";

const router = Router();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup upload directory
const uploadDirfornewrequest = path.join(__dirname, "../../uploads/newrequest");

if (!fs.existsSync(uploadDirfornewrequest)) {
  fs.mkdirSync(uploadDirfornewrequest, { recursive: true });
}

// Setup multer storage


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirfornewrequest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname); // Get the file extension
    cb(null, `${uniqueSuffix}${extension}`);
  },
});


// Multer upload middleware
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
});

// Route for handling file upload
router.post("/newrequest", upload.single("file"), newrequest);
router.get('/getrequest',getrequest); // Assuming you have a getRequest function in your controller
router.delete('/deleterequest/:id',deleteRequest); // Assuming you have a deleteRequest function in your controller
router.post('/previewRequest',previewRequest);
router.post('/generateRequest',generateRequest);
export default router;
