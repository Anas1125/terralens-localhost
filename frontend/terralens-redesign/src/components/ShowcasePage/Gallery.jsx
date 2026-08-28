import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../../api/client";

export default function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD GALLERY FROM BACKEND
  // =====================================================

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const { data } = await api.get("/gallery/");
        setGallery(data);
      } catch (error) {
        console.error("Failed to load gallery:", error);
        setGallery([]);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `${import.meta.env.VITE_API_URL}${image}`;
  };

  // =====================================================
  // DYNAMIC CATEGORIES
  // =====================================================

  const categories = [
    "All",
    ...new Set(
      gallery
        .map((item) => item.category)
        .filter(Boolean)
    ),
  ];

  // =====================================================
  // FILTER GALLERY
  // =====================================================

  const filteredGallery =
    activeCategory === "All"
      ? gallery
      : gallery.filter(
          (item) => item.category === activeCategory
        );

  // =====================================================
  // CURRENT IMAGE INDEX
  // =====================================================

  const currentIndex = filteredGallery.findIndex(
    (item) => item.id === selectedImage?.id
  );

  // =====================================================
  // PREVIOUS
  // =====================================================

  const showPrevious = (e) => {
    e.stopPropagation();

    if (currentIndex > 0) {
      setSelectedImage(
        filteredGallery[currentIndex - 1]
      );
    }
  };

  // =====================================================
  // NEXT
  // =====================================================

  const showNext = (e) => {
    e.stopPropagation();

    if (
      currentIndex < filteredGallery.length - 1
    ) {
      setSelectedImage(
        filteredGallery[currentIndex + 1]
      );
    }
  };

  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        padding: "96px 0",
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
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "48px",
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
            GALLERY
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
            Our Moments
          </h2>

          <p
            style={{
              fontSize: "1rem",
              color: "#64748b",
              lineHeight: "1.6",
              margin: 0,
            }}
          >
            A glimpse into our workspace, fieldwork,
            events and the projects that drive us.
          </p>
        </div>

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && (
          <div
            style={{
              padding: "60px 0",
              color: "#64748b",
              fontSize: "1rem",
            }}
          >
            Loading gallery...
          </div>
        )}

        {/* =====================================================
            CATEGORY FILTER
        ===================================================== */}

        {!loading && gallery.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              marginBottom: "64px",
              width: "100%",
              maxWidth: "52rem",
              boxSizing: "border-box",
            }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setActiveCategory(category)
                }
                style={{
                  padding: "8px 20px",
                  borderRadius: "9999px",
                  fontWeight: "600",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",

                  border:
                    activeCategory === category
                      ? "1px solid #0ea5e9"
                      : "1px solid #e2e8f0",

                  backgroundColor:
                    activeCategory === category
                      ? "#0ea5e9"
                      : "#ffffff",

                  color:
                    activeCategory === category
                      ? "#ffffff"
                      : "#64748b",

                  boxShadow:
                    activeCategory === category
                      ? "0 0 20px rgba(56,189,248,0.2)"
                      : "0 2px 10px rgba(15,23,42,0.03)",
                }}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {!loading && gallery.length === 0 && (
          <div
            style={{
              padding: "60px 0",
              textAlign: "center",
              color: "#94a3b8",
              fontSize: "1rem",
            }}
          >
            No gallery items available at the moment.
          </div>
        )}

        {/* =====================================================
            GALLERY GRID
        ===================================================== */}

        {!loading && filteredGallery.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "42px 32px",
              width: "100%",
              maxWidth: "75rem",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
          >
            {filteredGallery.map((item, index) => (
              <motion.div
                key={item.id}
                onClick={() => setSelectedImage(item)}
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
                  y: -6,
                }}
                style={{
                  width: "100%",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                {/* =================================================
                    IMAGE
                ================================================= */}

                <div
                  style={{
                    height: "300px",
                    width: "100%",
                    overflow: "hidden",
                    borderRadius: "28px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#f8fafc",
                    boxShadow:
                      "0 10px 35px rgba(15,23,42,0.06)",
                  }}
                >
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition:
                        "transform 0.7s ease",
                    }}
                  />
                </div>

                {/* =================================================
                    CARD CONTENT
                ================================================= */}

                <div
                  style={{
                    padding: "16px 12px 0",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      borderRadius: "9999px",
                      backgroundColor: "#0ea5e9",
                      padding: "4px 12px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "#ffffff",
                      marginBottom: "10px",
                    }}
                  >
                    {item.category}
                  </span>

                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "700",
                      color: "#0f172a",
                      margin: 0,
                      lineHeight: "1.35",
                    }}
                  >
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================
          LIGHTBOX
      ========================================================= */}

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() =>
              setSelectedImage(null)
            }
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              backgroundColor:
                "rgba(15,23,42,0.75)",
              backdropFilter: "blur(16px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
              boxSizing: "border-box",
            }}
          >
            <motion.div
              initial={{
                scale: 0.9,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              style={{
                position: "relative",
                maxWidth: "60rem",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* =================================================
                  CLOSE BUTTON
              ================================================= */}

              <button
                onClick={() =>
                  setSelectedImage(null)
                }
                style={{
                  position: "absolute",
                  top: "-20px",
                  right: "-20px",
                  zIndex: 30,
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  border:
                    "1px solid #e2e8f0",
                  color: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition:
                    "all 0.3s ease",
                  boxShadow:
                    "0 10px 30px rgba(15,23,42,0.15)",
                }}
              >
                <X size={20} />
              </button>

              {/* =================================================
                  PREVIOUS BUTTON
              ================================================= */}

              <button
                onClick={showPrevious}
                disabled={currentIndex === 0}
                style={{
                  position: "absolute",
                  left: "-20px",
                  top: "40%",
                  transform:
                    "translateY(-50%)",
                  zIndex: 30,
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  border:
                    "1px solid #e2e8f0",
                  color: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor:
                    currentIndex === 0
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    currentIndex === 0
                      ? 0.3
                      : 1,
                  transition:
                    "all 0.3s ease",
                  boxShadow:
                    "0 10px 30px rgba(15,23,42,0.15)",
                }}
              >
                <ChevronLeft size={24} />
              </button>

              {/* =================================================
                  NEXT BUTTON
              ================================================= */}

              <button
                onClick={showNext}
                disabled={
                  currentIndex ===
                  filteredGallery.length - 1
                }
                style={{
                  position: "absolute",
                  right: "-20px",
                  top: "40%",
                  transform:
                    "translateY(-50%)",
                  zIndex: 30,
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  border:
                    "1px solid #e2e8f0",
                  color: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor:
                    currentIndex ===
                    filteredGallery.length - 1
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    currentIndex ===
                    filteredGallery.length - 1
                      ? 0.3
                      : 1,
                  transition:
                    "all 0.3s ease",
                  boxShadow:
                    "0 10px 30px rgba(15,23,42,0.15)",
                }}
              >
                <ChevronRight size={24} />
              </button>

              {/* =================================================
                  IMAGE
              ================================================= */}

              <img
                src={getImageUrl(
                  selectedImage.image
                )}
                alt={selectedImage.title}
                style={{
                  width: "100%",
                  maxHeight: "75vh",
                  objectFit: "contain",
                  borderRadius: "24px",
                  backgroundColor: "#ffffff",
                }}
              />

              {/* =================================================
                  CAPTION
              ================================================= */}

              <div
                style={{
                  marginTop: "24px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    color: "#0ea5e9",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "4px",
                    fontWeight: "700",
                  }}
                >
                  {selectedImage.category}
                </span>

                <h2
                  style={{
                    marginTop: "8px",
                    fontSize: "1.75rem",
                    fontWeight: "800",
                    color: "#ffffff",
                  }}
                >
                  {selectedImage.title}
                </h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}