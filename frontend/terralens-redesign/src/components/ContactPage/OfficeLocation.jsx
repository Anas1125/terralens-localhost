import { motion } from "framer-motion";
import {
  MapPinned,
  Navigation,
  Building2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getSettings } from "../../api/settings";

export default function OfficeLocation() {
  const [address, setAddress] = useState("");
  const [googleMaps, setGoogleMaps] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();

        setAddress(data?.address || "");
        setGoogleMaps(data?.google_maps || "");
      } catch (error) {
        console.error(
          "Failed to load office location settings:",
          error
        );
      }
    };

    loadSettings();
  }, []);

  const getGoogleMapsUrl = (value) => {
    if (!value) return "";

    const iframeMatch = value.match(
      /<iframe[^>]+src=["']([^"']+)["']/i
    );

    if (iframeMatch) {
      return iframeMatch[1];
    }

    return value.trim();
  };

  const googleMapsUrl = getGoogleMapsUrl(googleMaps);

  return (
    <section
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
            OUR LOCATION
          </p>

          <h2
            style={{
              fontSize: "clamp(2rem, 3vw, 2.75rem)",
              fontWeight: "800",
              color: "#0f172a",
              letterSpacing: "-0.025em",
              marginBottom: "16px",
              lineHeight: "1.2",
            }}
          >
            Visit TerraLens
          </h2>

          <p
            style={{
              fontSize: "1rem",
              color: "#64748b",
              lineHeight: "1.6",
            }}
          >
            We'd be delighted to welcome you to our office.
            Schedule a meeting with our team and let's discuss
            your next GIS or technology project.
          </p>
        </div>

        {/* Content Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "32px",
            width: "100%",
            maxWidth: "75rem",
            alignItems: "stretch",
            boxSizing: "border-box",
          }}
        >
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              gridColumn: "span 2",
              borderRadius: "32px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              minHeight: "440px",
              position: "relative",
              overflow: "hidden",
              boxSizing: "border-box",
              boxShadow:
                "0 12px 40px rgba(15,23,42,0.05)",
            }}
          >
            {googleMapsUrl ? (
              <iframe
                src={googleMapsUrl}
                title="TerraLens Office Location"
                width="100%"
                height="100%"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <>
                {/* Background Grid Pattern */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.5,
                    backgroundImage:
                      "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                    pointerEvents: "none",
                  }}
                />

                <div
                  style={{
                    textAlign: "center",
                    position: "relative",
                    zIndex: 10,
                    maxWidth: "28rem",
                    padding: "32px",
                    margin: "auto",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      padding: "20px",
                      borderRadius: "50%",
                      backgroundColor:
                        "rgba(14, 165, 233, 0.08)",
                      border:
                        "1px solid rgba(14, 165, 233, 0.2)",
                      marginBottom: "20px",
                    }}
                  >
                    <MapPinned
                      className="text-sky-500"
                      size={48}
                    />
                  </div>

                  <h3
                    style={{
                      fontSize: "1.75rem",
                      fontWeight: "700",
                      color: "#0f172a",
                      marginBottom: "12px",
                      letterSpacing: "-0.025em",
                    }}
                  >
                    Interactive Map
                  </h3>

                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "0.95rem",
                      lineHeight: "1.6",
                    }}
                  >
                    Add your Google Maps location from the
                    admin settings to display the map here.
                  </p>
                </div>
              </>
            )}
          </motion.div>

          {/* Office Details Stack */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              boxSizing: "border-box",
            }}
          >
            {/* Office */}
            <div
              style={{
                borderRadius: "28px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
                padding: "32px",
                boxSizing: "border-box",
                flex: 1,
                boxShadow:
                  "0 10px 35px rgba(15,23,42,0.05)",
              }}
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
                  marginBottom: "20px",
                }}
              >
                <Building2
                  className="text-sky-500"
                  size={24}
                />
              </div>

              <h3
                style={{
                  fontSize: "1.375rem",
                  fontWeight: "700",
                  color: "#0f172a",
                  marginBottom: "12px",
                }}
              >
                Office
              </h3>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.95rem",
                  lineHeight: "1.6",
                  margin: 0,
                }}
              >
                TerraLens Innovations
                <br />
                <br />
                {address || "Office address will be updated soon."}
              </p>
            </div>

            {/* Directions */}
            <div
              style={{
                borderRadius: "28px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
                padding: "32px",
                boxSizing: "border-box",
                flex: 1,
                boxShadow:
                  "0 10px 35px rgba(15,23,42,0.05)",
              }}
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
                  marginBottom: "20px",
                }}
              >
                <Navigation
                  className="text-sky-500"
                  size={24}
                />
              </div>

              <h3
                style={{
                  fontSize: "1.375rem",
                  fontWeight: "700",
                  color: "#0f172a",
                  marginBottom: "12px",
                }}
              >
                Directions
              </h3>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.95rem",
                  lineHeight: "1.6",
                  margin: 0,
                }}
              >
                Find our office location and get directions
                directly through Google Maps.
              </p>

              {googleMapsUrl && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "18px",
                    padding: "11px 18px",
                    borderRadius: "10px",
                    backgroundColor: "#0ea5e9",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "all 0.2s ease",
                  }}
                >
                  Open in Google Maps
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}