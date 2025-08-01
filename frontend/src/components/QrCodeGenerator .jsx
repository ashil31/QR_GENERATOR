import axios from "axios";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

const QrCodeGenerator = ({ count, setCount, loading, setLoading }) => {
  const [pdfUrl, setPdfUrl] = useState(null);

  const generateQRCodes = async () => {
    setLoading(true);
    setPdfUrl(null);

    try {
      const res = await axios.post(
        "https://qr-generator-i9oy.onrender.com/api/generate-qr-pdf",
        { count }
      );

      const { downloadUrl } = res.data;

      const fileResponse = await axios.get(downloadUrl, {
        responseType: "blob",
      });

      const blob = new Blob([fileResponse.data], { type: "application/pdf" });
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "qrcodes.pdf";
      link.click();

      // Clean up
      window.URL.revokeObjectURL(blobUrl);
      setPdfUrl(downloadUrl);
    } catch (err) {
      console.log("ERROR RESPONSE:", err.response);

      const message =
        err?.response?.data?.error  ||
        "Something went wrong. Please check the input.";
      toast.error(message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-12 px-6 py-8 bg-white hover:shadow-xl hover:-translate-y-2 rounded-xl">
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
        <FontAwesomeIcon icon={faQrcode} /> QR Code PDF Generator
      </h1>

      <label className="block text-gray-700 text-sm font-semibold mb-2">
        How many QR codes do you want?
      </label>
      <input
        type="number"
        value={count}
        onChange={(e) => setCount(e.target.value)}
        className="w-full mb-6 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="e.g. 16"
        min="1"
      />

      <button
        onClick={generateQRCodes}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold text-white transition ${
          loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "🔄 Generating PDF..." : "📄 Generate & Download PDF"}
      </button>

      {pdfUrl && (
        <p className="text-center text-green-600 mt-4">
          <FontAwesomeIcon icon={faFileExport} className="text-green mr-2" />{" "}
          PDF Generated! Check your downloads.
        </p>
      )}
    </div>
  );
};

export default QrCodeGenerator;
