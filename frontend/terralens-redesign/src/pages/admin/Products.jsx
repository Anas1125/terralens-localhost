import { useEffect, useState } from "react";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/products";

import { uploadFile } from "../../api/media";

export default function Products() {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    tagline: "",
    description: "",
    image: "",
    button: "Request Demo",
    features: [],
    is_active: true,
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      tagline: "",
      description: "",
      image: "",
      button: "Request Demo",
      features: [],
      is_active: true,
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editingId) {
        await updateProduct(editingId, {
          ...form,
          features: JSON.stringify(form.features),
        });

        alert("Product updated successfully!");
      } else {
        await createProduct({
          ...form,
          features: JSON.stringify(form.features),
        });

        alert("Product created successfully!");
      }

      resetForm();
      await loadProducts();
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      tagline: product.tagline || "",
      description: product.description || "",
      image: product.image || "",
      button: product.button || "Request Demo",
      features: product.features
        ? typeof product.features === "string"
          ? JSON.parse(product.features)
          : product.features
        : [],
      is_active: product.is_active ?? true,
    });

    document.querySelector(".admin-main")?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);

      alert("Product deleted successfully!");

      await loadProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product.");
    }
  };

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      product.name?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
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

      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            margin: 0,
            color: "#0f172a",
          }}
        >
          Products
        </h1>

        <p
          style={{
            color: "#64748b",
            marginTop: "8px",
            fontSize: "15px",
          }}
        >
          Create and manage the products displayed on the website.
        </p>
      </div>

      {/* =====================================================
          FORM CARD
      ===================================================== */}

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "20px",
          padding: "30px",
          marginBottom: "35px",
          boxSizing: "border-box",
          boxShadow: "0 8px 30px rgba(15,23,42,0.05)",
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
          {editingId ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* =====================================================
              NAME
          ===================================================== */}

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              Product Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product Name"
              required
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          {/* =====================================================
              TAGLINE
          ===================================================== */}

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              Tagline
            </label>

            <input
              name="tagline"
              value={form.tagline}
              onChange={handleChange}
              placeholder="Advanced Terrain Analysis Suite"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          {/* =====================================================
              DESCRIPTION
          ===================================================== */}

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe this product..."
              rows={5}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                boxSizing: "border-box",
                resize: "vertical",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* =====================================================
              BUTTON TEXT
          ===================================================== */}

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              Button Text
            </label>

            <input
              name="button"
              value={form.button}
              onChange={handleChange}
              placeholder="Request Demo"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          {/* =====================================================
              FEATURES
          ===================================================== */}

          <div style={{ marginBottom: "25px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              Features
            </label>

            <textarea
              value={form.features.join("\n")}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  features: e.target.value
                    .split("\n")
                    .map((feature) => feature.trim())
                    .filter(Boolean),
                }));
              }}
              placeholder={
                "Custom symbology & color palette editor\n" +
                "Layer-based map composition\n" +
                "High-resolution export"
              }
              rows={6}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                boxSizing: "border-box",
                resize: "vertical",
                outline: "none",
                fontFamily: "inherit",
              }}
            />

            <p
              style={{
                marginTop: "8px",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Enter one feature per line.
            </p>
          </div>

          {/* =====================================================
              IMAGE
          ===================================================== */}

          <div style={{ marginBottom: "25px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              Product Image
            </label>

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
                cursor: uploadingImage ? "not-allowed" : "pointer",
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

                    const uploaded = await uploadFile(
                      "products",
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

                    alert("Image upload failed.");
                  } finally {
                    setUploadingImage(false);
                    e.target.value = "";
                  }
                }}
              />
            </label>

            {form.image && (
              <div style={{ marginTop: "15px" }}>
                <img
                  src={
                    form.image.startsWith("http")
                      ? form.image
                      : `${import.meta.env.VITE_API_URL}${form.image}`
                  }
                  alt="Product preview"
                  style={{
                    width: "220px",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                />
              </div>
            )}
          </div>

          {/* =====================================================
              ACTIVE
          ===================================================== */}

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

          {/* =====================================================
              BUTTONS
          ===================================================== */}

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "13px 22px",
                borderRadius: "10px",
                border: "none",
                background: "#0ea5e9",
                color: "#ffffff",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Product"
                : "Create Product"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: "13px 22px",
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
            )}
          </div>
        </form>
      </div>

      {/* =====================================================
          EXISTING PRODUCTS
      ===================================================== */}

      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          padding: "30px",
          border: "1px solid #e2e8f0",
          boxSizing: "border-box",
          boxShadow: "0 8px 30px rgba(15,23,42,0.05)",
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
            Existing Products
          </h2>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            style={{
              width: "320px",
              maxWidth: "100%",
              padding: "12px 16px",
              borderRadius: "10px",
              background: "#ffffff",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {filteredProducts.length === 0 ? (
          <p
            style={{
              color: "#64748b",
              margin: 0,
            }}
          >
            No products found.
          </p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "20px",
                  padding: "20px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "14px",
                  boxSizing: "border-box",
                  flexWrap: "wrap",
                }}
              >
                {/* Product Info */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "18px",
                    minWidth: 0,
                  }}
                >
                  {product.image && (
                    <img
                      src={
                        product.image.startsWith("http")
                          ? product.image
                          : `${import.meta.env.VITE_API_URL}${product.image}`
                      }
                      alt={product.name}
                      style={{
                        width: "80px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        flexShrink: 0,
                      }}
                    />
                  )}

                  <div>
                    <h3
                      style={{
                        margin: 0,
                        marginBottom: "6px",
                        color: "#0f172a",
                        fontSize: "16px",
                        fontWeight: "700",
                      }}
                    >
                      {product.name}
                    </h3>

                    <span
                      style={{
                        display: "inline-block",
                        marginTop: "8px",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: product.is_active
                          ? "#16a34a"
                          : "#dc2626",
                      }}
                    >
                      {product.is_active
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
                    onClick={() => handleEdit(product)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: "8px",
                      border: "1px solid #bae6fd",
                      background: "#f0f9ff",
                      color: "#0284c7",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: "8px",
                      border: "1px solid #fecaca",
                      background: "#fef2f2",
                      color: "#dc2626",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}