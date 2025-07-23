const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const QrCode = require("../models/qrCode.model");

const cmToPt = (cm) => cm * 28.3465;

exports.generateQRCodesPDF = async (req, res) => {
  const { count } = req.body;

  if (!count || count < 1 || count > 100)
    return res.status(400).json({ error: "Invalid count" });

  const qrCodes = [];
  const qrDir = path.join(__dirname, "../public/qrcodes");
  if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });

  for (let i = 0; i < count; i++) {
    const now = new Date();
    const ymd = now.toISOString().slice(0, 10).replace(/-/g, "");
    const rand = Math.floor(100 + Math.random() * 900);
    const serialNumber = `SN${ymd}-${rand}`;
    const token = Math.random().toString(36).substring(2, 10);
    const url = `https://reward-project-1.onrender.com/redeem/${token}`;
    const qrPath = path.join(qrDir, `${serialNumber}.png`);

    await QRCode.toFile(qrPath, url, { width: 250, margin: 1 });
    await QrCode.create({ serialNumber, token });
    qrCodes.push({ serialNumber, filePath: qrPath });
  }

  // Page and QR dimensions
  const pageWidth = cmToPt(10);         // ~283 pt
  const pageHeight = cmToPt(7.5);       // ~212 pt
  const qrSize = cmToPt(3.2);           // 3.2 cm square
  const textHeight = 10;
  const itemsPerPage = 4;
  const cols = 2;
  const rows = 2;

  const spacingX = (pageWidth - (cols * qrSize)) / (cols + 1);
  const spacingY = (pageHeight - (rows * (qrSize + textHeight))) / (rows + 1);

  const pdfPath = path.join(qrDir, `qr-batch-${Date.now()}.pdf`);
  const doc = new PDFDocument({ size: [pageWidth, pageHeight], margin: 0 });
  doc.pipe(fs.createWriteStream(pdfPath));

  for (let i = 0; i < qrCodes.length; i++) {
    const qr = qrCodes[i];
    const pos = i % itemsPerPage;
    const col = pos % cols;
    const row = Math.floor(pos / cols);

    const x = spacingX + col * (qrSize + spacingX);
    const y = spacingY + row * (qrSize + textHeight + spacingY);

    // 🟦 Square QR Code
    doc.image(qr.filePath, x, y, { width: qrSize, height: qrSize });

    // 🏷️ Serial number
    doc
      .fillColor("black")
      .fontSize(7.5)
      .text(qr.serialNumber, x, y + qrSize + 2, {
        width: qrSize,
        align: "center",
      });

    // ➕ Add new page if needed
    if (pos === itemsPerPage - 1 && i !== qrCodes.length - 1) {
      doc.addPage({ size: [pageWidth, pageHeight], margin: 0 });
    }
  }

  doc.end();

  res.json({
    message: "PDF with square QR codes generated",
    downloadUrl: `https://qr-generator-i9oy.onrender.com/qrcodes/${path.basename(pdfPath)}`,
  });
};
