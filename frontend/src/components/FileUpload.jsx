import React, { useState } from "react";
import api from "../utils/api";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [distributionResult, setDistributionResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setMessage({ type: "", text: "" });
    setDistributionResult(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage({ type: "error", text: "Please select a file to upload" });
      return;
    }

    // Validate file type
    const allowedTypes = [".csv", ".xlsx", ".xls"];
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));

    if (!allowedTypes.includes(fileExtension)) {
      setMessage({
        type: "error",
        text: "Invalid file type. Only CSV, XLS, and XLSX files are allowed.",
      });
      return;
    }

    setUploading(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage({ type: "success", text: response.data.message });
      setDistributionResult(response.data);
      setFile(null);

      // Reset file input
      e.target.reset();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error uploading file",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Upload CSV/Excel File
        </h2>

        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            File Requirements:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• File formats: CSV, XLS, XLSX only</li>
            <li>
              • Required columns: <strong>FirstName</strong>,{" "}
              <strong>Phone</strong>
            </li>
            <li>
              • Optional column: <strong>Notes</strong>
            </li>
            <li>• Leads will be distributed equally among 5 agents</li>
            <li>• You must have exactly 5 agents to upload leads</li>
          </ul>
        </div>

        {message.text && (
          <div
            className={`mb-4 p-4 rounded-md ${
              message.type === "success"
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700"
            >
              Select File
            </label>
            <input
              type="file"
              id="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={uploading || !file}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading
                ? "Uploading and Distributing..."
                : "Upload and Distribute"}
            </button>
          </div>
        </form>
      </div>

      {/* Distribution Result */}
      {distributionResult && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Distribution Summary
          </h2>

          <div className="mb-4 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800">
              <strong>Total Leads:</strong> {distributionResult.totalLeads}
            </p>
            <p className="text-green-800">
              <strong>Distributed Among:</strong>{" "}
              {distributionResult.distributions.length} agents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {distributionResult.distributions.map((dist, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {dist.agent.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {dist.agent.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {dist.agent.email}
                    </div>
                  </div>
                </div>
                <div className="text-lg font-semibold text-blue-600">
                  {dist.leadsCount} leads
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
