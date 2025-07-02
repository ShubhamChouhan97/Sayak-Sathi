import fs from 'fs';
import path from 'path';
import pdfPoppler from 'pdf-poppler'; 


export const convertPdfToImages = async ({ pdfPath, outputDir }) => {

    if (!pdfPath || !outputDir) {
        throw new Error("pdfPath or outputDir is missing");
    }

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const options = {
        format: 'jpeg',
        out_dir: outputDir,
        out_prefix: 'page',
        page: null
    };

    try {
        await pdfPoppler.convert(pdfPath, options); 
        const files = fs
            .readdirSync(outputDir)
            .filter((f) => f.endsWith(".jpg") || f.endsWith(".jpeg"))
            .map((file) => path.join(outputDir, file));
        return files;
    } catch (error) {
        console.error("Failed to convert PDF to images:", error);
        throw error;
    }
};