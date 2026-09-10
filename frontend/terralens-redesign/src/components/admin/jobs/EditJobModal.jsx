import { useEffect, useState } from "react";
import { updateJob } from "../../../api/jobs";
import { useToast } from "../../admin/ToastProvider";

export default function EditJobModal({
  open,
  onClose,
  job,
  onSuccess,
}) {
  const { showToast } = useToast();
  const [form, setForm] = useState({});

  useEffect(() => {
    if (job) {
      setForm(job);
    }
  }, [job]);

  if (!open || !job) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateJob(job.id, form);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      showToast("Failed to update job.", "error");
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
      <form
        onSubmit={handleSubmit}
        style={{
          width: "700px",
          maxWidth: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#ffffff",
          padding: "35px",
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 25px 60px rgba(15,23,42,.18)",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            color: "#0f172a",
            fontSize: "1.6rem",
            fontWeight: "700",
            marginBottom: "25px",
          }}
        >
          Edit Job
        </h2>

        {[
          ["title", "Job Title"],
          ["department", "Department"],
          ["location", "Location"],
          ["employment_type", "Employment Type"],
        ].map(([name, placeholder]) => (
          <input
            key={name}
            name={name}
            value={form[name] || ""}
            placeholder={placeholder}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "15px",
              borderRadius: "10px",
              background: "#f8fafc",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              outline: "none",
              boxSizing: "border-box",
              fontSize: "15px",
            }}
          />
        ))}

        <textarea
          rows={4}
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          placeholder="Description"
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "15px",
            borderRadius: "10px",
            background: "#f8fafc",
            color: "#0f172a",
            border: "1px solid #cbd5e1",
            outline: "none",
            boxSizing: "border-box",
            fontSize: "15px",
            resize: "vertical",
          }}
        />

        <textarea
          rows={4}
          name="requirements"
          value={form.requirements || ""}
          onChange={handleChange}
          placeholder="Requirements"
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "25px",
            borderRadius: "10px",
            background: "#f8fafc",
            color: "#0f172a",
            border: "1px solid #cbd5e1",
            outline: "none",
            boxSizing: "border-box",
            fontSize: "15px",
            resize: "vertical",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "15px",
          }}
        >
          <button
            type="button"
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
            type="submit"
            style={{
              padding: "12px 24px",
              borderRadius: "10px",
              border: "none",
              background: "#0284c7",
              color: "#ffffff",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}