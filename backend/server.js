const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const path = require("path");
const cors = require('cors');
app.use(cors());

app.use(express.json()); // modern & preferred
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use("/qrcodes", express.static(path.join(__dirname, "public/qrcodes")));



const PORT = process.env.PORT;

const qrRoutes = require("./routes/qr.route");
app.use("/api", qrRoutes);

// MongoDB Connection
const mongoose = require("mongoose");
const connectDB = require('./config/db');
connectDB();


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
