import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutCTA() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        padding: "96px 0px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* =========================
          BACKGROUND GLOW
      ========================= */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            height: "400px",
            width: "400px",
            transform: "translateX(-50%)",
            borderRadius: "9999px",
            backgroundColor: "rgba(14, 165, 233, 0.08)",
            filter: "blur(120px)",
          }}
        />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "75rem",
          margin: "0 auto",
          padding: "0 24px",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 10,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            borderRadius: "3rem",
            border: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
            padding: "64px 32px",
            boxSizing: "border-box",
            textAlign: "center",
            boxShadow: "0 20px 70px rgba(15, 23, 42, 0.08)",
          }}
        >

          {/* =========================
              SMALL HEADING
          ========================= */}
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "5px",
              color: "#0ea5e9",
              fontSize: "0.75rem",
              fontWeight: "700",
              marginBottom: "16px",
              width: "100%",
            }}
          >
            LET'S BUILD TOGETHER
          </p>

          {/* =========================
              MAIN HEADING
          ========================= */}
          <h2
            style={{
              fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
              fontWeight: "800",
              color: "#0f172a",
              letterSpacing: "-0.025em",
              lineHeight: "1.2",
              marginBottom: "24px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            Ready to Transform
            <span
              style={{
                display: "block",
                color: "#0ea5e9",
              }}
            >
              Your Business?
            </span>
          </h2>

          {/* =========================
              DESCRIPTION
          ========================= */}
          <p
            style={{
              maxWidth: "42rem",
              margin: "0 auto",
              fontSize: "1rem",
              color: "#64748b",
              lineHeight: "1.7",
              marginBottom: "40px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            Whether it's GIS, AI, Enterprise Software or Digital
            Transformation, TerraLens is ready to help bring your
            Next Innovation to Life.
          </p>

          {/* =========================
              BUTTONS
          ========================= */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "20px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >

            {/* CONTACT */}
            <Link
              to="/contact"
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
                textDecoration: "none",
                boxSizing: "border-box",
                transition: "all 0.3s ease",
              }}
              className="
                hover:bg-sky-500
                hover:shadow-[0_0_30px_rgba(14,165,233,0.3)]
                hover:-translate-y-0.5
                group
              "
            >
              Contact Us

              <ArrowRight
                style={{
                  marginLeft: "12px",
                  transition: "transform 0.3s ease",
                }}
                className="group-hover:translate-x-1"
                size={18}
              />
            </Link>

            {/* EXPLORE SERVICES */}
            <Link
              to="/services"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "9999px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#f8fafc",
                padding: "16px 36px",
                fontSize: "1rem",
                fontWeight: "600",
                color: "#334155",
                textDecoration: "none",
                boxSizing: "border-box",
                transition: "all 0.3s ease",
              }}
              className="
                hover:border-sky-300
                hover:bg-sky-50
                hover:text-sky-600
                hover:-translate-y-0.5
                group
              "
            >
              Explore Services

              <ArrowRight
                style={{
                  marginLeft: "12px",
                  transition: "transform 0.3s ease",
                }}
                className="group-hover:translate-x-1"
                size={18}
              />
            </Link>

          </div>

        </motion.div>
      </div>
    </section>
  );
}