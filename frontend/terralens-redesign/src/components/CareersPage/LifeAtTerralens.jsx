import { motion } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
  Users,
  Rocket,
} from "lucide-react";

export default function LifeAtTerralens() {
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
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "64px",
          alignItems: "stretch",
          boxSizing: "border-box",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              marginTop: "auto",
              position: "relative",
              width: "100%",
              paddingBottom: "24px",
            }}
          >
            <div
              style={{
                position: "relative",
                height: "480px",
                width: "100%",
                borderRadius: "32px",
                overflow: "hidden",
                backgroundColor: "#f8fafc",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop"
                alt="Life at TerraLens"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Floating Card */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: "-12px",
                width: "260px",
                borderRadius: "24px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
                padding: "28px",
                boxShadow: "0 20px 60px rgba(15,23,42,0.12)",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  backgroundColor: "rgba(56, 189, 248, 0.1)",
                  border: "1px solid rgba(56, 189, 248, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <Rocket className="text-sky-400" size={22} />
              </div>

              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  color: "#0f172a",
                  marginBottom: "8px",
                }}
              >
                Innovation Everyday
              </h3>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.875rem",
                  lineHeight: "1.6",
                }}
              >
                Building tomorrow's technology.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
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
            LIFE AT TERRALENS
          </p>

          <h2
            style={{
              fontSize: "clamp(2.25rem, 3.5vw, 3rem)",
              fontWeight: "800",
              color: "#0f172a",
              lineHeight: "1.2",
              letterSpacing: "-0.025em",
              marginBottom: "24px",
            }}
          >
            A Place Where
            <span
              style={{
                display: "block",
                color: "#0ea5e9",
              }}
            >
              Great Ideas Grow
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
            At TerraLens, we foster a collaborative culture where
            engineers, GIS specialists, AI researchers and innovators
            work together to create impactful solutions for governments,
            enterprises and communities.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginBottom: "40px",
            }}
          >
            {[
              "Collaborative & Inclusive Environment",
              "Latest GIS, AI & Cloud Technologies",
              "Continuous Learning & Knowledge Sharing",
              "Projects That Create Real Impact",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <CheckCircle2
                  className="text-sky-400"
                  size={20}
                  style={{ flexShrink: 0 }}
                />

                <span
                  style={{
                    color: "#334155",
                    fontSize: "1rem",
                    fontWeight: "500",
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              marginTop: "auto",
            }}
          >
            {/* Teamwork */}
            <div
              style={{
                borderRadius: "24px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
                padding: "28px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 10px 40px rgba(15,23,42,0.05)",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  backgroundColor: "rgba(56, 189, 248, 0.1)",
                  border: "1px solid rgba(56, 189, 248, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <Users className="text-sky-400" size={22} />
              </div>

              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  color: "#0f172a",
                  marginBottom: "8px",
                }}
              >
                Teamwork
              </h3>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.875rem",
                  lineHeight: "1.6",
                }}
              >
                Collaboration drives everything we build.
              </p>
            </div>

            {/* Innovation */}
            <div
              style={{
                borderRadius: "24px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
                padding: "28px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 10px 40px rgba(15,23,42,0.05)",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  backgroundColor: "rgba(56, 189, 248, 0.1)",
                  border: "1px solid rgba(56, 189, 248, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <Sparkles className="text-sky-400" size={22} />
              </div>

              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  color: "#0f172a",
                  marginBottom: "8px",
                }}
              >
                Innovation
              </h3>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.875rem",
                  lineHeight: "1.6",
                }}
              >
                We constantly explore new technologies.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}