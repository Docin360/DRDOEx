const { processApplication } = require("../models/mainModel");

const handleApplicationSubmission = async (req, res) => {
  try {
    const filePath = req.file.path; // Assuming file upload middleware
    const results = await processApplication(filePath);
    res.status(200).json({ message: "Application processed successfully", results });
  } catch (error) {
    res.status(500).json({ error: "Failed to process application", details: error });
  }
};

module.exports = { handleApplicationSubmission };
