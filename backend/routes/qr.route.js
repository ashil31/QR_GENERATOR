const express = require("express");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const { generateQRCodes } = require("../controllers/qr.controller");


const router = express.Router();

// Route 1: Generate QR Codes
router.post("/generate-qr", generateQRCodes);

// Route 2: Download ZIP of QR codes
router.post("/download-zip", async (req, res) => {
  const { serialNumbers } = req.body;

  if (!serialNumbers || !Array.isArray(serialNumbers)) {
    return res.status(400).json({ error: "serialNumbers must be an array" });
  }

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", "attachment; filename=qrcodes.zip");

  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("error", (err) => {
    console.error("Archive error:", err);
    res.status(500).send({ error: "Failed to generate zip" });
  });

  archive.pipe(res);

  serialNumbers.forEach((sn) => {
    const filePath = path.join(__dirname, `../public/qrcodes/${sn}.png`);
    if (fs.existsSync(filePath)) {
      archive.file(filePath, { name: `${sn}.png` });
    }
  });

  archive.finalize();
});

module.exports = router;
