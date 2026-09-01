import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
} from "lucide-react";

import { getSettings } from "../../api/settings";


export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error("Failed to load footer settings:", error);
      }
    };

    loadSettings();
  }, []);
  
  const serviceLinks = [
    {
      name: "GIS Solutions",
      path: "/services",
    },
    {
      name: "Software Development",
      path: "/services",
    },
    {
      name: "Artificial Intelligence",
      path: "/services",
    },
    {
      name: "Drone Surveying",
      path: "/services",
    },
    {
      name: "Web Applications",
      path: "/services",
    },
  ];

  const companyLinks = [
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Services",
      path: "/services",
    },
    {
      name: "Products",
      path: "/products",
    },
    {
      name: "Careers",
      path: "/careers",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#0B0B0D",
        width: "100%",
      }}
    >
      <footer
        style={{
          background:
            "linear-gradient(to bottom, #A6B0B5, #9FA5AA, #948E86)",
          borderTop: "1px solid rgba(0, 0, 0, 0.1)",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "32px 24px 16px 24px",
            boxSizing: "border-box",
          }}
        >
          {/* Main Footer Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "24px",
              boxSizing: "border-box",
            }}
          >
            {/* Company */}
            <div
              style={{
                boxSizing: "border-box",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#1C2126",
                }}
              >
                TerraLens
              </h2>

              <p
                style={{
                  marginTop: "12px",
                  color: "#353D44",
                  lineHeight: "1.5",
                  fontWeight: "500",
                  fontSize: "0.85rem",
                }}
              >
                {settings?.footer_text ||
                    "Building enterprise GIS, AI, drone surveying and software engineering solutions for governments, enterprises and research institutions across India."}
              </p>
            </div>

            {/* Services */}
            <div
              style={{
                boxSizing: "border-box",
              }}
            >
              <h3
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  fontWeight: "800",
                  color: "#272D33",
                  marginBottom: "12px",
                }}
              >
                Services
              </h3>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {serviceLinks.map((item) => (
                  <li
                    key={item.name}
                    className="group"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      width: "fit-content",
                    }}
                  >
                    <Link
                      to={item.path}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#353D44",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                        textDecoration: "none",
                        transition: "color 0.3s ease",
                      }}
                    >
                      <span>{item.name}</span>

                      <ArrowUpRight
                        size={12}
                        className="
                          opacity-0
                          -translate-x-2
                          translate-y-2
                          group-hover:opacity-100
                          group-hover:translate-x-0
                          group-hover:translate-y-0
                        "
                        style={{
                          transition: "all 0.3s ease",
                        }}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Navigation */}
            <div
              style={{
                boxSizing: "border-box",
              }}
            >
              <h3
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  fontWeight: "800",
                  color: "#272D33",
                  marginBottom: "12px",
                }}
              >
                Company
              </h3>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {companyLinks.map((item) => (
                  <li
                    key={item.name}
                    className="group"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      width: "fit-content",
                    }}
                  >
                    <Link
                      to={item.path}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#353D44",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                        textDecoration: "none",
                        transition: "color 0.3s ease",
                      }}
                    >
                      <span>{item.name}</span>

                      <ArrowUpRight
                        size={12}
                        className="
                          opacity-0
                          -translate-x-2
                          translate-y-2
                          group-hover:opacity-100
                          group-hover:translate-x-0
                          group-hover:translate-y-0
                        "
                        style={{
                          transition: "all 0.3s ease",
                        }}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div
              style={{
                boxSizing: "border-box",
              }}
            >
              <h3
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  fontWeight: "800",
                  color: "#272D33",
                  marginBottom: "12px",
                }}
              >
                Contact
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {/* Location */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <MapPin
                    size={16}
                    style={{
                      color: "#1C2126",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  />

                  <a
                    href="https://maps.app.goo.gl/Lut6YufXkhxiZgNfA"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#353D44",
                      fontWeight: "600",
                      fontSize: "0.85rem",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#01080c";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#353D44";
                    }}
                  >
                    {settings?.address || "Nagercoil, Tamil Nadu, India"}
                  </a>
                </div>

                {/* Phone */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <Phone
                    size={16}
                    style={{
                      color: "#1C2126",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  />

                  <a
                    href={`tel:${settings?.phone || "+91XXXXXXXXXX"}`}
                    style={{
                      color: "#353D44",
                      fontWeight: "600",
                      fontSize: "0.85rem",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#01080c";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#353D44";
                    }}
                  >
                    {settings?.phone || "+91 XXXXX XXXXX"}
                  </a>
                </div>

                {/* Email */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <Mail
                    size={16}
                    style={{
                      color: "#1C2126",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  />

                  <a
                    href={`mailto:${settings?.email || "info@terralens.in"}`}
                    style={{
                      color: "#353D44",
                      fontWeight: "600",
                      fontSize: "0.85rem",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#01080c";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#353D44";
                    }}
                  >
                    {settings?.email || "info@terralens.in"}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div
            style={{
              borderTop: "1px solid rgba(0, 0, 0, 0.1)",
              marginTop: "24px",
              paddingTop: "16px",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              boxSizing: "border-box",
            }}
          >
            <p
              style={{
                color: "#454E56",
                fontWeight: "600",
                fontSize: "0.75rem",
                margin: 0,
              }}
            >
              © 2026 TerraLens Innovations Private Limited.
            </p>

            <p
              style={{
                color: "#454E56",
                fontWeight: "600",
                fontSize: "0.75rem",
                margin: 0,
              }}
            >
              Designed & Developed by TerraLens.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}