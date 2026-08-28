import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import { createContact } from "../../api/contact";
import { getSettings } from "../../api/settings";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);

  // =========================
  // LOAD WEBSITE SETTINGS
  // =========================

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error(
          "Failed to load website settings:",
          error
        );
      }
    };

    loadSettings();
  }, []);

  // =========================
  // CONTACT FORM SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // =========================
    // BASIC EMAIL VALIDATION
    // =========================

    const email = formData.email.trim();

    if (!email.includes("@")) {
      alert("Please add an '@' in your email address.");
      return;
    }

    if (!email.includes(".")) {
      alert(
        "Please add a '.' in your email address (e.g. .com, .in)."
      );
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      await createContact(formData);

      alert("Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error(
        "Contact form error:",
        error.response?.data || error.message
      );

      alert(
        "Failed to send message. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CONTACT INFORMATION
  // =========================

  const contactItems = [
    {
      icon: Mail,
      title: "Email",
      value: settings.email || "",
    },
    {
      icon: Phone,
      title: "Phone",
      value: settings.phone || "",
    },
    {
      icon: MapPin,
      title: "Office",
      value: settings.address || "",
    },
  ];

  return (
    <section
      id="contact-section"
      style={{
        backgroundColor: "#ffffff",
        padding: "96px 0px",
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
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "48px",
          alignItems: "start",
          boxSizing: "border-box",
        }}
      >
        {/* =====================================================
            LEFT SIDE - CONTACT INFORMATION
        ===================================================== */}

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
          }}
        >
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "5px",
              color: "#0ea5e9",
              fontSize: "0.75rem",
              fontWeight: "700",
              marginBottom: "16px",
            }}
          >
            GET IN TOUCH
          </p>

          <h2
            style={{
              fontSize:
                "clamp(2.25rem, 3.5vw, 3rem)",
              fontWeight: "800",
              color: "#0f172a",
              lineHeight: "1.2",
              letterSpacing: "-0.025em",
              marginBottom: "24px",
            }}
          >
            We'd Love To
            <span
              style={{
                display: "block",
                color: "#0ea5e9",
              }}
            >
              Hear From You
            </span>
          </h2>

          <p
            style={{
              color: "#64748b",
              fontSize: "1rem",
              lineHeight: "1.7",
              marginBottom: "36px",
            }}
          >
            Whether you have a project in mind, need expert
            consultation or simply want to learn more about
            TerraLens, our team is here to help.
          </p>

          {/* Contact Information Cards */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {contactItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    borderRadius: "24px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#ffffff",
                    padding: "24px",
                    boxSizing: "border-box",
                    transition: "all 0.3s ease",
                    boxShadow:
                      "0 8px 30px rgba(15,23,42,0.05)",
                  }}
                  className="hover:border-sky-300"
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "16px",
                      backgroundColor:
                        "rgba(14, 165, 233, 0.08)",
                      border:
                        "1px solid rgba(14, 165, 233, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      className="text-sky-500"
                      size={22}
                    />
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "700",
                        color: "#0f172a",
                        marginBottom: "4px",
                      }}
                    >
                      {item.title}
                    </h3>

                    <p
                      style={{
                        color: "#64748b",
                        fontSize: "0.95rem",
                      }}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* =====================================================
            RIGHT SIDE - CONTACT FORM
        ===================================================== */}

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            borderRadius: "32px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
            padding: "40px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            boxShadow:
              "0 15px 50px rgba(15,23,42,0.06)",
          }}
        >
          <h3
            style={{
              fontSize: "1.75rem",
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: "8px",
              letterSpacing: "-0.025em",
            }}
          >
            Send a Message
          </h3>

          <p
            style={{
              color: "#64748b",
              fontSize: "0.95rem",
              marginBottom: "32px",
            }}
          >
            Fill out the form and our team will get back to you.
          </p>

          {/* =====================================================
              NAME + EMAIL
          ===================================================== */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              style={{
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
                padding: "16px",
                color: "#0f172a",
                outline: "none",
                fontSize: "0.95rem",
                width: "100%",
                boxSizing: "border-box",
              }}
              className="focus:border-sky-500 transition-colors"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              style={{
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
                padding: "16px",
                color: "#0f172a",
                outline: "none",
                fontSize: "0.95rem",
                width: "100%",
                boxSizing: "border-box",
              }}
              className="focus:border-sky-500 transition-colors"
            />
          </div>

          {/* =====================================================
              PHONE + SUBJECT
          ===================================================== */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");

                setFormData({
                  ...formData,
                  phone: value,
                });
              }}
              style={{
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
                padding: "16px",
                color: "#0f172a",
                outline: "none",
                fontSize: "0.95rem",
                width: "100%",
                boxSizing: "border-box",
              }}
              className="focus:border-sky-500 transition-colors"
            />

            <input
              type="text"
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subject: e.target.value,
                })
              }
              style={{
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
                padding: "16px",
                color: "#0f172a",
                outline: "none",
                fontSize: "0.95rem",
                width: "100%",
                boxSizing: "border-box",
              }}
              className="focus:border-sky-500 transition-colors"
            />
          </div>

          {/* =====================================================
              MESSAGE
          ===================================================== */}

          <textarea
            rows="5"
            placeholder="Tell us about your project..."
            value={formData.message}
            onChange={(e) =>
              setFormData({
                ...formData,
                message: e.target.value,
              })
            }
            style={{
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff",
              padding: "16px",
              color: "#0f172a",
              outline: "none",
              fontSize: "0.95rem",
              width: "100%",
              resize: "none",
              boxSizing: "border-box",
              marginBottom: "32px",
            }}
            className="focus:border-sky-500 transition-colors"
          />

          {/* =====================================================
              SUBMIT BUTTON
          ===================================================== */}

          <button
            type="submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "9999px",
              backgroundColor: "#0ea5e9",
              padding: "16px 32px",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxSizing: "border-box",
              alignSelf: "flex-start",
            }}
            className="hover:bg-sky-400 hover:shadow-[0_0_35px_rgba(56,189,248,.35)] hover:-translate-y-0.5"
          >
            {loading ? "Sending..." : "Send Message"}

            <Send
              style={{
                marginLeft: "12px",
              }}
              size={18}
            />
          </button>
        </motion.form>
      </div>
    </section>
  );
}