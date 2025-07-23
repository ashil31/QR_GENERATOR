const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { createCanvas } = require("canvas");
const QrCode = require("../models/qrCode.model");

const generateSerialNumber = () => {
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `SN${ymd}-${rand}`;
};

exports.generateQRCodes = async (req, res) => {
  const { count } = req.body;
  if (!count || count < 1) return res.status(400).json({ error: "Invalid count" });

  const qrCodes = [];
  const qrDir = path.join(__dirname, "../public/qrcodes");
  if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir, { recursive: true });
  }

  for (let i = 0; i < count; i++) {
    const serialNumber = generateSerialNumber();
    const token = Math.random().toString(36).substring(2, 10);
    const url = `https://reward-project-1.onrender.com/redeem/${token}`;

    const canvas = createCanvas(500, 550);
    const ctx = canvas.getContext("2d");

    // Fill background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Generate QR
    const tempCanvas = createCanvas(500, 500);
    await QRCode.toCanvas(tempCanvas, url, { width: 500, margin: 1 });
    ctx.drawImage(tempCanvas, 0, 0);

    // Add text
    ctx.fillStyle = "black";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.fillText(serialNumber, 250, 535);

    // Save image
    const qrPath = path.join(qrDir, `${serialNumber}.png`);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(qrPath, buffer);

    // Save to DB
    const qrBase64 = buffer.toString("base64");
    await QrCode.create({ serialNumber, token, qrImage: qrBase64 });

    qrCodes.push({
      serialNumber,
      token,
      downloadUrl: `https://www.ashilpatel.site/qrcodes/${serialNumber}.png`,
      qrBase64: `data:image/png;base64,${qrBase64}`,
      localPath: qrPath
    });
  }

  // Now generate PDF with those QR codes
  const pdfFileName = `qrcodes_batch_${Date.now()}.pdf`;
  const pdfPath = path.join(qrDir, pdfFileName);

  const doc = new PDFDocument({ size: "A5", layout: "portrait", margin: 20 });
  const stream = fs.createWriteStream(pdfPath);
  doc.pipe(stream);

  const cols = 4;
  const rows = Math.ceil(count / cols);
  const qrSize = 90;
  const spacing = 10;
  const textHeight = 12;

  qrCodes.forEach((qr, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;

    const x = doc.page.margins.left + col * (qrSize + spacing);
    const y = doc.page.margins.top + row * (qrSize + spacing + textHeight + 4);

    const imageBuffer = fs.readFileSync(qr.localPath);
    doc.image(imageBuffer, x, y, { width: qrSize, height: qrSize });

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("black")
      .text(qr.serialNumber, x, y + qrSize + 2, {
        width: qrSize,
        align: "center",
      });
  });

  doc.end();

  stream.on("finish", () => {
    res.json({
      message: "QR Codes Generated",
      total: qrCodes.length,
      qrCodes,
      pdfDownloadUrl: `https://www.ashilpatel.site/qrcodes/${pdfFileName}`,
    });
  });
};
