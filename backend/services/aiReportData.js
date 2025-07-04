import genAI from "../config/gemini.js";

export const analysisReportAI = async (document) => {
    console.log("functionn call",document);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are an expert analyst. Given the following complaint documents from villagers, analyze and return structured JSON data for 3 sections:

1. commonProblems: List of problems that multiple people reported.
   Each item should include:
   - problem: 20 words English title
   - category:provide problem related category one or more categories
   - reporters: array of people who reported it (with docname, wardNumber,_id,phoneNumber,problems )
   - count: count of reporters

2. wardWiseProblems: For each unique wardNumber:
   - ward: ward number
   - problems: array of problems with:
     - problem: 20 ward English title
     - category:provide problem related category one or more categories
     - reporters: array of { docname and thier _id,wardNumber,phoneNumber,problems }
     - count: count of reporters

3. analytics: An array of each ward with:
   - ward: ward number
   - totalProblems: total number of individual problems reported in that ward
   - categories: array of categories of problems reported in that ward and total problem count for each category

Use the following documents:
${JSON.stringify(document, null, 2)}

Return result in JSON only.
  `;

  try {
    const result = await model.generateContent(prompt); 
    const response = await result.response;
    const rawText = response.text(); // assuming this returns the Gemini output

    // Remove ```json and ``` if present
    const cleaned = rawText.replace(/```json|```/g, '').trim();

    let parsed;
    try {
        parsed = JSON.parse(cleaned);
       console.log("Parsed AI output:", parsed);
    } catch (err) {
        console.error("Failed to parse Gemini response:", err.message);
        throw err;
    }
    console.log("AI Analysis Completed: ", parsed);
    return parsed;
  } catch (err) {
    console.error(" Gemini error:", err.message);
    throw err;
  }

};
