import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";

import { getJobs } from "../../api/jobs";
import { createApplication } from "../../api/applications";

export default function CurrentOpenings() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    resume: null,
    cover_letter: "",
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (error) {
      console.error("Failed to load jobs:", error);
    }
  };

  const handleApply = (job) => {
    setSelectedJob(job);

    setForm({
      full_name: "",
      email: "",
      phone: "",
      resume: null,
      cover_letter: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedJob) {
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("job_id", selectedJob.id);
      formData.append("full_name", form.full_name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("cover_letter", form.cover_letter);

      if (form.resume) {
        formData.append("resume", form.resume);
      }

      await createApplication(formData);

      alert("Application submitted successfully!");

      setSelectedJob(null);

      setForm({
        full_name: "",
        email: "",
        phone: "",
        resume: null,
        cover_letter: "",
      });
    } catch (error) {
      console.error(
        "Failed to submit application:",
        error
      );

      alert(
        error?.response?.data?.detail ||
          "Failed to submit application."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* =========================
          CURRENT OPENINGS
      ========================== */}

      <section
        style={{
          backgroundColor: "#ffffff",
          padding: "96px 0",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          {/* Header */}

          <div
            style={{
              textAlign: "center",
              marginBottom: "64px",
              maxWidth: "42rem",
            }}
          >
            <p
              style={{
                textTransform: "uppercase",
                letterSpacing: "5px",
                color: "#0ea5e9",
                fontSize: "0.75rem",
                fontWeight: "700",
                marginBottom: "12px",
              }}
            >
              CURRENT OPENINGS
            </p>

            <h2
              style={{
                fontSize:
                  "clamp(2rem, 3vw, 2.75rem)",
                fontWeight: "800",
                color: "#0f172a",
                letterSpacing: "-0.025em",
                marginBottom: "16px",
                lineHeight: "1.2",
              }}
            >
              Join Our Team
            </h2>

            <p
              style={{
                fontSize: "1rem",
                color: "#64748b",
                lineHeight: "1.6",
              }}
            >
              {jobs.length === 0
                ? "We're always looking for passionate people. At the moment, there are no active openings, but exciting opportunities will be posted here soon."
                : `We're currently hiring for ${
                    jobs.length
                  } open ${
                    jobs.length === 1
                      ? "position"
                      : "positions"
                  }. Explore the opportunities below and become part of the TerraLens team.`}
            </p>
          </div>

          {/* Empty State */}

          {jobs.length === 0 ? (
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
              }}
              style={{
                width: "100%",
                maxWidth: "64rem",
                borderRadius: "32px",
                border:
                  "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
                padding: "64px 32px",
                textAlign: "center",
                boxSizing: "border-box",
                boxShadow:
                  "0 20px 60px rgba(15,23,42,0.06)",
              }}
            >
              <BriefcaseBusiness
                size={42}
                style={{
                  color: "#0ea5e9",
                }}
              />

              <h3
                style={{
                  color: "#0f172a",
                  marginTop: "24px",
                  fontSize: "2rem",
                  fontWeight: "700",
                }}
              >
                No Open Positions
              </h3>

              <p
                style={{
                  color: "#64748b",
                  marginTop: "18px",
                }}
              >
                New openings will appear here
                automatically.
              </p>
            </motion.div>
          ) : (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              {jobs.map((job) => (
                <motion.div
                  key={job.id}
                  whileHover={{
                    y: -4,
                  }}
                  style={{
                    border:
                      "1px solid #e2e8f0",
                    background: "#ffffff",
                    borderRadius: "24px",
                    padding: "32px",
                    boxShadow:
                      "0 12px 40px rgba(15,23,42,0.06)",
                  }}
                >
                  {/* Job title */}

                  <h3
                    style={{
                      color: "#0f172a",
                      fontSize: "1.6rem",
                      fontWeight: "700",
                      margin: 0,
                    }}
                  >
                    {job.title}
                  </h3>

                  {/* Department */}

                  <p
                    style={{
                      color: "#0ea5e9",
                      marginTop: "10px",
                    }}
                  >
                    {job.department}
                  </p>

                  {/* Job information */}

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "20px",
                      marginTop: "18px",
                      color: "#64748b",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <MapPin size={16} />

                      {job.location}
                    </span>

                    <span>
                      {job.employment_type}
                    </span>
                  </div>

                  {/* Description */}

                  <p
                    style={{
                      marginTop: "24px",
                      color: "#475569",
                      lineHeight: "1.8",
                    }}
                  >
                    {job.description}
                  </p>

                  {/* Apply */}

                  <button
                    type="button"
                    onClick={() =>
                      handleApply(job)
                    }
                    style={{
                      marginTop: "28px",
                      padding: "14px 28px",
                      borderRadius: "999px",
                      background: "#0ea5e9",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Apply Now
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================
          APPLICATION MODAL
      ========================== */}

      {selectedJob && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background:
              "rgba(15, 23, 42, 0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "650px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#ffffff",
              border:
                "1px solid #e2e8f0",
              borderRadius: "24px",
              padding: "32px",
              boxSizing: "border-box",
              boxShadow:
                "0 30px 80px rgba(15,23,42,0.18)",
            }}
          >
            {/* Modal Header */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "flex-start",
                gap: "20px",
                marginBottom: "28px",
              }}
            >
              <div>
                <h2
                  style={{
                    color: "#0f172a",
                    margin: 0,
                    fontSize: "1.8rem",
                    lineHeight: "1.3",
                  }}
                >
                  Apply for{" "}
                  {selectedJob.title}
                </h2>

                <p
                  style={{
                    color: "#0ea5e9",
                    marginTop: "8px",
                  }}
                >
                  {selectedJob.department}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedJob(null)
                }
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#64748b",
                  fontSize: "28px",
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {/* Application Form */}

            <form onSubmit={handleSubmit}>
              {/* Full Name */}

              <label style={labelStyle}>
                Full Name
              </label>

              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                style={inputStyle}
              />

              {/* Email */}

              <label style={labelStyle}>
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                style={inputStyle}
              />

              {/* Phone */}

              <label style={labelStyle}>
                Phone
              </label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={(event) => {
                  const value = event.target.value.replace(/\D/g, "");

                  setForm((previous) => ({
                    ...previous,
                    phone: value,
                  }));
                }}
                placeholder="Enter your phone number"
                inputMode="numeric"
                pattern="[0-9]*"
                style={inputStyle}
              />

              {/* Resume */}

              <label style={labelStyle}>
                Resume
              </label>

              <label
                htmlFor="resume-upload"
                style={{
                  width: "100%",
                  minHeight: "110px",
                  borderRadius: "14px",
                  border:
                    "1px dashed rgba(14,165,233,0.45)",
                  background: "#f8fafc",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxSizing: "border-box",
                  marginBottom: "18px",
                  transition:
                    "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    marginBottom: "8px",
                  }}
                >
                  📄
                </div>

                <span
                  style={{
                    color: "#0ea5e9",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                  }}
                >
                  {form.resume
                    ? form.resume.name
                    : "Click to upload your resume"}
                </span>

                <span
                  style={{
                    color: "#64748b",
                    fontSize: "0.8rem",
                    marginTop: "5px",
                  }}
                >
                  PDF, PNG, JPG or JPEG
                </span>
              </label>

              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(event) => {
                  setForm((previous) => ({
                    ...previous,
                    resume:
                      event.target.files?.[0] ||
                      null,
                  }));
                }}
                style={{
                  display: "none",
                }}
              />

              {/* Cover Letter */}

              <label style={labelStyle}>
                Cover Letter
              </label>

              <textarea
                name="cover_letter"
                value={form.cover_letter}
                onChange={handleChange}
                placeholder="Tell us why you're a good fit..."
                rows={7}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: "150px",
                }}
              />

              {/* Submit */}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "999px",
                  background: submitting
                    ? "#94a3b8"
                    : "#0ea5e9",
                  color: "white",
                  border: "none",
                  cursor: submitting
                    ? "not-allowed"
                    : "pointer",
                  fontWeight: "700",
                  fontSize: "1rem",
                  marginTop: "8px",
                }}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================
   FORM STYLES
========================= */

const labelStyle = {
  display: "block",
  color: "#334155",
  fontSize: "0.9rem",
  fontWeight: "600",
  marginBottom: "8px",
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  marginBottom: "18px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  boxSizing: "border-box",
  outline: "none",
  fontSize: "0.95rem",
};