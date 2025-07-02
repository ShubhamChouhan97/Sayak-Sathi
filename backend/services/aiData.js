import genAI from "../config/gemini.js";
import fs from "fs";
import path from "path";

const getImageBase64 = (filePath) => {
    const imageBuffer = fs.readFileSync(filePath);
    return {
        inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType: "image/jpeg",
        },
    };
};

export const analyzeComplaintImages = async (imagePaths = []) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const imageParts = imagePaths.map(getImageBase64);

    const prompt = `
You are analyzing scanned pages of complaints. 
For each page, extract:
- name
- ward number
- phone number
- issues: array of unique problem fields from each problem
- problems: array of objects , object for each marked problem, each having its category specified and has 
    problem written in both english and hindi languages, in the description field, such as : 
  - category: "water", "electricity", "garbage", "pollution", "roads", "general"
  - description: { english: "...", hindi: "..." }

Return as JSON array like:

[
  {
    "name": "...",
    "wardNumber": "...",
    "phoneNumber": "...",
    "issues": [...],
     "problems": [{
        "category": "water",
        "description": {
          "english": "...",
          "hindi": "..."
        }
      }
    ]
  }
]
`;

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }, ...imageParts] }],
    });

    const response = await result.response;
    //   const text = response.text();
    const rawText = response.text(); // assuming this returns the Gemini output

    // Remove ```json and ``` if present
    const cleaned = rawText.replace(/```json|```/g, '').trim();

    let parsed;
    try {
        parsed = JSON.parse(cleaned);
       // console.log("Parsed AI output:", parsed);
    } catch (err) {
        console.error("Failed to parse Gemini response:", err.message);
        throw err;
    }

    return parsed;
};