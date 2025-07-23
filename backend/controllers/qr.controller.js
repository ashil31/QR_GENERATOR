const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const QrCode = require("../models/qrCode.model");

const cmToPt = (cm) => (cm * 28.3465); // convert cm to points

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

    await QRCode.toFile(qrPath, url, { width: 300, margin: 1 });
    await QrCode.create({ serialNumber, token });

    qrCodes.push({ serialNumber, filePath: qrPath });
  }

  // PDF settings
  const pageWidth = cmToPt(10); // 10 cm
  const pageHeight = cmToPt(7.5); // 7.5 cm
  const qrWidth = cmToPt(4); // 4 cm
  const qrHeight = cmToPt(3); // 3 cm

  const pdfPath = path.join(qrDir, `qr-batch-${Date.now()}.pdf`);
  const doc = new PDFDocument({ size: [pageWidth, pageHeight], margin: 10 });
  doc.pipe(fs.createWriteStream(pdfPath));

  const itemsPerPage = 4;
  const cols = 2;
  const rows = 2;

  for (let i = 0; i < qrCodes.length; i++) {
    const qr = qrCodes[i];
    const positionInPage = i % itemsPerPage;
    const col = positionInPage % cols;
    const row = Math.floor(positionInPage / cols);

    const spacingX = (pageWidth - (cols * qrWidth)) / (cols + 1);
    const spacingY = (pageHeight - (rows * qrHeight + 20)) / (rows + 1); // +20 for serial

    const x = spacingX + col * (qrWidth + spacingX);
    const y = spacingY + row * (qrHeight + spacingY + 15);

    doc.image(qr.filePath, x, y, { width: qrWidth, height: qrHeight });

    doc
      .fillColor("black")
      .fontSize(8)
      .text(qr.serialNumber, x, y + qrHeight + 5, {
        width: qrWidth,
        align: "center",
      });

    if (positionInPage === itemsPerPage - 1 && i !== qrCodes.length - 1) {
      doc.addPage({ size: [pageWidth, pageHeight], margin: 10 });
    }
  }

  doc.end();

  res.json({
    message: "PDF with QR codes generated",
    downloadUrl: `https://qr-generator-i9oy.onrender.com/qrcodes/${path.basename(pdfPath)}`,
  });
};
