const { runOCR } = require("./ocrModel");
const { runNER } = require("./nerModel");

const processApplication = async (filePath) => {
  try {
    const ocrResult = await runOCR(filePath);
    console.log("OCR Output:", ocrResult);

    const nerResult = await runNER(ocrResult.extracted_text);
    console.log("NER Output:", nerResult);

    return { ocrResult, nerResult };
  } catch (error) {
    console.error("Error processing application:", error);
    throw error;
  }
};

module.exports = { processApplication };
