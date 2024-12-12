const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { db, storage } = require("./firebaseConfig");
const { processOCR } = require("./models/ocrModel");
const { processNER } = require("./models/nerModel");
const { processMainModel } = require("./models/mainModel");

const app = express();
app.use(cors());
app.use(express.json());

// Multer setup for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

app.post(
  "/api/submitForm",
  upload.fields([
    { name: "idProof", maxCount: 1 },
    { name: "casteCertificate", maxCount: 1 },
    { name: "noObjectionCertificate", maxCount: 1 },
    { name: "pwdCertificate", maxCount: 1 },
    { name: "educationMarksCards", maxCount: 10 },
    { name: "experienceCertificates", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const formData = JSON.parse(req.body.formData);
      const applicationRef = await db.collection("applications").add(formData);
      const applicationId = applicationRef.id;

      const uploadFile = async (file, path) => {
        const blob = storage.file(`${applicationId}/${path}`);
        const blobStream = blob.createWriteStream({
          metadata: { contentType: file.mimetype },
        });
        return new Promise((resolve, reject) => {
          blobStream.on("error", reject);
          blobStream.on("finish", () => resolve(blob.publicUrl()));
          blobStream.end(file.buffer);
        });
      };

      const fileUrls = {};

      // Upload files
      if (req.files.idProof) {
        fileUrls.idProof = await uploadFile(req.files.idProof[0], "idProof");
      }
      if (req.files.casteCertificate) {
        fileUrls.casteCertificate = await uploadFile(req.files.casteCertificate[0], "casteCertificate");
      }
      if (req.files.noObjectionCertificate) {
        fileUrls.noObjectionCertificate = await uploadFile(req.files.noObjectionCertificate[0], "noObjectionCertificate");
      }
      if (req.files.pwdCertificate) {
        fileUrls.pwdCertificate = await uploadFile(req.files.pwdCertificate[0], "pwdCertificate");
      }

      for (let i = 0; i < (req.files.educationMarksCards || []).length; i++) {
        fileUrls[`educationMarksCard_${i}`] = await uploadFile(
          req.files.educationMarksCards[i],
          `education/${i}/marksCard`
        );
      }
      for (let i = 0; i < (req.files.experienceCertificates || []).length; i++) {
        fileUrls[`experienceCertificate_${i}`] = await uploadFile(
          req.files.experienceCertificates[i],
          `experience/${i}/certificate`
        );
      }

      // Step 1: OCR Processing
      const ocrResults = await processOCR(fileUrls);
      console.log("OCR Results:", ocrResults);

      // Step 2: NER Processing
      const nerResults = await processNER(ocrResults);
      console.log("NER Results:", nerResults);

      // Step 3: Main Model Processing
      const finalResults = await processMainModel(nerResults);
      console.log("Final Results:", finalResults);

      // Save final results and file URLs in Firebase
      await applicationRef.update({
        fileUrls,
        ocrResults,
        nerResults,
        finalResults,
      });

      res.status(200).send({
        message: "Application submitted and processed successfully!",
        applicationId,
        finalResults,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      res.status(500).send("Failed to submit application.");
    }
  }
);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
