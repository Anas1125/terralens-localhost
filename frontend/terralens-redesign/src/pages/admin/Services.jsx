import { useEffect, useState } from "react";
import { uploadFile } from "../../api/media";

import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../../api/services";

export default function Services() {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "",
    description: "",
    features: "",
    image: "",
    is_active: true,
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error("Failed to load services:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      category: "",
      description: "",
      features: "",
      image: "",
      is_active: true,
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const serviceData = {
        ...form,
        features: form.features
          .split("\n")
          .map((feature) => feature.trim())
          .filter(Boolean),
      };

      if (editingId) {
        await updateService(editingId, serviceData);
        alert("Service updated successfully!");
      } else {
        await createService(serviceData);
        alert("Service created successfully!");
      }

      resetForm();
      await loadServices();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setForm({
      name: service.name || "",
      slug: service.slug || "",
      category: service.category || "",
      description: service.description || "",
      features: Array.isArray(service.features)
        ? service.features.join("\n")
        : service.features || "",
      image: service.image || "",
      is_active: service.is_active,
    });

    setEditingId(service.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) return;

    try {
      await deleteService(id);

      alert("Service deleted successfully!");

      await loadServices();
    } catch (error) {
      console.error(error);
      alert("Failed to delete service.");
    }
  };

  const filteredServices = services.filter((service) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      service.name?.toLowerCase().includes(query) ||
      service.slug?.toLowerCase().includes(query) ||
      service.category?.toLowerCase().includes(query) ||
      service.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div
      style={{
        width: "100%",
        color: "#0f172a",
        boxSizing: "border-box",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        style={{
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            margin: 0,
            color: "#0f172a",
          }}
        >
          Services
        </h1>

        <p
          style={{
            color: "#64748b",
            marginTop: "8px",
            marginBottom: 0,
            fontSize: "15px",
          }}
        >
          Create and manage the services displayed on
          the website.
        </p>
      </div>

      {/* =====================================================
          FORM
      ===================================================== */}

      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          padding: "30px",
          marginBottom: "35px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 8px 30px rgba(15,23,42,0.05)",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#0f172a",
            margin: "0 0 25px",
          }}
        >
          {editingId
            ? "Edit Service"
            : "Add Service"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Service Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="GIS Solutions"
              required
              style={inputStyle}
            />
          </div>

          {/* Slug */}

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Slug
            </label>

            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="gis-solutions"
              required
              style={inputStyle}
            />
          </div>

          {/* Category */}

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">
                Select a category
              </option>

              <option value="survey">
                Survey
              </option>

              <option value="gis">
                GIS Services
              </option>

              <option value="it">
                IT Services
              </option>

              <option value="consultancy">
                Consultancy
              </option>
            </select>
          </div>

          {/* Description */}

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe this service..."
              rows={5}
              style={textareaStyle}
            />
          </div>

          {/* Features */}

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Features
            </label>

            <textarea
              name="features"
              value={form.features}
              onChange={handleChange}
              placeholder={"Enter one feature per line..."}
              rows={6}
              style={textareaStyle}
            />
          </div>

          {/* Image */}

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Service Image
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                flexWrap: "wrap",
              }}
            >
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "14px 20px",
                  borderRadius: "10px",
                  border: "1px solid #38bdf8",
                  background: "#eff6ff",
                  color: "#0284c7",
                  cursor: uploadingImage
                    ? "not-allowed"
                    : "pointer",
                  fontWeight: "600",
                }}
              >
                {uploadingImage
                  ? "Uploading..."
                  : form.image
                  ? "Change Image"
                  : "Choose Image"}

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={uploadingImage}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];

                    if (!file) return;

                    try {
                      setUploadingImage(true);

                      const uploaded =
                        await uploadFile(
                          "services",
                          file
                        );

                      setForm((prev) => ({
                        ...prev,
                        image: uploaded.path,
                      }));
                    } catch (error) {
                      console.error(
                        "Image upload failed:",
                        error
                      );

                      alert(
                        "Image upload failed."
                      );
                    } finally {
                      setUploadingImage(false);

                      e.target.value = "";
                    }
                  }}
                />
              </label>

              {form.image && (
                <img
                  src={
                    form.image.startsWith("http")
                      ? form.image
                      : `${import.meta.env.VITE_API_URL}${form.image}`
                  }
                  alt="Selected service"
                  style={{
                    width: "90px",
                    height: "70px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    border:
                      "1px solid #e2e8f0",
                  }}
                />
              )}
            </div>

            {form.image && (
              <p
                style={{
                  marginTop: "8px",
                  color: "#16a34a",
                  fontSize: "13px",
                }}
              >
                Image uploaded successfully
              </p>
            )}
          </div>

          {/* Active */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "25px",
            }}
          >
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              style={{
                width: "17px",
                height: "17px",
                accentColor: "#0ea5e9",
              }}
            />

            <label
              style={{
                color: "#334155",
                fontWeight: "600",
              }}
            >
              Active
            </label>
          </div>

          {/* Buttons */}

          <div
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                ...primaryButtonStyle,
                opacity: loading ? 0.7 : 1,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Service"
                : "Create Service"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                style={secondaryButtonStyle}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* =====================================================
          SERVICES LIST
      ===================================================== */}

      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          padding: "30px",
          border: "1px solid #e2e8f0",
          boxShadow:
            "0 8px 30px rgba(15,23,42,0.05)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "25px",
            flexWrap: "wrap",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#0f172a",
              margin: 0,
            }}
          >
            Existing Services
          </h2>

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search services..."
            style={{
              width: "320px",
              maxWidth: "100%",
              padding: "12px 16px",
              borderRadius: "10px",
              background: "#ffffff",
              color: "#0f172a",
              border:
                "1px solid #cbd5e1",
              outline: "none",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {filteredServices.length === 0 ? (
          <p
            style={{
              color: "#64748b",
              margin: 0,
            }}
          >
            No services created yet.
          </p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            {filteredServices.map(
              (service) => (
                <div
                  key={service.id}
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    gap: "20px",
                    padding: "20px",
                    background: "#f8fafc",
                    border:
                      "1px solid #e2e8f0",
                    borderRadius: "14px",
                    flexWrap: "wrap",
                    boxSizing: "border-box",
                  }}
                >
                  {/* Service Info */}

                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: "18px",
                      minWidth: 0,
                    }}
                  >
                    {service.image && (
                      <img
                        src={
                          service.image.startsWith(
                            "http"
                          )
                            ? service.image
                            : `${import.meta.env.VITE_API_URL}${service.image}`
                        }
                        alt={service.name}
                        style={{
                          width: "80px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border:
                            "1px solid #e2e8f0",
                          flexShrink: 0,
                        }}
                      />
                    )}

                    <div>
                      <h3
                        style={{
                          margin: 0,
                          marginBottom:
                            "6px",
                          color:
                            "#0f172a",
                          fontSize:
                            "16px",
                          fontWeight:
                            "700",
                        }}
                      >
                        {service.name}
                      </h3>

                      <p
                        style={{
                          margin: 0,
                          color:
                            "#64748b",
                          fontSize:
                            "14px",
                        }}
                      >
                        /{service.slug} ·{" "}
                        {service.category}
                      </p>

                      <span
                        style={{
                          display:
                            "inline-block",
                          marginTop:
                            "8px",
                          fontSize:
                            "12px",
                          fontWeight:
                            "600",
                          color:
                            service.is_active
                              ? "#16a34a"
                              : "#dc2626",
                        }}
                      >
                        {service.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <button
                      onClick={() =>
                        handleEdit(
                          service
                        )
                      }
                      style={
                        editButtonStyle
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          service.id
                        )
                      }
                      style={
                        deleteButtonStyle
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   STYLES
========================================================= */

const fieldStyle = {
  marginBottom: "20px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#334155",
  fontSize: "14px",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px",
  borderRadius: "10px",
  background: "#ffffff",
  color: "#0f172a",
  border: "1px solid #cbd5e1",
  outline: "none",
  fontSize: "15px",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  fontFamily: "inherit",
};

const primaryButtonStyle = {
  padding: "13px 22px",
  background: "#0ea5e9",
  color: "#ffffff",
  border: "none",
  borderRadius: "10px",
  fontWeight: "600",
};

const secondaryButtonStyle = {
  padding: "13px 22px",
  background: "#ffffff",
  color: "#334155",
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
};

const editButtonStyle = {
  padding: "10px 16px",
  background: "#eff6ff",
  color: "#0284c7",
  border: "1px solid #bae6fd",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const deleteButtonStyle = {
  padding: "10px 16px",
  background: "#fef2f2",
  color: "#dc2626",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};