const mongoose = require("mongoose");

const qrCodeSchema = new mongoose.Schema({
  serialNumber: String,
  token: String,
  qrImage: String, // base64-encoded image
}, {
  timestamps: true
});

module.exports = mongoose.model("QrCode", qrCodeSchema);
