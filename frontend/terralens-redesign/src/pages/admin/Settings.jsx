import { useEffect, useState } from "react";

import PageHeader from "../../components/admin/common/PageHeader";
import FileUploader from "../../components/admin/common/FileUploader";

import {
  getSettings,
  updateSettings,
} from "../../api/settings";

export default function Settings() {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  // =====================================================
  // LOAD SETTINGS
  // =====================================================

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSettings();
      setForm(data);
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const handleSave = async () => {
    try {
      setSaving(true);

      const updated = await updateSettings(form);

      setForm(updated);

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // MEDIA URL
  // =====================================================

  const getMediaUrl = (path) => {
    if (!path) return "";

    if (path.startsWith("http")) {
      return path;
    }

    return `${import.meta.env.VITE_API_URL}${path}`;
  };

  // =====================================================
  // UPDATE MEDIA FIELD
  // =====================================================

  const updateMediaField = (field, file) => {
    setForm((prev) => ({
      ...prev,
      [field]: file.path,
    }));
  };

  // =====================================================
  // REMOVE MEDIA FIELD (single-value fields like logo,
  // favicon, hero_video, statement_image, and each page's
  // background video)
  // =====================================================

  const removeMediaField = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: "",
    }));
  };


  const addAboutVideo = (file) => {
    setForm((prev) => ({
      ...prev,
      about_videos: [
        ...(prev.about_videos || []),
        file.path,
      ],
    }));
  };


  const removeAboutVideo = (index) => {
    setForm((prev) => ({
      ...prev,
      about_videos: (prev.about_videos || []).filter(
        (_, i) => i !== index
      ),
    }));
  };

  // =====================================================
  // RENDER HELPER: single-video field with change + remove
  // =====================================================

  const renderSingleVideoField = (field, folder, label) => (
    <div style={videoFieldStyle}>

      <label style={labelStyle}>
        {label}
      </label>

      <p style={selectedVideoStyle}>
        {form[field] || "No video selected"}
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >

        <FileUploader
          folder={folder}
          label={
            form[field]
              ? "Change Video"
              : "Choose Video"
          }
          accept="video/*"
          onUploaded={(file) =>
            updateMediaField(field, file)
          }
        />

        {form[field] && (
          <button
            type="button"
            onClick={() => removeMediaField(field)}
            style={removeButtonStyle}
          >
            Remove
          </button>
        )}

      </div>

    </div>
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div>

      <PageHeader
        title="Website Settings"
        subtitle="Manage your TerraLens website."
      />

      {/* =====================================================
          COMPANY INFORMATION
      ===================================================== */}

      <section style={sectionStyle}>

        <h2 style={sectionTitle}>
          Company Information
        </h2>

        <p style={sectionDescription}>
          Basic information about TerraLens Innovations.
        </p>

        <div style={gridStyle}>

          <div>
            <label style={labelStyle}>
              Company Name
            </label>

            <input
              name="company_name"
              value={form.company_name || ""}
              onChange={handleChange}
              placeholder="TerraLens Innovations"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              placeholder="info@terralens.com"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              Phone
            </label>

            <input
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
              style={inputStyle}
            />
          </div>


        </div>

        <div style={{ marginTop: "24px" }}>

          <label style={labelStyle}>
            Address
          </label>

          <textarea
            name="address"
            value={form.address || ""}
            onChange={handleChange}
            placeholder="Company address"
            rows={4}
            style={textareaStyle}
          />

        </div>

        <div style={{ marginTop: "24px" }}>

          <label style={labelStyle}>
            Google Maps Link
          </label>

          <input
            name="google_maps"
            value={form.google_maps || ""}
            onChange={handleChange}
            placeholder="Google Maps URL"
            style={inputStyle}
          />

        </div>

      </section>


      {/* =====================================================
          BRANDING
      ===================================================== */}

      <section style={sectionStyle}>

        <h2 style={sectionTitle}>
          Branding
        </h2>

        <p style={sectionDescription}>
          Manage the logo and branding assets used across the website.
        </p>


        {/* LOGO */}

        <div>

          <label style={labelStyle}>
            Website Logo
          </label>

          <div
            style={{
              marginTop: "10px",
              padding: "20px",
              borderRadius: "14px",
              background: "#f8fafc",
              border: "1px solid #cbd5e1",
            }}
          >

            {form.logo && (
              <img
                src={getMediaUrl(form.logo)}
                alt="Website Logo"
                style={{
                  maxWidth: "240px",
                  maxHeight: "100px",
                  objectFit: "contain",
                  display: "block",
                  marginBottom: "20px",
                  borderRadius: "8px",
                }}
              />
            )}

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >

              <FileUploader
                folder="logo"
                label={
                  form.logo
                    ? "Change Logo"
                    : "Choose Logo"
                }
                accept="image/*"
                onUploaded={(file) =>
                  updateMediaField("logo", file)
                }
              />

              {form.logo && (
                <button
                  type="button"
                  onClick={() => removeMediaField("logo")}
                  style={removeButtonStyle}
                >
                  Remove
                </button>
              )}

            </div>

          </div>

        </div>


        {/* FAVICON */}

        <div style={{ marginTop: "28px" }}>

          <label style={labelStyle}>
            Favicon
          </label>

          <div
            style={{
              marginTop: "10px",
              padding: "20px",
              borderRadius: "14px",
              background: "#f8fafc",
              border: "1px solid #cbd5e1",
            }}
          >

            {form.favicon && (
              <img
                src={getMediaUrl(form.favicon)}
                alt="Favicon"
                style={{
                  width: "64px",
                  height: "64px",
                  objectFit: "contain",
                  display: "block",
                  marginBottom: "20px",
                  borderRadius: "8px",
                }}
              />
            )}

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >

              <FileUploader
                folder="logo"
                label={
                  form.favicon
                    ? "Change Favicon"
                    : "Choose Favicon"
                }
                accept="image/*"
                onUploaded={(file) =>
                  updateMediaField("favicon", file)
                }
              />

              {form.favicon && (
                <button
                  type="button"
                  onClick={() => removeMediaField("favicon")}
                  style={removeButtonStyle}
                >
                  Remove
                </button>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          PAGE BACKGROUND VIDEOS
      ===================================================== */}

      <section style={sectionStyle}>

        <h2 style={sectionTitle}>
          Page Background Videos
        </h2>

        <p style={sectionDescription}>
          Upload and manage the background video for each website page.
        </p>


        <div style={gridStyle}>


          {/* ABOUT */}

          <div style={videoFieldStyle}>

            <label style={labelStyle}>
              About Page Videos
            </label>

            <p
              style={{
                color: "#64748b",
                fontSize: "13px",
                marginTop: "6px",
                marginBottom: "16px",
              }}
            >
              Add multiple videos. They will smoothly fade from one
              video to the next on the About page.
            </p>


            {/* SELECTED VIDEOS */}

            {(form.about_videos || []).length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginBottom: "18px",
                }}
              >

                {form.about_videos.map((video, index) => (

                  <div
                    key={`${video}-${index}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      padding: "12px 14px",
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        minWidth: 0,
                      }}
                    >

                      <span
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "8px",
                          background: "#eff6ff",
                          color: "#0284c7",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "700",
                          flexShrink: 0,
                        }}
                      >
                        {index + 1}
                      </span>

                      <span
                        style={{
                          color: "#334155",
                          fontSize: "13px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {video}
                      </span>

                    </div>


                    <button
                      type="button"
                      onClick={() => removeAboutVideo(index)}
                      style={removeButtonStyle}
                    >
                      Remove
                    </button>

                  </div>

                ))}

              </div>
            )}


            {/* NO VIDEOS */}

            {(form.about_videos || []).length === 0 && (
              <p
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                  marginBottom: "16px",
                }}
              >
                No About videos selected.
              </p>
            )}


            {/* ADD VIDEO */}

            <FileUploader
              folder="about"
              label="Add About Video"
              accept="video/*"
              onUploaded={addAboutVideo}
            />

          </div>


          {/* SERVICES */}

          {renderSingleVideoField(
            "services_video",
            "services",
            "Services Page"
          )}


          {/* PRODUCTS */}

          {renderSingleVideoField(
            "products_video",
            "products",
            "Products Page"
          )}


          {/* SHOWCASE */}

          {renderSingleVideoField(
            "showcase_video",
            "showcase",
            "Showcase Page"
          )}


          {/* CAREERS */}

          {renderSingleVideoField(
            "careers_video",
            "careers",
            "Careers Page"
          )}


          {/* CONTACT */}

          {renderSingleVideoField(
            "contact_video",
            "contact",
            "Contact Page"
          )}

        </div>

      </section>

      {/* =====================================================
          HOMEPAGE
      ===================================================== */}

      <section style={sectionStyle}>

        <h2 style={sectionTitle}>
          Homepage
        </h2>

        <p style={sectionDescription}>
          Manage the main content displayed on the homepage.
        </p>

        <div style={gridStyle}>

          <div>
            <label style={labelStyle}>
              Hero Title
            </label>

            <input
              name="hero_title"
              value={form.hero_title || ""}
              onChange={handleChange}
              placeholder="Precision Beyond Boundaries"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              Hero Button Text
            </label>

            <input
              name="hero_button_text"
              value={form.hero_button_text || ""}
              onChange={handleChange}
              placeholder="Explore Our Services"
              style={inputStyle}
            />
          </div>

        </div>


        <div style={{ marginTop: "24px" }}>

          <label style={labelStyle}>
            Hero Subtitle
          </label>

          <textarea
            name="hero_subtitle"
            value={form.hero_subtitle || ""}
            onChange={handleChange}
            placeholder="GIS • AI • Drone Intelligence"
            rows={4}
            style={textareaStyle}
          />

        </div>


        <div style={{ marginTop: "24px" }}>

          <label style={labelStyle}>
            Hero Button Link
          </label>

          <input
            name="hero_button_link"
            value={form.hero_button_link || ""}
            onChange={handleChange}
            placeholder="/services"
            style={inputStyle}
          />

        </div>


        {/* =====================================================
            HERO VIDEO
        ===================================================== */}

        <div style={{ marginTop: "28px" }}>

          <label style={labelStyle}>
            Hero Video
          </label>

          <div
            style={{
              marginTop: "10px",
              padding: "20px",
              borderRadius: "14px",
              background: "#f8fafc",
              border: "1px solid #cbd5e1",
            }}
          >

            {form.hero_video && (
              <div>

                <p
                  style={{
                    color: "#0284c7",
                    marginBottom: "10px",
                    fontWeight: "600",
                  }}
                >
                  Current Video
                </p>

                <p style={selectedVideoStyle}>
                  {form.hero_video}
                </p>

              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >

              <FileUploader
                folder="hero"
                label={
                  form.hero_video
                    ? "Change Video"
                    : "Choose Hero Video"
                }
                accept="video/*"
                onUploaded={(file) =>
                  updateMediaField("hero_video", file)
                }
              />

              {form.hero_video && (
                <button
                  type="button"
                  onClick={() => removeMediaField("hero_video")}
                  style={removeButtonStyle}
                >
                  Remove
                </button>
              )}

            </div>

          </div>

        </div>


        {/* =====================================================
            STATEMENT IMAGE
        ===================================================== */}

        <div style={{ marginTop: "28px" }}>

          <label style={labelStyle}>
            Statement Image
          </label>

          <div
            style={{
              marginTop: "10px",
              padding: "20px",
              borderRadius: "14px",
              background: "#f8fafc",
              border: "1px solid #cbd5e1",
            }}
          >

            {form.statement_image && (
              <img
                src={getMediaUrl(form.statement_image)}
                alt="Statement"
                style={{
                  width: "100%",
                  maxHeight: "240px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  display: "block",
                  marginBottom: "20px",
                }}
              />
            )}

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >

              <FileUploader
                folder="statement"
                label={
                  form.statement_image
                    ? "Change Statement Image"
                    : "Choose Statement Image"
                }
                accept="image/*"
                onUploaded={(file) =>
                  updateMediaField(
                    "statement_image",
                    file
                  )
                }
              />

              {form.statement_image && (
                <button
                  type="button"
                  onClick={() =>
                    removeMediaField("statement_image")
                  }
                  style={removeButtonStyle}
                >
                  Remove
                </button>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          ABOUT PAGE
      ===================================================== */}

      <section style={sectionStyle}>

        <h2 style={sectionTitle}>
          About Page
        </h2>

        <p style={sectionDescription}>
          Manage the content displayed on the About page.
        </p>

        <div style={gridStyle}>

          {/* ABOUT LABEL */}

          <div>
            <label style={labelStyle}>
              About Label
            </label>

            <input
              name="about_label"
              value={form.about_label || ""}
              onChange={handleChange}
              placeholder="ABOUT TERRALENS"
              style={inputStyle}
            />
          </div>


          {/* EXPERTISE LABEL */}

          <div>
            <label style={labelStyle}>
              Expertise Label
            </label>

            <input
              name="about_expertise_label"
              value={form.about_expertise_label || ""}
              onChange={handleChange}
              placeholder="EXPERTISE"
              style={inputStyle}
            />
          </div>


          {/* EXPERTISE TITLE */}

          <div>
            <label style={labelStyle}>
              Expertise Title
            </label>

            <input
              name="about_expertise_title"
              value={form.about_expertise_title || ""}
              onChange={handleChange}
              placeholder="GIS + IT"
              style={inputStyle}
            />
          </div>


          {/* PROJECT COUNT */}

          <div>
            <label style={labelStyle}>
              Projects Count
            </label>

            <input
              name="about_projects_count"
              value={form.about_projects_count || ""}
              onChange={handleChange}
              placeholder="500+"
              style={inputStyle}
            />
          </div>


          {/* PROJECT LABEL */}

          <div>
            <label style={labelStyle}>
              Projects Label
            </label>

            <input
              name="about_projects_label"
              value={form.about_projects_label || ""}
              onChange={handleChange}
              placeholder="PROJECTS"
              style={inputStyle}
            />
          </div>


          {/* CLIENT COUNT */}

          <div>
            <label style={labelStyle}>
              Clients Count
            </label>

            <input
              name="about_clients_count"
              value={form.about_clients_count || ""}
              onChange={handleChange}
              placeholder="100+"
              style={inputStyle}
            />
          </div>


          {/* CLIENT LABEL */}

          <div>
            <label style={labelStyle}>
              Clients Label
            </label>

            <input
              name="about_clients_label"
              value={form.about_clients_label || ""}
              onChange={handleChange}
              placeholder="CLIENTS"
              style={inputStyle}
            />
          </div>

        </div>


        {/* ABOUT TITLE */}

        <div style={{ marginTop: "24px" }}>

          <label style={labelStyle}>
            About Title
          </label>

          <textarea
            name="about_title"
            value={form.about_title || ""}
            onChange={handleChange}
            placeholder="Bridging Geospatial Intelligence & Digital Innovation"
            rows={3}
            style={textareaStyle}
          />

        </div>

        {/* EXPERTISE DESCRIPTION */}

        <div style={{ marginTop: "24px" }}>

          <label style={labelStyle}>
            Expertise Description
          </label>

          <textarea
            name="about_expertise_description"
            value={form.about_expertise_description || ""}
            onChange={handleChange}
            placeholder="Remote Sensing, Artificial Intelligence, Enterprise Software, Cloud Infrastructure, Spatial Analytics & Web Platforms."
            rows={5}
            style={textareaStyle}
          />

        </div>

      </section>

        {/* =====================================================
            SHOWCASE PAGE
        ===================================================== */}

        <section
          style={{
            ...sectionStyle,
            marginTop: "28px",
          }}
        >

          <h2 style={sectionTitle}>
            Showcase Page
          </h2>

          <p style={sectionDescription}>
            Manage the content displayed in the Showcase page hero section.
          </p>

          <div style={gridStyle}>

            {/* SHOWCASE LABEL */}

            <div>
              <label style={labelStyle}>
                Showcase Label
              </label>

              <input
                name="showcase_label"
                value={form.showcase_label || ""}
                onChange={handleChange}
                placeholder="OUR SHOWCASE"
                style={inputStyle}
              />
            </div>

            {/* BUTTON TEXT */}

            <div>
              <label style={labelStyle}>
                Showcase Button Text
              </label>

              <input
                name="showcase_button_text"
                value={form.showcase_button_text || ""}
                onChange={handleChange}
                placeholder="Explore Projects"
                style={inputStyle}
              />
            </div>

          </div>

          {/* SHOWCASE TITLE */}

          <div style={{ marginTop: "24px" }}>

            <label style={labelStyle}>
              Showcase Title
            </label>

            <input
              name="showcase_title"
              value={form.showcase_title || ""}
              onChange={handleChange}
              placeholder="Featured Projects"
              style={inputStyle}
            />

          </div>

          {/* SHOWCASE DESCRIPTION */}

          <div style={{ marginTop: "24px" }}>

            <label style={labelStyle}>
              Showcase Description
            </label>

            <textarea
              name="showcase_subtitle"
              value={form.showcase_subtitle || ""}
              onChange={handleChange}
              placeholder="Explore our latest work across GIS, IT, Artificial Intelligence, IoT, Cloud Computing and Cybersecurity solutions delivered for governments, enterprises and infrastructure projects."
              rows={5}
              style={textareaStyle}
            />

          </div>

        </section>


      {/* =====================================================
          CONTACT PAGE
      ===================================================== */}

      <section style={sectionStyle}>

        <h2 style={sectionTitle}>
          Contact Page
        </h2>

        <p style={sectionDescription}>
          Manage the content and contact information displayed on the Contact page.
        </p>

        {/* CONTACT HERO */}

        <div style={gridStyle}>

          {/* CONTACT LABEL */}

          <div>
            <label style={labelStyle}>
              Contact Label
            </label>

            <input
              name="contact_label"
              value={form.contact_label || ""}
              onChange={handleChange}
              placeholder="CONTACT"
              style={inputStyle}
            />
          </div>

          {/* CONTACT BUTTON */}

          <div>
            <label style={labelStyle}>
              Contact Button Text
            </label>

            <input
              name="contact_button_text"
              value={form.contact_button_text || ""}
              onChange={handleChange}
              placeholder="Contact Us"
              style={inputStyle}
            />
          </div>

        </div>

        {/* CONTACT TITLE */}

        <div style={{ marginTop: "24px" }}>

          <label style={labelStyle}>
            Contact Title
          </label>

          <textarea
            name="contact_title"
            value={form.contact_title || ""}
            onChange={handleChange}
            placeholder="Let's Build Something Great"
            rows={3}
            style={textareaStyle}
          />

        </div>

        {/* CONTACT DESCRIPTION */}

        <div style={{ marginTop: "24px" }}>

          <label style={labelStyle}>
            Contact Description
          </label>

          <textarea
            name="contact_subtitle"
            value={form.contact_subtitle || ""}
            onChange={handleChange}
            placeholder="Whether you need GIS solutions, enterprise software, AI integration or consulting services, our team is ready to help turn your ideas into reality."
            rows={5}
            style={textareaStyle}
          />

        </div>

          {/* CONTACT INFORMATION */}

        <div
          style={{
            marginTop: "28px",
            paddingTop: "28px",
            borderTop: "1px solid #e2e8f0",
          }}
        >

          <h3
            style={{
              color: "#0f172a",
              fontSize: "16px",
              fontWeight: "700",
              margin: "0 0 20px",
            }}
          >
            Contact Information
          </h3>

          <div style={gridStyle}>

            {/* EMAIL */}

            <div>
              <label style={labelStyle}>
                Contact Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                placeholder="info@terralens.com"
                style={inputStyle}
              />
            </div>

            {/* PHONE */}

            <div>
              <label style={labelStyle}>
                Contact Phone
              </label>

              <input
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                style={inputStyle}
              />
            </div>

            {/* BUSINESS HOURS */}

            <div>
              <label style={labelStyle}>
                Business Hours
              </label>

              <input
                name="business_hours"
                value={form.business_hours || ""}
                onChange={handleChange}
                placeholder="Mon - Fri • 9:00 AM - 6:00 PM"
                style={inputStyle}
              />
            </div>

          </div>

          {/* LOCATION */}

          <div style={{ marginTop: "24px" }}>

            <label style={labelStyle}>
              Contact Location
            </label>

            <textarea
              name="address"
              value={form.address || ""}
              onChange={handleChange}
              placeholder="Nagercoil, Tamil Nadu, India"
              rows={3}
              style={textareaStyle}
            />

          </div>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <section style={sectionStyle}>

        <h2 style={sectionTitle}>
          Footer
        </h2>

        <p style={sectionDescription}>
          Manage the content displayed in the website footer.
        </p>

        <div style={gridStyle}>

          <div>

            <label style={labelStyle}>
              Footer Description
            </label>

            <textarea
              name="footer_text"
              value={form.footer_text || ""}
              onChange={handleChange}
              placeholder="Enter your footer description..."
              rows={4}
              style={textareaStyle}
            />

          </div>


          <div>

            <label style={labelStyle}>
              Footer Address
            </label>

            <textarea
              name="address"
              value={form.address || ""}
              onChange={handleChange}
              placeholder="Nagercoil, Tamil Nadu, India"
              rows={4}
              style={textareaStyle}
            />

          </div>


          <div>

            <label style={labelStyle}>
              Footer Phone
            </label>

            <input
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
              style={inputStyle}
            />

          </div>


          <div>

            <label style={labelStyle}>
              Footer Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              placeholder="info@terralens.in"
              style={inputStyle}
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          SAVE SETTINGS
      ===================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "24px",
          marginBottom: "40px",
        }}
      >

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          style={{
            ...buttonStyle,
            opacity: saving ? 0.6 : 1,
            cursor: saving
              ? "not-allowed"
              : "pointer",
          }}
        >
          {saving
            ? "Saving..."
            : "Save Settings"}
        </button>

      </div>

    </div>
  );
}


/* =====================================================
   STYLES
===================================================== */

const sectionStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "20px",
  padding: "32px",
  marginBottom: "24px",
};

const sectionTitle = {
  color: "#0f172a",
  fontSize: "20px",
  fontWeight: "700",
  margin: 0,
};

const sectionDescription = {
  color: "#64748b",
  marginTop: "8px",
  marginBottom: "28px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "22px",
};

const labelStyle = {
  display: "block",
  color: "#334155",
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "8px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px 16px",
  borderRadius: "10px",
  background: "#f8fafc",
  color: "#0f172a",
  border: "1px solid #cbd5e1",
  outline: "none",
  fontSize: "14px",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
};

const buttonStyle = {
  padding: "14px 28px",
  background: "#0ea5e9",
  color: "#0f172a",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "15px",
};

const secondaryButtonStyle = {
  padding: "12px 20px",
  background: "#eff6ff",
  color: "#0284c7",
  border: "1px solid #bae6fd",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
};

const videoFieldStyle = {
  padding: "20px",
  background: "#f8fafc",
  border: "1px solid #cbd5e1",
  borderRadius: "14px",
};

const selectedVideoStyle = {
  color: "#64748b",
  fontSize: "13px",
  margin: "10px 0 16px",
  wordBreak: "break-all",
  minHeight: "38px",
};

const removeButtonStyle = {
  padding: "7px 12px",
  background: "#fef2f2",
  color: "#dc2626",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
  flexShrink: 0,
};