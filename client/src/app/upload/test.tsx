"use client";
import React, { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Set the dropEffect to show the user what will happen
    e.dataTransfer.dropEffect = "copy";
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      // Clear the drag data
      e.dataTransfer.clearData();
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadUrl(data.webViewLink);
      } else {
        console.error("Upload failed:", await response.text());
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-400 p-6 rounded-lg w-96 text-center"
      >
        {file ? (
          <p className="text-gray-600">{file.name}</p>
        ) : (
          <p className="text-gray-600">Drag and drop a file here, or click the button below to select one.</p>
        )}
      </div>
      <button
        onClick={handleFileUpload}
        disabled={!file || isUploading}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
      {uploadUrl && (
        <div className="mt-4">
          <p>File uploaded successfully! Public URL:</p>
          <a
            href={uploadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {uploadUrl}
          </a>
        </div>
      )}
    </div>
  );
}