import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Do you hire fresh graduates?",
    answer:
      "Yes. Depending on our business needs, we welcome applications from fresh graduates who are passionate about GIS, software development, AI, and emerging technologies.",
  },
  {
    question: "Can I submit my resume even if there are no openings?",
    answer:
      "Absolutely. You can share your resume with us, and we'll keep it on file for future opportunities that match your skills and experience.",
  },
  {
    question: "Do you offer remote or hybrid work?",
    answer:
      "Work arrangements depend on the role and project requirements. Some positions may offer hybrid or remote flexibility.",
  },
  {
    question: "How will I know when new positions are available?",
    answer:
      "New opportunities will be published on this Careers page as soon as they become available. We recommend checking back periodically.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        padding: "26px 0px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "64rem",
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
            FAQ
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
            Frequently Asked Questions
          </h2>

          <p
            style={{
              fontSize: "1rem",
              color: "#64748b",
              lineHeight: "1.6",
            }}
          >
            Find answers to the most common questions about careers
            and opportunities at TerraLens.
          </p>
        </div>

        {/* Accordion Container */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            boxSizing: "border-box",
          }}
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                style={{
                  borderRadius: "24px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                  overflow: "hidden",
                  boxSizing: "border-box",
                  transition: "all 0.3s ease",
                  boxShadow: isOpen
                    ? "0 10px 35px rgba(15,23,42,0.06)"
                    : "0 4px 20px rgba(15,23,42,0.03)",
                }}
                className="hover:border-sky-300"
              >
                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? -1 : index)
                  }
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "24px 32px",
                    textAlign: "left",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "#0f172a",
                      flex: 1,
                      paddingRight: "16px",
                      margin: 0,
                    }}
                  >
                    {faq.question}
                  </h3>

                  <div
                    style={{
                      flexShrink: 0,
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: isOpen
                        ? "rgba(14,165,233,0.1)"
                        : "#f8fafc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {isOpen ? (
                      <Minus
                        className="text-sky-500"
                        size={20}
                      />
                    ) : (
                      <Plus
                        className="text-slate-500"
                        size={20}
                      />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                    >
                      <p
                        style={{
                          padding: "0 32px 28px 32px",
                          color: "#64748b",
                          fontSize: "1rem",
                          lineHeight: "1.7",
                          boxSizing: "border-box",
                          margin: 0,
                        }}
                      >
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}