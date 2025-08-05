# QR Generator Project

## Overview
QR Generator is a full-stack application that generates QR codes and compiles them into a downloadable PDF. The backend is built using Node.js, Express, and MongoDB, while the frontend is built using React with Vite and Tailwind CSS. This production-ready project adheres to industry best practices in code organization, API design, and development workflows.

## Table of Contents
- [Overview](#overview)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [License](#license)

## Folder Structure

```
QR_GENERATOR/
├── README.md
├── backend/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── qr.controller.js
│   ├── models/
│   │   └── qrCode.model.js
│   ├── public/
│   │   └── qrcodes/
│   └── routes/
│       └── qr.route.js
└── frontend/
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── README.md
    ├── tailwind.config.js
    ├── vite.config.js
    └── src/
        ├── App.css
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── assets/
        │   └── ...
        └── components/
            └── QrCodeGenerator .jsx
```

## Installation

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- A running instance of MongoDB

### Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```sh
   cd backend
   ```
2. Install backend dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following:
   ```env
   PORT=5000
   DB_CONNECT=your_mongodb_connection_string
   ```
4. Start the backend server:
   ```sh
   node server.js
   ```
   The server will run at [http://localhost:5000](http://localhost:5000).

### Frontend Setup
1. Open a separate terminal and navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install frontend dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
   Vite will serve your application at [http://localhost:3000](http://localhost:3000) (or as indicated by the terminal).

## API Endpoints

### Generate QR Code PDF
- **Endpoint:** `/api/generate-qr-pdf`
- **Method:** POST
- **Description:** Generates a PDF containing the specified number of QR codes.
- **Request Body Example:**
  ```json
  {
    "count": 16
  }
  ```
- **Successful Response Example:**
  ```json
  {
    "message": "PDF with square QR codes generated",
    "downloadUrl": "https://qr-generator-i9oy.onrender.com/qrcodes/qr-batch-<timestamp>.pdf"
  }
  ```
- **Notes:**  
  - The endpoint validates that `count` is between 1 and 200.
  - Generated QR images are stored in the backend's `public/qrcodes` folder.

## Usage
1. Launch the frontend application in your browser.
2. Enter the desired number of QR codes in the provided input field.
3. Click the **Generate & Download PDF** button.
4. The application will call the backend API, generate a PDF with QR codes, and automatically initiate a download.

## Dependencies

### Backend Dependencies
- [express](https://expressjs.com/)
- [mongoose](https://mongoosejs.com/)
- [dotenv](https://github.com/motdotla/dotenv)
- [qrcode](https://github.com/soldair/node-qrcode)
- [pdfkit](http://pdfkit.org/)
- [cors](https://github.com/expressjs/cors)

### Frontend Dependencies
- [react](https://reactjs.org/)
- [react-dom](https://reactjs.org/)
- [axios](https://axios-http.com/)
- [react-hot-toast](https://react-hot-toast.com/)
- [@fortawesome/fontawesome-svg-core](https://fontawesome.com/)
- [@fortawesome/free-solid-svg-icons](https://fontawesome.com/)
- [@fortawesome/react-fontawesome](https://fontawesome.com/)
- [vite](https://vitejs.dev/)
- [tailwindcss](https://tailwindcss.com/)
- [postcss](https://postcss.org/)
- [autoprefixer](https://github.com/postcss/autoprefixer)

## License

Copyright (c) 2025 Ashil Patel

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:                        

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.