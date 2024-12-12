const express = require("express");
const multer = require("multer");
const { handleApplicationSubmission } = require("../controllers/applicationController");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temporary file storage

router.post("/submit", upload.single("file"), handleApplicationSubmission);

module.exports = router;
