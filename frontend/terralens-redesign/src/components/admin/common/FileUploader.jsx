import { Upload } from "lucide-react";
import { useState } from "react";
import { uploadFile } from "../../../api/media";
import { useToast } from "../../admin/ToastProvider";

export default function FileUploader({
  folder,
  label = "Upload File",
  accept = "*/*",
  onUploaded,
}) {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    try {
      const result = await uploadFile(folder, file);

      if (onUploaded) {
        onUploaded(result);
      }

      showToast("File uploaded successfully!", "success");
    } catch (err) {
      console.error("Upload failed:", err);
      showToast("Upload failed.", "error");
    } finally {
      setUploading(false);

      // Allow selecting the same file again
      e.target.value = "";
    }
  };

  return (
    <div
      style={{
        marginTop: "12px",
        width: "100%",
      }}
    >
      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          border: "1px solid #bae6fd",
          borderRadius: "12px",
          padding: "12px 20px",
          cursor: uploading ? "not-allowed" : "pointer",
          color: "#0284c7",
          background: "#f0f9ff",
          fontWeight: "600",
          fontSize: "14px",
          opacity: uploading ? 0.6 : 1,
          boxSizing: "border-box",
          transition: "all 0.2s ease",
        }}
      >
        <Upload size={18} />

        {uploading ? "Uploading..." : label}

        <input
          type="file"
          accept={accept}
          hidden
          disabled={uploading}
          onChange={handleUpload}
        />
      </label>
    </div>
  );
}