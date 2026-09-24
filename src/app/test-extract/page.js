"use client";
import { useState } from "react";

export default function TestExtract() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(",")[1]; // strip data:image/... prefix

      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });

      const data = await res.json();
      setResult(data);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Test Gemini Prescription Extraction</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {loading && <p>Extracting... please wait</p>}
      {result && (
        <pre className="text-black flex overflow-auto" style={{ background: "#eee", padding: "20px", marginTop: "20px" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}