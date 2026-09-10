import { Trash2, Copy, Eye } from "lucide-react";
import { deleteMedia } from "../../../api/media";
import { useToast } from "../../admin/ToastProvider";

export default function MediaGrid({ files, onRefresh }) {
  const { showToast } = useToast();
  const getMediaUrl = (file) => {
    if (!file?.path) return "";

    if (file.path.startsWith("http")) {
      return file.path;
    }

    return `${import.meta.env.VITE_API_URL}${file.path}`;
  };

  const isVideo = (file) => {
    const filename = file.filename?.toLowerCase() || "";

    return /\.(mp4|webm|mov|avi|mkv)$/i.test(filename);
  };

  const handleDelete = async (file) => {
    if (!window.confirm(`Delete ${file.filename}?`)) {
      return;
    }

    try {
      await deleteMedia(file.folder, file.filename);

      onRefresh();
    } catch (err) {
      console.error("Failed to delete media:", err);
      showToast("Failed to delete media.", "error");
    }
  };

  const copyUrl = (file) => {
    const mediaUrl = getMediaUrl(file);

    navigator.clipboard.writeText(mediaUrl);

    showToast("Copied URL!", "success");
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "24px",
        marginTop: "30px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {files.map((file) => {
        const mediaUrl = getMediaUrl(file);
        const video = isVideo(file);

        return (
          <div
            key={file.path}
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow:
                "0 8px 25px rgba(15,23,42,0.06)",
              transition: "all 0.3s ease",
            }}
          >
            {/* MEDIA PREVIEW */}

            <div
              style={{
                width: "100%",
                height: "180px",
                background: "#f1f5f9",
                overflow: "hidden",
              }}
            >
              {video ? (
                <video
                  src={mediaUrl}
                  muted
                  controls
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt={file.filename}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              )}
            </div>

            {/* FILE INFORMATION */}

            <div
              style={{
                padding: "20px",
              }}
            >
              <h4
                style={{
                  color: "#0f172a",
                  margin: 0,
                  fontSize: "1rem",
                  fontWeight: "700",
                  lineHeight: "1.4",
                  wordBreak: "break-word",
                }}
              >
                {file.filename}
              </h4>

              <p
                style={{
                  color: "#64748b",
                  marginTop: "7px",
                  marginBottom: 0,
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                {file.folder}
              </p>

              {/* ACTIONS */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                {/* VIEW */}

                <button
                  type="button"
                  title="View"
                  onClick={() =>
                    window.open(mediaUrl, "_blank")
                  }
                  style={{
                    width: "38px",
                    height: "38px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                    border: "1px solid #dbeafe",
                    background: "#eff6ff",
                    color: "#0284c7",
                    cursor: "pointer",
                  }}
                >
                  <Eye size={18} />
                </button>

                {/* COPY URL */}

                <button
                  type="button"
                  title="Copy URL"
                  onClick={() => copyUrl(file)}
                  style={{
                    width: "38px",
                    height: "38px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                    border: "1px solid #dbeafe",
                    background: "#eff6ff",
                    color: "#0284c7",
                    cursor: "pointer",
                  }}
                >
                  <Copy size={18} />
                </button>

                {/* DELETE */}

                <button
                  type="button"
                  title="Delete"
                  onClick={() => handleDelete(file)}
                  style={{
                    width: "38px",
                    height: "38px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                    border: "1px solid #fecaca",
                    background: "#fef2f2",
                    color: "#dc2626",
                    cursor: "pointer",
                    marginLeft: "auto",
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}