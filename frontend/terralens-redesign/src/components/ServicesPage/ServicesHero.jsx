import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Globe2,
  Code2,
  MapPinned,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

export default function ServicesHero() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await api.get("/settings/");
        setSettings(data);
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    loadSettings();
  }, []);

  const backgroundVideo = settings?.services_video
    ? settings.services_video.startsWith("http")
      ? settings.services_video
      : `${import.meta.env.VITE_API_URL}${settings.services_video}`
    : null;

  const hasVideo = Boolean(backgroundVideo);

  /* =======================================================
     THEME
  ======================================================= */

  const theme = {
    sectionBg: "#ffffff",
    label: "#0ea5e9",
    heading: hasVideo ? "#ffffff" : "#0f172a",

    body: hasVideo ? "#ffffff" : "#475569",
    gridLine: "rgba(15,23,42,0.07)",

    contactBg: "transparent",
    contactBorder: hasVideo ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.2)",
    contactText: hasVideo ? "#ffffff" : "#0f172a",
    contactHoverClass: hasVideo
      ? "hover:border-white/50 hover:bg-white/5 hover:-translate-y-0.5 transition-all group"
      : "hover:border-sky-500/50 hover:bg-sky-500/5 hover:text-sky-600 hover:-translate-y-0.5 transition-all group",

    cardBg: hasVideo
      ? "rgba(17,17,19,0.05)"
      : "rgba(255,255,255,0.05)",

    cardBorder: "1px solid rgba(15,23,42,0.10)",
    cardShadow: "0 20px 60px rgba(15,23,42,0.08)",

    cardHeading: "#0f172a",
    cardBody: hasVideo ? "#ffffff" : "#475569",

    bottomFade:
      "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.25))",
  };

  const scrollToServices = () => {
    const section = document.getElementById("services-list");

    if (!section) {
      console.error("services-list section not found");
      return;
    }

    const y =
      section.getBoundingClientRect().top +
      window.scrollY -
      20;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="w-full"
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: theme.sectionBg,
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      {/* =========================================================
          BACKGROUND VIDEO
      ========================================================= */}

      {hasVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: 1,
            zIndex: 0,
          }}
        >
          <source
            src={backgroundVideo}
            type="video/mp4"
          />
        </video>
      )}

      {/* =========================================================
          DARK READABILITY OVERLAY
      ========================================================= */}

      {hasVideo && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 60% at 35% 50%, rgba(2,6,23,0.45) 0%, rgba(2,6,23,0.20) 45%, rgba(2,6,23,0) 75%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      )}

      {/* =========================================================
          BACKGROUND GLOWS
          Only used when there is NO video
      ========================================================= */}

      {!hasVideo && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              height: "500px",
              width: "500px",
              transform: "translateX(-50%)",
              borderRadius: "9999px",
              backgroundColor: "rgba(255,255,255,0.08)",
              filter: "blur(140px)",
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: "288px",
              width: "288px",
              borderRadius: "9999px",
              backgroundColor: "rgba(255,255,255,0.05)",
              filter: "blur(120px)",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "80px",
              right: "-10%",
              height: "384px",
              width: "384px",
              borderRadius: "9999px",
              backgroundColor: "rgba(255,255,255,0.07)",
              filter: "blur(140px)",
            }}
          />
        </div>
      )}

      {/* =========================================================
          GRID PATTERN
      ========================================================= */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          pointerEvents: "none",
          zIndex: 3,
          backgroundImage: `linear-gradient(${theme.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${theme.gridLine} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* =========================================================
          MAIN WRAPPER
      ========================================================= */}

      <div
        style={{
          position: "relative",
          zIndex: 10,
          margin: "0 auto",
          width: "100%",
          maxWidth: "85rem",
          padding: "128px 24px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",
          alignItems: "center",
          gap: "64px",
          boxSizing: "border-box",
        }}
      >
        {/* =====================================================
            LEFT COLUMN
        ===================================================== */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxSizing: "border-box",
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              textTransform: "uppercase",
              letterSpacing: "5px",
              color: theme.label,
              fontSize: "0.75rem",
              fontWeight: "700",
              marginBottom: "20px",
            }}
          >
            OUR SERVICES
          </motion.p>

          {/* MAIN HEADING */}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              fontSize: "clamp(2.5rem, 4vw, 3.75rem)",
              fontWeight: "800",
              color: theme.heading,
              lineHeight: "1.15",
              letterSpacing: "-0.025em",
            }}
          >
            Engineering

            <span
              style={{
                display: "block",
                color: theme.label,
                margin: "4px 0",
              }}
            >
              Digital &
            </span>

            Geospatial Solutions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              marginTop: "32px",
              maxWidth: "38rem",
              fontSize: "1rem",
              lineHeight: "1.7",
              color: theme.body,
            }}
          >
            We deliver end-to-end GIS, remote sensing,
            enterprise software, artificial intelligence,
            cloud platforms and consulting services
            for governments and enterprises.
          </motion.p>

          {/* Buttons */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              marginTop: "48px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "20px",
              boxSizing: "border-box",
            }}
          >
            <button
              onClick={scrollToServices}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "9999px",
                backgroundColor: "#0ea5e9",
                padding: "16px 36px",
                fontSize: "1rem",
                fontWeight: "700",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
              }}
              className="hover:bg-sky-400 hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] hover:-translate-y-0.5 group"
            >
              Explore

              <ArrowDown
                style={{
                  marginLeft: "12px",
                  transition: "transform 0.3s ease",
                }}
                className="animate-bounce"
                size={18}
              />
            </button>

            <button
              type="button"
              onClick={() => navigate("/contact")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "16px 34px",
                borderRadius: "9999px",
                background: theme.contactBg,
                border: `1px solid ${theme.contactBorder}`,
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                color: theme.contactText,
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              className={theme.contactHoverClass}
            >
              Contact Us

              <ArrowRight
                size={18}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </button>
          </motion.div>
        </div>

        {/* =====================================================
            RIGHT COLUMN — GLASS CARD
        ===================================================== */}

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.6,
          }}
          style={{
            position: "relative",
            width: "100%",
            borderRadius: "2.5rem",
            backgroundColor: theme.cardBg,
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            border: theme.cardBorder,
            boxShadow: theme.cardShadow,
            overflow: "hidden",
            padding: "40px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              boxSizing: "border-box",
            }}
          >
            {/* ITEM 1 */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  flexShrink: 0,
                  borderRadius: "20px",
                  backgroundColor:
                    "rgba(56,189,248,0.1)",
                  border:
                    "1px solid rgba(56,189,248,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MapPinned
                  className="text-sky-400"
                  size={26}
                />
              </div>

              <div>
                <h3
                  style={{
                    fontSize: "1.375rem",
                    fontWeight: "700",
                    color: theme.cardHeading,
                    marginBottom: "4px",
                  }}
                >
                  GIS Solutions
                </h3>

                <p
                  style={{
                    color: theme.cardBody,
                    fontSize: "0.95rem",
                    fontWeight: "500",
                  }}
                >
                  Mapping • Survey • Spatial Analytics
                </p>
              </div>
            </div>

            {/* ITEM 2 */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  flexShrink: 0,
                  borderRadius: "20px",
                  backgroundColor:
                    "rgba(56,189,248,0.1)",
                  border:
                    "1px solid rgba(56,189,248,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Code2
                  className="text-sky-400"
                  size={26}
                />
              </div>

              <div>
                <h3
                  style={{
                    fontSize: "1.375rem",
                    fontWeight: "700",
                    color: theme.cardHeading,
                    marginBottom: "4px",
                  }}
                >
                  IT Solutions
                </h3>

                <p
                  style={{
                    color: theme.cardBody,
                    fontSize: "0.95rem",
                    fontWeight: "500",
                  }}
                >
                  Web Apps • Cloud • AI
                </p>
              </div>
            </div>

            {/* ITEM 3 */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  flexShrink: 0,
                  borderRadius: "20px",
                  backgroundColor:
                    "rgba(56,189,248,0.1)",
                  border:
                    "1px solid rgba(56,189,248,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Globe2
                  className="text-sky-400"
                  size={26}
                />
              </div>

              <div>
                <h3
                  style={{
                    fontSize: "1.375rem",
                    fontWeight: "700",
                    color: theme.cardHeading,
                    marginBottom: "4px",
                  }}
                >
                  Consultancy
                </h3>

                <p
                  style={{
                    color: theme.cardBody,
                    fontSize: "0.95rem",
                    fontWeight: "500",
                  }}
                >
                  Enterprise • Government Projects
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* =========================================================
          SOFT BOTTOM VIDEO FADE
      ========================================================= */}

      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{
          height: "100px",
          zIndex: 20,
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.08) 55%, rgba(255,255,255,0.25) 100%)",
        }}
      />
    </section>
  );
}