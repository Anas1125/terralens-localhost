import { useState } from "react";
import { createJob } from "../../../api/jobs";
import { useToast } from "../../admin/ToastProvider";

export default function AddJobModal({
  open,
  onClose,
  onSuccess,
}) {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    title: "",
    department: "",
    location: "",
    employment_type: "",
    description: "",
    requirements: "",
    is_active: true,
  });

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createJob(form);

      showToast("Job created successfully!", "success");
      
      onSuccess();
      onClose();

      setForm({
        title: "",
        department: "",
        location: "",
        employment_type: "",
        description: "",
        requirements: "",
        is_active: true,
      });
    } catch (err) {
      console.error(err);
      showToast("Failed to create job.", "error");
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
            fontSize: "1.6rem",
            fontWeight: "700",
            marginBottom: "25px",
          }}
        >
          Add Job
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
            placeholder={placeholder}
            value={form[name]}
            onChange={handleChange}
            style={{
              width: "100%",
              marginBottom: "15px",
              padding: "14px",
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
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          style={{
            width: "100%",
            marginBottom: "15px",
            padding: "14px",
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
          name="requirements"
          placeholder="Requirements"
          value={form.requirements}
          onChange={handleChange}
          rows={4}
          style={{
            width: "100%",
            marginBottom: "25px",
            padding: "14px",
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
            Save Job
          </button>
        </div>
      </form>
    </div>
  );
}