import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import ProjectModal from "./ProjectModal";
import { getProjects } from "../../api/projects";

const categories = [
  "All",
  "GIS",
  "IT",
  "AI/ML",
  "IoT",
  "Cloud",
  "Cybersecurity",
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();

        setProjects(
          data.filter((project) => project.is_active !== false)
        );
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      activeCategory === "All" ||
      project.category === activeCategory;

    const matchesSearch =
      project.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getTechnologies = (project) => {
    if (!project.technologies) {
      return [];
    }

    if (Array.isArray(project.technologies)) {
      return project.technologies;
    }

    try {
      return JSON.parse(project.technologies);
    } catch {
      return [];
    }
  };

  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${import.meta.env.VITE_API_URL}${image}`;
  };

  return (
    <section
      id="portfolio-section"
      style={{
        backgroundColor: "#ffffff",
        padding: "96px 0",
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
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >

        {/* HEADER */}

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
            PORTFOLIO
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
            Featured Projects
          </h2>

          <p
            style={{
              fontSize: "1rem",
              color: "#64748b",
              lineHeight: "1.6",
              margin: 0,
            }}
          >
            Explore our latest work across GIS, IT, AI, IoT,
            Cloud and Cybersecurity.
          </p>
        </div>

        {/* SEARCH */}

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: "36rem",
              height: "52px",
              borderRadius: "9999px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              padding: "0 20px",
              boxSizing: "border-box",
              boxShadow: "0 4px 20px rgba(15,23,42,0.04)",
            }}
          >
            <Search
              size={18}
              style={{
                color: "#94a3b8",
                marginRight: "12px",
                flexShrink: 0,
              }}
            />

            <input
              type="text"
              name="project-search"
              placeholder="Search Projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "1rem",
                color: "#0f172a",
              }}
            />
          </div>
        </div>

        {/* CATEGORY FILTER */}

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
              onClick={() => setActiveCategory(category)}
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

        {/* STATISTICS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "72px",
            width: "100%",
            maxWidth: "75rem",
            boxSizing: "border-box",
          }}
        >
          <div style={statCardStyle}>
            <h3 style={statNumberStyle}>250+</h3>
            <p style={statLabelStyle}>Projects Delivered</p>
          </div>

          <div style={statCardStyle}>
            <h3 style={statNumberStyle}>50+</h3>
            <p style={statLabelStyle}>Enterprise Clients</p>
          </div>

          <div style={statCardStyle}>
            <h3 style={statNumberStyle}>15+</h3>
            <p style={statLabelStyle}>States Covered</p>
          </div>

          <div style={statCardStyle}>
            <h3 style={statNumberStyle}>99%</h3>
            <p style={statLabelStyle}>Client Satisfaction</p>
          </div>
        </div>

        {/* LOADING */}

        {loading && (
          <div
            style={{
              color: "#64748b",
              padding: "60px 0",
              textAlign: "center",
            }}
          >
            Loading projects...
          </div>
        )}

        {/* EMPTY */}

        {!loading && filteredProjects.length === 0 && (
          <div
            style={{
              color: "#64748b",
              padding: "60px 0",
              textAlign: "center",
            }}
          >
            No projects found.
          </div>
        )}

        {/* PROJECTS GRID */}

        {!loading && filteredProjects.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(360px, 1fr))",
              gap: "36px",
              width: "100%",
              maxWidth: "75rem",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
          >
            {filteredProjects.map((project) => {
              const technologies =
                getTechnologies(project);

              const imageUrl =
                getImageUrl(project.image);

              return (
                <div
                  key={project.id}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "32px",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    boxSizing: "border-box",
                    transition: "all 0.4s ease",
                    boxShadow:
                      "0 10px 35px rgba(15,23,42,0.06)",
                  }}
                >

                  {/* IMAGE */}

                  <div
                    style={{
                      position: "relative",
                      height: "220px",
                      width: "100%",
                      overflow: "hidden",
                      backgroundColor: "#f1f5f9",
                      flexShrink: 0,
                    }}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={project.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#94a3b8",
                        }}
                      >
                        No Image
                      </div>
                    )}

                    {/* IMAGE FADE */}

                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0.05) 65%, transparent)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>

                  {/* CONTENT */}

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      padding: "36px",
                      boxSizing: "border-box",
                      width: "100%",
                    }}
                  >

                    {/* CATEGORY */}

                    <span
                      style={{
                        display: "inline-block",
                        alignSelf: "flex-start",
                        borderRadius: "9999px",
                        border:
                          "1px solid rgba(56,189,248,0.3)",
                        backgroundColor:
                          "rgba(56,189,248,0.08)",
                        padding: "4px 14px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "#0284c7",
                        marginBottom: "18px",
                      }}
                    >
                      {project.category}
                    </span>

                    {/* TITLE */}

                    <h3
                      style={{
                        fontSize: "1.75rem",
                        fontWeight: "700",
                        color: "#0f172a",
                        letterSpacing: "-0.025em",
                        marginBottom: "12px",
                        lineHeight: "1.25",
                      }}
                    >
                      {project.title}
                    </h3>

                    {/* DESCRIPTION */}

                    <p
                      style={{
                        color: "#64748b",
                        fontSize: "1rem",
                        lineHeight: "1.6",
                        marginBottom: "24px",
                        flex: 1,
                      }}
                    >
                      {project.description}
                    </p>

                    {/* TECHNOLOGIES */}

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginBottom: "28px",
                      }}
                    >
                      {technologies.map((tech) => (
                        <span
                          key={tech}
                          style={{
                            borderRadius: "9999px",
                            border: "1px solid #e2e8f0",
                            backgroundColor: "#f8fafc",
                            padding: "4px 12px",
                            fontSize: "0.75rem",
                            color: "#475569",
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* VIEW DETAILS */}

                    <div
                      style={{
                        paddingTop: "20px",
                        marginTop: "auto",
                        borderTop:
                          "1px solid #e2e8f0",
                        width: "100%",
                      }}
                    >
                      <button
                        onClick={() =>
                          setSelectedProject(project)
                        }
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "#0284c7",
                          fontWeight: "700",
                          fontSize: "1rem",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        View Details →
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* PROJECT MODAL */}

      <ProjectModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />

    </section>
  );
}

/* STATISTICS CARD */

const statCardStyle = {
  borderRadius: "24px",
  border: "1px solid #e2e8f0",
  backgroundColor: "#ffffff",
  padding: "24px 20px",
  textAlign: "center",
  boxShadow:
    "0 8px 30px rgba(15,23,42,0.05)",
};

/* STATISTIC NUMBER */

const statNumberStyle = {
  fontSize: "2.25rem",
  fontWeight: "800",
  color: "#0ea5e9",
  marginBottom: "6px",
};

/* STATISTIC LABEL */

const statLabelStyle = {
  color: "#64748b",
  fontSize: "0.875rem",
};