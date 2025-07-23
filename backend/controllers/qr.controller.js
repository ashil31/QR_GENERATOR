const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const QrCode = require("../models/qrCode.model");

const generateSerialNumber = () => {
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `SN${ymd}-${rand}`;
};

exports.generateQRCodesPDF = async (req, res) => {
  const { count } = req.body;

  if (!count || count < 1 || count > 100)
    return res.status(400).json({ error: "Invalid count" });

  const qrCodes = [];
  const qrDir = path.join(__dirname, "../public/qrcodes");
  if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });

  for (let i = 0; i < count; i++) {
    const serialNumber = generateSerialNumber();
    const token = Math.random().toString(36).substring(2, 10);
    const url = `https://reward-project-1.onrender.com/redeem/${token}`;
    const qrPath = path.join(qrDir, `${serialNumber}.png`);

    await QRCode.toFile(qrPath, url, {
      width: 300,
      margin: 1,
    });

    await QrCode.create({ serialNumber, token });
    qrCodes.push({ serialNumber, filePath: qrPath });
  }

  const pdfPath = path.join(qrDir, `qr-batch-${Date.now()}.pdf`);
  const doc = new PDFDocument({ size: "A5", margin: 20 });
  doc.pipe(fs.createWriteStream(pdfPath));

  const cols = 4;
  const rows = 4;
  const qrSize = 100;
  const spacingX = (doc.page.width - cols * qrSize) / (cols + 1);
  const spacingY = (doc.page.height - rows * qrSize) / (rows + 1);

  qrCodes.forEach((qr, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    const x = spacingX + col * (qrSize + spacingX);
    const y = spacingY + row * (qrSize + spacingY);

    doc.image(qr.filePath, x, y, { width: qrSize });
    doc
      .fillColor("black")
      .opacity(0.5)
      .rect(x, y + qrSize / 2 - 7, qrSize, 14)
      .fill();

    doc
      .fillColor("white")
      .fontSize(8)
      .opacity(1)
      .text(qr.serialNumber, x, y + qrSize / 2 - 5, {
        width: qrSize,
        align: "center",
      });
  });

  doc.end();

  res.json({
    message: "PDF with QR codes generated",
    downloadUrl: `https://www.ashilpatel.site/qrcodes/${path.basename(pdfPath)}`,
  });
};

