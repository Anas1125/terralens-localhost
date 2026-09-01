import { motion } from "framer-motion";
import {
  Lightbulb,
  TrendingUp,
  Users,
  Globe2,
} from "lucide-react";

const features = [
  {
    icon: Lightbulb,
    title: "Innovation First",
    description:
      "Work with modern GIS, AI, cloud and enterprise technologies to solve real-world problems.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description:
      "Grow your skills through challenging projects, mentorship and continuous learning.",
  },
  {
    icon: Users,
    title: "Collaborative Culture",
    description:
      "Work alongside talented engineers, GIS specialists and researchers in a supportive environment.",
  },
  {
    icon: Globe2,
    title: "Real Impact",
    description:
      "Build products and solutions used by governments, enterprises and organizations worldwide.",
  },
];

export default function WhyJoin() {
  return (
    <section
      id="why-join"
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
            WHY JOIN US
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
            More Than Just A Workplace
          </h2>

          <p
            style={{
              fontSize: "1rem",
              color: "#64748b",
              lineHeight: "1.6",
            }}
          >
            At TerraLens, we believe innovation happens
            when passionate people work together to solve
            meaningful challenges.
          </p>
        </div>

        {/* Cards Grid */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "32px",
            width: "100%",
            maxWidth: "75rem",
            justifyContent: "center",
            boxSizing: "border-box",
          }}
        >
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.05,
                  borderColor: "#7dd3fc",
                  boxShadow:
                    "0 20px 60px rgba(14,165,233,0.10)",
                }}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "32px",
                  padding: "36px",
                  display: "flex",
                  flexDirection: "column",
                  boxSizing: "border-box",
                  transition:
                    "border-color 0.5s ease, box-shadow 0.5s ease",
                }}
              >

                {/* Icon */}

                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "20px",
                    backgroundColor:
                      "rgba(56, 189, 248, 0.1)",
                    border:
                      "1px solid rgba(56, 189, 248, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon
                    className="text-sky-400"
                    size={26}
                  />
                </div>

                {/* Title */}

                <h3
                  style={{
                    marginTop: "28px",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#0f172a",
                    letterSpacing: "-0.025em",
                  }}
                >
                  {item.title}
                </h3>

                {/* Description */}

                <p
                  style={{
                    marginTop: "16px",
                    color: "#64748b",
                    fontSize: "1rem",
                    lineHeight: "1.6",
                    flex: 1,
                  }}
                >
                  {item.description}
                </p>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}