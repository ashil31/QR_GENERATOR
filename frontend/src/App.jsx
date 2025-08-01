// src/App.jsx
import React, { useState } from "react";
import QrCodeGenerator from "./components/QrCodeGenerator ";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [count, setCount] = useState(1);
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-100 p-6 flex flex-col items-center justify-center">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-10 border border-blue-200">
        <QrCodeGenerator
          count={count}
          setCount={setCount}
          qrCodes={qrCodes}
          setQrCodes={setQrCodes}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
}
