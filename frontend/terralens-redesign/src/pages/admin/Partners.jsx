import { useEffect, useState } from "react";
import api from "../../api/client";
import {
  Plus,
  Trash2,
  Edit,
  Upload,
} from "lucide-react";

import {
  getPartners,
  createPartner,
  updatePartner,
  deletePartner,
} from "../../api/partners";
import { useToast } from "../../components/admin/ToastProvider";

export default function Partners() {
  const { showToast } = useToast();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    logo: "",
    type: "client",
    is_active: true,
  });

  const loadPartners = async () => {
    try {
      setLoading(true);

      const data = await getPartners();

      console.log("PARTNERS:", data);

      setPartners(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("FAILED TO LOAD PARTNERS:", error);
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      logo: "",
      type: "client",
      is_active: true,
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await updatePartner(editingId, form);
      } else {
        await createPartner(form);
      }

      await loadPartners();
      resetForm();
    } catch (error) {
      console.error("Failed to save partner:", error);
      showToast("Failed to save.", "error");
    }
  };

  const handleEdit = (partner) => {
    setForm({
      name: partner.name,
      logo: partner.logo || "",
      type: partner.type,
      is_active: partner.is_active,
    });

    setEditingId(partner.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this?"
      )
    ) {
      return;
    }

    try {
      await deletePartner(id);
      await loadPartners();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        width: "100%",
        boxSizing: "border-box",
        color: "#0f172a",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          gap: "20px",
        }}
      >
        <div>
          <h1
            style={{
              color: "#0f172a",
              margin: 0,
              fontSize: "2rem",
              fontWeight: "700",
            }}
          >
            Clients & Partners
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: "8px",
            }}
          >
            Manage the logos displayed on the About page.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
            borderRadius: "10px",
            border: "none",
            background: "#0ea5e9",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
            boxShadow: "0 8px 20px rgba(14,165,233,.18)",
          }}
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      {/* Form */}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "30px",
            boxShadow: "0 10px 30px rgba(15,23,42,.06)",
          }}
        >
          <h2
            style={{
              color: "#0f172a",
              marginTop: 0,
              marginBottom: "24px",
              fontSize: "1.4rem",
            }}
          >
            {editingId
              ? "Edit"
              : "Add Client / Partner"}
          </h2>

          {/* Name */}

          <input
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            placeholder="Name"
            required
            style={inputStyle}
          />

          {/* Type */}

          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value,
              })
            }
            style={inputStyle}
          >
            <option value="client">
              Client
            </option>

            <option value="partner">
              Partner
            </option>
          </select>

          {/* Logo */}

          <label
            style={{
              display: "block",
              color: "#334155",
              fontSize: "0.9rem",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Logo
          </label>

          <label
            htmlFor="partner-logo"
            style={{
              width: "100%",
              minHeight: "110px",
              borderRadius: "14px",
              border: "1px dashed #7dd3fc",
              background: "#f8fafc",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: uploading
                ? "not-allowed"
                : "pointer",
              boxSizing: "border-box",
              marginBottom: "14px",
            }}
          >
            <Upload
              size={26}
              style={{
                color: "#0ea5e9",
                marginBottom: "8px",
              }}
            />

            <span
              style={{
                color: "#0284c7",
                fontWeight: "600",
              }}
            >
              {uploading
                ? "Uploading..."
                : form.logo
                ? "Logo uploaded"
                : "Click to choose logo"}
            </span>

            <span
              style={{
                color: "#94a3b8",
                fontSize: "0.8rem",
                marginTop: "5px",
              }}
            >
              PNG, JPG, JPEG or SVG
            </span>
          </label>

          <input
            id="partner-logo"
            type="file"
            accept=".png,.jpg,.jpeg,.svg"
            disabled={uploading}
            style={{ display: "none" }}
            onChange={async (event) => {
              const file = event.target.files?.[0];

              if (!file) return;

              try {
                setUploading(true);

                const formData = new FormData();
                formData.append("file", file);

                const response = await api.post(
                  "/media/upload/partners",
                  formData
                );

                setForm((previous) => ({
                  ...previous,
                  logo: response.data.path,
                }));
              } catch (error) {
                console.error(
                  "Logo upload failed:",
                  error
                );

                showToast("Failed to upload logo.", "error");
              } finally {
                setUploading(false);
              }
            }}
          />

          {/* Logo Preview */}

          {form.logo && (
            <div
              style={{
                marginBottom: "18px",
                padding: "14px",
                borderRadius: "12px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <img
                src={
                  form.logo.startsWith("http")
                    ? form.logo
                    : `${import.meta.env.VITE_API_URL}${form.logo}`
                }
                alt="Logo preview"
                style={{
                  maxWidth: "180px",
                  maxHeight: "80px",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </div>
          )}

          {/* Buttons */}

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <button
              type="submit"
              style={saveButton}
            >
              {editingId
                ? "Update"
                : "Create"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              style={cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* List */}

      {loading ? (
        <p
          style={{
            color: "#64748b",
          }}
        >
          Loading...
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {partners.map((partner) => (
            <div
              key={partner.id}
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "20px",
                padding: "24px",
                boxShadow:
                  "0 8px 25px rgba(15,23,42,.05)",
              }}
            >
              {/* Logo */}

              <div
                style={{
                  height: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "18px",
                  borderRadius: "14px",
                  background: "#f8fafc",
                  border: "1px solid #f1f5f9",
                }}
              >
                {partner.logo ? (
                  <img
                    src={
                      partner.logo?.startsWith("http")
                        ? partner.logo
                        : `${import.meta.env.VITE_API_URL}${partner.logo}`
                    }
                    alt={partner.name}
                    style={{
                      maxWidth: "160px",
                      maxHeight: "80px",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      color: "#94a3b8",
                    }}
                  >
                    No logo
                  </span>
                )}
              </div>

              {/* Name */}

              <h3
                style={{
                  color: "#0f172a",
                  margin: 0,
                  fontSize: "1.1rem",
                  fontWeight: "700",
                }}
              >
                {partner.name}
              </h3>

              {/* Type */}

              <p
                style={{
                  color: "#0284c7",
                  textTransform: "capitalize",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                }}
              >
                {partner.type}
              </p>

              {/* Buttons */}

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                }}
              >
                <button
                  onClick={() =>
                    handleEdit(partner)
                  }
                  style={smallButton}
                >
                  <Edit size={15} />
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(partner.id)
                  }
                  style={{
                    ...smallButton,
                    color: "#dc2626",
                    border: "1px solid #fecaca",
                    background: "#fef2f2",
                  }}
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "14px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  boxSizing: "border-box",
  outline: "none",
  fontSize: "15px",
};

const saveButton = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "10px",
  background: "#0ea5e9",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
  boxShadow: "0 6px 16px rgba(14,165,233,.2)",
};

const cancelButton = {
  padding: "12px 20px",
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  background: "#ffffff",
  color: "#475569",
  cursor: "pointer",
  fontWeight: "600",
};

const smallButton = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#334155",
  cursor: "pointer",
  fontWeight: "500",
};