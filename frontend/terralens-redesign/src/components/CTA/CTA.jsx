import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        padding: "48px 0px",
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
          boxSizing: "border-box",
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
            background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
            border: "1px solid #e2e8f0",
            padding: "64px 32px",
            boxSizing: "border-box",
            textAlign: "center",
            boxShadow: "0 20px 80px -30px rgba(15, 23, 42, 0.15)",
          }}
        >

          {/* =========================
              SMALL HEADING
          ========================= */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
              textTransform: "uppercase",
              letterSpacing: "5px",
              color: "#0EA5E9",
              fontSize: "0.75rem",
              fontWeight: "700",
              marginBottom: "16px",
            }}
          >
            LET'S BUILD TOGETHER
          </motion.p>

          {/* =========================
              MAIN HEADING
          ========================= */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
              fontWeight: "800",
              color: "#0F172A",
              letterSpacing: "-0.025em",
              lineHeight: "1.2",
              marginBottom: "24px",
            }}
          >
            Ready to transform
            <br />
            your next project?
          </motion.h2>

          {/* =========================
              DESCRIPTION
          ========================= */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              maxWidth: "42rem",
              margin: "0 auto",
              fontSize: "1rem",
              color: "#64748B",
              lineHeight: "1.7",
              marginBottom: "40px",
            }}
          >
            From Gis Mapping And Ai Solutions To Enterprise Software,
             Cloud Infrastructure, And Surveying, Terra Lens 
             Transforms Complex Ideas Into Production Ready Solutions.
          </motion.p>

          {/* =========================
              BUTTON
          ========================= */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              borderRadius: "9999px",
              border: "1px solid rgba(14, 165, 233, 0.45)",
              backgroundColor: "#EFF6FF",
              backdropFilter: "blur(12px)",
              padding: "16px 36px",
              color: "#0284C7",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxSizing: "border-box",
            }}
            onClick={() => navigate("/contact")}
            className="
              group
              hover:bg-sky-500
              hover:text-white
              hover:scale-105
              hover:shadow-[0_0_25px_rgba(14,165,233,0.25)]
            "
          >
            Get in Touch

            <ArrowRight
              size={18}
              style={{
                transition: "transform 0.3s ease",
              }}
              className="group-hover:translate-x-1.5"
            />
          </motion.button>

        </motion.div>
      </div>
    </section>
  );
}