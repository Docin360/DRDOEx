const { spawn } = require("child_process");
const path = require("path");

const runNER = (extractedText) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", [path.join(__dirname, "ner_model.py"), extractedText]);

    let data = "";
    pythonProcess.stdout.on("data", (chunk) => {
      data += chunk;
    });

    pythonProcess.stderr.on("data", (error) => {
      console.error("NER Error:", error.toString());
      reject(error.toString());
    });

    pythonProcess.on("close", () => {
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject("Error parsing NER output");
      }
    });
  });
};

module.exports = { runNER };
