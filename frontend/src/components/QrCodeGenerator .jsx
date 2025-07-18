import axios from "axios";

const QrCodeGenerator = (props) => {
  const { count, setCount, qrCodes, setQrCodes, loading, setLoading } = props;
  const generateQRCodes = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/generate-qr", {
        count,
      });

      const generated = res.data.qrCodes;
      setQrCodes(generated);

      // 👉 Collect all serial numbers
      const serialNumbers = generated.map((qr) => qr.serialNumber);

      // 👉 Request the zip download
      const zipRes = await axios.post(
        "http://localhost:3000/api/download-zip",
        { serialNumbers },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([zipRes.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "qrcodes.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Failed to generate QR codes");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
        📦 QR Code Generator
      </h1>

      <div className="mb-6">
        <label className="block mb-2 text-gray-700 font-medium">
          How many QR codes do you want to generate?
        </label>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          min="1"
        />
      </div>

      <button
        onClick={generateQRCodes}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
      >
        {loading ? "🚀 Generating..." : "🎉 Generate QR Codes"}
      </button>

      {qrCodes.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            🖨️ Generated QR Codes
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {qrCodes.map(({ serialNumber }) => (
              <div
                key={serialNumber}
                className="flex flex-col items-center bg-gray-50 rounded-lg shadow p-4"
              >
                <a
                  href={`http://localhost:3000/qrcodes/${serialNumber}.png`}
                  download={`${serialNumber}.png`}
                  className="hover:opacity-80 transition"
                >
                  <img
                    src={`http://localhost:3000/qrcodes/${serialNumber}.png`}
                    alt={serialNumber}
                    className="w-24 h-24 mb-2 border rounded"
                  />
                </a>

                <span className="text-sm font-medium text-gray-600">
                  {serialNumber}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QrCodeGenerator;
