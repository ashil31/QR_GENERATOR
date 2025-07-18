const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
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
    const url = `https://www.ashilpatel.site/${token}`;

    const qrPath = path.join(qrDir, `${serialNumber}.png`);

    // Save QR code to file
    await QRCode.toFile(qrPath, url);

    // Read QR image and convert to base64
    const qrImageBuffer = fs.readFileSync(qrPath);
    const qrBase64 = qrImageBuffer.toString("base64");

    // Save all data in DB
    await QrCode.create({
      serialNumber,
      token,
      qrImage: qrBase64
    });

    qrCodes.push({
      serialNumber,
      token,
      downloadUrl: `https://www.ashilpatel.site/qrcodes/${serialNumber}.png`,
      qrBase64: `data:image/png;base64,${qrBase64}`
    });
  }

  res.json({ message: "QR Codes Generated", qrCodes });
};
