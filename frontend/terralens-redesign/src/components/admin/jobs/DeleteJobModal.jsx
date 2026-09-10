import { deleteJob } from "../../../api/jobs";
import { useToast } from "../../admin/ToastProvider";

export default function DeleteJobModal({
  open,
  job,
  onClose,
  onSuccess,
}) {
  if (!open || !job) return null;

  const { showToast } = useToast();
  const handleDelete = async () => {
    try {
      await deleteJob(job.id);

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete job.", "error");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        zIndex: 999,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "500px",
          maxWidth: "100%",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "35px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 25px 60px rgba(15,23,42,.18)",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            color: "#0f172a",
            fontSize: "1.5rem",
            fontWeight: "700",
            marginBottom: "20px",
          }}
        >
          Delete Job
        </h2>

        <p
          style={{
            color: "#475569",
            lineHeight: "1.8",
            margin: 0,
          }}
        >
          Are you sure you want to delete
          <br />
          <strong style={{ color: "#0f172a" }}>
            {job.title}
          </strong>
          ?
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "15px",
            marginTop: "30px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "12px 20px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#334155",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            style={{
              padding: "12px 20px",
              borderRadius: "10px",
              border: "none",
              background: "#dc2626",
              color: "#ffffff",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}