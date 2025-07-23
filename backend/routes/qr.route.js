const express = require("express");
const archiver = require("archiver");


const router = express.Router();



const { generateQRCodesPDF } = require("../controllers/qr.controller");


router.post("/generate-qr-pdf", generateQRCodesPDF); // <-- ✅ NEW API route

