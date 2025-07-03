import genAI from "../config/gemini.js";

export const analysisReportAI = async (document) => {
    console.log("functionn call",document);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are an expert analyst. Given the following complaint documents from villagers, analyze and return structured JSON data for 3 sections:

1. commonProblems: List of problems that multiple people reported.
   Each item should include:
   - problem: 20 words English title
   - category
   - count: how many people reported it
   - reporters: array of people who reported it (with docname, wardNumber,_id)

2. wardWiseProblems: For each unique wardNumber:
   - ward: ward number
   - problems: array of problems with:
     - problem: short English title
     - category
     - count: how many people in this ward reported it
     - reporters: array of { docname and thier _id}

3. analytics: An array of each ward with:
   - ward: ward number
   - totalProblems: total number of individual problems reported in that ward

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
       // console.log("Parsed AI output:", parsed);
    } catch (err) {
        console.error("Failed to parse Gemini response:", err.message);
        throw err;
    }

    return parsed;
  } catch (err) {
    console.error(" Gemini error:", err.message);
    throw err;
  }

};
