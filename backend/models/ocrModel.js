const { spawn } = require("child_process");
const path = require("path");

const runOCR = (filePath) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", [path.join(__dirname, "ocr_model.py"), filePath]);

    let data = "";
    pythonProcess.stdout.on("data", (chunk) => {
      data += chunk;
    });

    pythonProcess.stderr.on("data", (error) => {
      console.error("OCR Error:", error.toString());
      reject(error.toString());
    });

    pythonProcess.on("close", () => {
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject("Error parsing OCR output");
      }
    });
  });
};

module.exports = { runOCR };
