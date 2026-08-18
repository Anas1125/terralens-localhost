import { useEffect, useState } from "react";
import { Download, Trash2, Eye } from "lucide-react";
import {
  getApplications,
  deleteApplication,
} from "../../api/applications";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadApplications = async () => {
    try {
      setLoading(true);

      const data = await getApplications();
      setApplications(data);
    } catch (error) {
      console.error(
        "Failed to load applications:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteApplication(id);

      setApplications((previous) =>
        previous.filter(
          (application) =>
            application.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete application:",
        error
      );

      alert("Failed to delete application.");
    }
  };

  const getResumeUrl = (resume) => {
    if (!resume) {
      return null;
    }

    if (
      resume.startsWith("http://") ||
      resume.startsWith("https://")
    ) {
      return resume;
    }

    return `${import.meta.env.VITE_API_URL}${resume}`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          color: "#64748b",
          padding: "32px",
          boxSizing: "border-box",
        }}
      >
        Loading applications...
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        padding: "0",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}

      <div
        style={{
          marginBottom: "32px",
        }}
      >
        <h1
          style={{
            color: "#0f172a",
            fontSize: "2rem",
            fontWeight: "700",
            margin: 0,
            letterSpacing: "-0.025em",
          }}
        >
          Applications
        </h1>

        <p
          style={{
            color: "#64748b",
            marginTop: "8px",
            marginBottom: 0,
          }}
        >
          Manage job applications submitted
          through the website.
        </p>
      </div>

      {/* Empty State */}

      {applications.length === 0 ? (
        <div
          style={{
            border: "1px solid #e2e8f0",
            background: "#ffffff",
            borderRadius: "20px",
            padding: "60px 30px",
            textAlign: "center",
            boxShadow:
              "0 8px 30px rgba(15,23,42,0.05)",
            boxSizing: "border-box",
          }}
        >
          <h2
            style={{
              color: "#0f172a",
              margin: 0,
              fontSize: "1.4rem",
              fontWeight: "700",
            }}
          >
            No Applications Yet
          </h2>

          <p
            style={{
              color: "#64748b",
              marginTop: "10px",
              marginBottom: 0,
            }}
          >
            Applications submitted through the
            Careers page will appear here.
          </p>
        </div>
      ) : (
        /* Applications Table */

        <div
          style={{
            width: "100%",
            overflowX: "auto",
            overflowY: "hidden",
            WebkitOverflowScrolling: "touch",
            border: "1px solid #e2e8f0",
            borderRadius: "20px",
            background: "#ffffff",
            boxShadow:
              "0 8px 30px rgba(15,23,42,0.05)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "1000px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                  borderBottom:
                    "1px solid #e2e8f0",
                }}
              >
                <th style={headerStyle}>
                  Applicant
                </th>

                <th style={headerStyle}>
                  Applied For
                </th>

                <th style={headerStyle}>
                  Email
                </th>

                <th style={headerStyle}>
                  Phone
                </th>

                <th style={headerStyle}>
                  Resume
                </th>

                <th style={headerStyle}>
                  Date
                </th>

                <th style={headerStyle}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {applications.map(
                (application) => {
                  const resumeUrl =
                    getResumeUrl(
                      application.resume
                    );

                  return (
                    <tr
                      key={application.id}
                      style={{
                        borderTop:
                          "1px solid #f1f5f9",
                      }}
                    >
                      {/* Applicant */}

                      <td style={cellStyle}>
                        <span
                          style={{
                            color: "#0f172a",
                            fontWeight: "600",
                          }}
                        >
                          {
                            application.full_name
                          }
                        </span>
                      </td>

                      {/* Job */}

                      <td style={cellStyle}>
                        <span
                          style={{
                            color: "#0284c7",
                            fontWeight: "600",
                          }}
                        >
                          {application.job_title ||
                            `Job #${application.job_id}`}
                        </span>
                      </td>

                      {/* Email */}

                      <td style={cellStyle}>
                        {application.email}
                      </td>

                      {/* Phone */}

                      <td style={cellStyle}>
                        {application.phone ||
                          "—"}
                      </td>

                      {/* Resume */}

                      <td style={cellStyle}>
                        {resumeUrl ? (
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                            }}
                          >
                            <a
                              href={resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={
                                actionButtonStyle
                              }
                            >
                              <Eye size={15} />
                              View
                            </a>

                            <a
                              href={resumeUrl}
                              download
                              style={
                                downloadButtonStyle
                              }
                            >
                              <Download
                                size={15}
                              />
                              Download
                            </a>
                          </div>
                        ) : (
                          <span
                            style={{
                              color: "#94a3b8",
                            }}
                          >
                            No resume
                          </span>
                        )}
                      </td>

                      {/* Date */}

                      <td style={cellStyle}>
                        {formatDate(
                          application.created_at
                        )}
                      </td>

                      {/* Delete */}

                      <td style={cellStyle}>
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              application.id
                            )
                          }
                          style={
                            deleteButtonStyle
                          }
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* =========================
   STYLES
========================= */

const headerStyle = {
  textAlign: "left",
  padding: "18px 20px",
  color: "#64748b",
  fontSize: "0.8rem",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  whiteSpace: "nowrap",
};

const cellStyle = {
  padding: "18px 20px",
  color: "#475569",
  fontSize: "0.9rem",
  whiteSpace: "nowrap",
};

const actionButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 12px",
  borderRadius: "8px",
  background: "#f1f5f9",
  color: "#334155",
  border: "1px solid #e2e8f0",
  textDecoration: "none",
  fontSize: "0.8rem",
  fontWeight: "600",
};

const downloadButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 12px",
  borderRadius: "8px",
  background: "#0ea5e9",
  color: "#ffffff",
  border: "1px solid #0ea5e9",
  textDecoration: "none",
  fontSize: "0.8rem",
  fontWeight: "600",
};

const deleteButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 12px",
  borderRadius: "8px",
  background: "#fef2f2",
  color: "#dc2626",
  border: "1px solid #fecaca",
  cursor: "pointer",
  fontSize: "0.8rem",
  fontWeight: "600",
};