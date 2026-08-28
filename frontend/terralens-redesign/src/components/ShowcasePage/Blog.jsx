import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import BlogModal from "./BlogModal";
import { ArrowRight } from "lucide-react";
import { getBlogs } from "../../api/blog";

export default function Blog() {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await getBlogs();

        // Only show active blogs
        const activeBlogs = data.filter(
          (blog) => blog.is_active !== false
        );

        setBlogs(activeBlogs);
      } catch (error) {
        console.error(
          "Failed to load blogs:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

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
            BLOG & INSIGHTS
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
            Thought Leadership
          </h2>

          <p
            style={{
              fontSize: "1rem",
              color: "#64748b",
              lineHeight: "1.6",
            }}
          >
            Insights, tutorials and perspectives from the
            TerraLens team on GIS, IT and emerging technologies.
          </p>
        </div>

        {/* Loading */}

        {loading && (
          <p
            style={{
              color: "#64748b",
              fontSize: "1rem",
            }}
          >
            Loading blogs...
          </p>
        )}

        {/* No Blogs */}

        {!loading && blogs.length === 0 && (
          <p
            style={{
              color: "#64748b",
              fontSize: "1rem",
            }}
          >
            No blog posts available.
          </p>
        )}

        {/* Blog Grid */}

        {!loading && blogs.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "36px",
              width: "100%",
              maxWidth: "75rem",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
          >
            {blogs.map((blog, index) => {

              const imageUrl =
                blog.image?.startsWith("http")
                  ? blog.image
                  : `${import.meta.env.VITE_API_URL}${blog.image}`;

              return (
                <motion.div
                  key={blog.id}
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
                  className="group"
                  style={{
                    backgroundColor: "#ffffff",
                    border:
                      "1px solid #e2e8f0",
                    borderRadius: "32px",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    boxSizing: "border-box",
                    transition:
                      "all 0.4s ease",
                    boxShadow:
                      "0 10px 35px rgba(15,23,42,0.06)",
                  }}
                >

                  {/* Image */}

                  <div
                    style={{
                      position: "relative",
                      height: "240px",
                      width: "100%",
                      overflow: "hidden",
                      backgroundColor:
                        "#f8fafc",
                      flexShrink: 0,
                    }}
                  >
                    {blog.image && (
                      <img
                        src={imageUrl}
                        alt={blog.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition:
                            "transform 0.7s ease",
                        }}
                        className="group-hover:scale-110"
                      />
                    )}
                  </div>

                  {/* Content */}

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

                    {/* Category + Date */}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "space-between",
                        width: "100%",
                        marginBottom: "18px",
                      }}
                    >
                      <span
                        style={{
                          borderRadius:
                            "9999px",
                          border:
                            "1px solid rgba(56,189,248,0.3)",
                          backgroundColor:
                            "rgba(56,189,248,0.08)",
                          padding:
                            "4px 14px",
                          fontSize:
                            "0.75rem",
                          fontWeight: "600",
                          color: "#0284c7",
                        }}
                      >
                        {blog.category}
                      </span>

                      <span
                        style={{
                          fontSize:
                            "0.875rem",
                          color: "#64748b",
                        }}
                      >
                        {blog.date}
                      </span>
                    </div>

                    {/* Title */}

                    <h3
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "#0f172a",
                        letterSpacing:
                          "-0.025em",
                        marginBottom:
                          "16px",
                        lineHeight: "1.3",
                      }}
                    >
                      {blog.title}
                    </h3>

                    {/* Excerpt */}

                    <p
                      style={{
                        color: "#64748b",
                        fontSize: "1rem",
                        lineHeight: "1.6",
                        marginBottom:
                          "28px",
                        flex: 1,
                      }}
                    >
                      {blog.excerpt}
                    </p>

                    {/* Read More */}

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
                          setSelectedBlog({
                            ...blog,
                            readTime:
                              blog.read_time ||
                              blog.readTime ||
                              "",
                          })
                        }
                        style={{
                          display:
                            "inline-flex",
                          alignItems:
                            "center",
                          gap: "8px",
                          color: "#0284c7",
                          fontWeight: "700",
                          fontSize: "1rem",
                          background:
                            "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        Read More

                        <ArrowRight
                          size={18}
                          style={{
                            transition:
                              "transform 0.3s ease",
                          }}
                          className="group-hover:translate-x-1"
                        />
                      </button>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* Blog Modal */}

      <BlogModal
        blog={selectedBlog}
        isOpen={
          selectedBlog !== null
        }
        onClose={() =>
          setSelectedBlog(null)
        }
      />

    </section>
  );
}