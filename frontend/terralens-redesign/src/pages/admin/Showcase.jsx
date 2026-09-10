import { useEffect, useState } from "react";

import { uploadFile } from "../../api/media";
import MediaPicker from "../../components/admin/common/MediaPicker";
import { useToast } from "../../components/admin/ToastProvider";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../api/projects";

import {
  getGallery,
  createGallery,
  updateGallery,
  deleteGallery,
} from "../../api/gallery";

import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../../api/blog";


export default function Showcase() {

  const { showToast } = useToast();
  // =====================================================
  // SHOWCASE SECTION
  // =====================================================

  const [showcaseSection, setShowcaseSection] =
    useState("projects");


  // =====================================================
  // PROJECT STATE
  // =====================================================

  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);


  // =====================================================
  // GALLERY STATE
  // =====================================================

  const [gallery, setGallery] = useState([]);
  const [editingGalleryId, setEditingGalleryId] =
    useState(null);

  // =====================================================
  // Blog STATE
  // =====================================================

  const [blogs, setBlogs] = useState([]);
  const [editingBlogId, setEditingBlogId] =
    useState(null);

  // =====================================================
  // GENERAL STATE
  // =====================================================

  const [loading, setLoading] = useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [galleryUploadingImage, setGalleryUploadingImage] =
    useState(false);


  // =====================================================
  // MEDIA PICKERS
  // =====================================================

  const [mediaPickerOpen, setMediaPickerOpen] =
    useState(false);

  const [galleryMediaPickerOpen, setGalleryMediaPickerOpen] =
    useState(false);


  // =====================================================
  // PROJECT FORM
  // =====================================================

  const [form, setForm] = useState({
    category: "",
    title: "",
    subtitle: "",
    client: "",
    location: "",
    year: "",
    duration: "",
    team: "",
    description: "",
    challenge: "",
    solution: "",
    results: [],
    technologies: [],
    image: "",
    is_active: true,
  });


  // =====================================================
  // GALLERY FORM
  // =====================================================

  const [galleryForm, setGalleryForm] = useState({
    title: "",
    category: "",
    image: "",
    is_active: true,
  });

  // =====================================================
  // BLOG FORM
  // =====================================================

  const [blogForm, setBlogForm] = useState({
    category: "",
    date: "",
    author: "",
    read_time: "",
    title: "",
    excerpt: "",
    content: "",
    image: "",
    is_active: true,
  });

  const [blogUploadingImage, setBlogUploadingImage] =
    useState(false);

  const [blogMediaPickerOpen, setBlogMediaPickerOpen] =
    useState(false);


  // =====================================================
  // LOAD PROJECTS
  // =====================================================

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error(
        "Failed to load projects:",
        error
      );
    }
  };


  // =====================================================
  // LOAD GALLERY
  // =====================================================

  const loadGallery = async () => {
    try {
      const data = await getGallery();
      setGallery(data);
    } catch (error) {
      console.error(
        "Failed to load gallery:",
        error
      );
    }
  };

  // =====================================================
  // LOAD BLOGS
  // =====================================================

  const loadBlogs = async () => {
    try {
      const data = await getBlogs();
      setBlogs(data);
    } catch (error) {
      console.error(
        "Failed to load blogs:",
        error
      );
    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadProjects();
    loadGallery();
    loadBlogs();
  }, []);


  // =====================================================
  // PROJECT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };


  // =====================================================
  // GALLERY CHANGE
  // =====================================================

  const handleGalleryChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setGalleryForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =====================================================
  // BLOG CHANGE
  // =====================================================

  const handleBlogChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setBlogForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };


  // =====================================================
  // PROJECT IMAGE UPLOAD
  // =====================================================

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploadingImage(true);

      const data = await uploadFile(
        "showcase",
        file
      );

      setForm((prev) => ({
        ...prev,
        image: data.path,
      }));
    } catch (error) {
      console.error(
        "Failed to upload project image:",
        error
      );

      showToast("Failed to upload project image.", "error");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };


  // =====================================================
  // GALLERY IMAGE UPLOAD
  // =====================================================

  const handleGalleryImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setGalleryUploadingImage(true);

      const data = await uploadFile(
        "showcase",
        file
      );

      setGalleryForm((prev) => ({
        ...prev,
        image: data.path,
      }));
    } catch (error) {
      console.error(
        "Failed to upload gallery image:",
        error
      );

      showToast("Failed to upload gallery image.", "error");
    } finally {
      setGalleryUploadingImage(false);
      e.target.value = "";
    }
  };

  // =====================================================
  // BLOG IMAGE UPLOAD
  // =====================================================

  const handleBlogImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setBlogUploadingImage(true);

      const data = await uploadFile(
        "showcase",
        file
      );

      setBlogForm((prev) => ({
        ...prev,
        image: data.path,
      }));
    } catch (error) {
      console.error(
        "Failed to upload blog image:",
        error
      );

      showToast("Failed to upload blog image.", "error");
    } finally {
      setBlogUploadingImage(false);
      e.target.value = "";
    }
  };


  // =====================================================
  // RESET PROJECT FORM
  // =====================================================

  const resetForm = () => {
    setForm({
      category: "",
      title: "",
      subtitle: "",
      client: "",
      location: "",
      year: "",
      duration: "",
      team: "",
      description: "",
      challenge: "",
      solution: "",
      results: [],
      technologies: [],
      image: "",
      is_active: true,
    });

    setEditingId(null);
  };


  // =====================================================
  // RESET GALLERY FORM
  // =====================================================

  const resetGalleryForm = () => {
    setGalleryForm({
      title: "",
      category: "",
      image: "",
      is_active: true,
    });

    setEditingGalleryId(null);
  };

  // =====================================================
  // RESET BLOG FORM
  // =====================================================

  const resetBlogForm = () => {
    setBlogForm({
      category: "",
      date: "",
      author: "",
      read_time: "",
      title: "",
      excerpt: "",
      content: "",
      image: "",
      is_active: true,
    });

    setEditingBlogId(null);
  };


  // =====================================================
  // SAVE PROJECT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...form,
        results: JSON.stringify(
          form.results
        ),
        technologies: JSON.stringify(
          form.technologies
        ),
      };

      if (editingId) {
        await updateProject(
          editingId,
          payload
        );
      } else {
        await createProject(payload);
      }

      resetForm();
      await loadProjects();

    } catch (error) {
      console.error(
        "Failed to save project:",
        error
      );

      showToast("Failed to save project.", "error");
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // SAVE GALLERY
  // =====================================================

  const handleGallerySubmit = async (e) => {
    e.preventDefault();

    if (!galleryForm.image) {
      showToast("Please select a gallery image.", "warning");

      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: galleryForm.title,
        category: galleryForm.category,
        image: galleryForm.image,
        is_active:
          galleryForm.is_active,
      };

      if (editingGalleryId) {
        await updateGallery(
          editingGalleryId,
          payload
        );
      } else {
        await createGallery(payload);
      }

      resetGalleryForm();
      await loadGallery();

    } catch (error) {
      console.error(
        "Failed to save gallery item:",
        error
      );

      showToast("Failed to save gallery item.", "error");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SAVE BLOG
  // =====================================================

  const handleBlogSubmit = async (e) => {
    e.preventDefault();

    if (!blogForm.image) {
      showToast("Please select a blog image.", "warning");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        category: blogForm.category,
        date: blogForm.date,
        author: blogForm.author,
        read_time: blogForm.read_time,
        title: blogForm.title,
        excerpt: blogForm.excerpt,
        content: blogForm.content,
        image: blogForm.image,
        is_active: blogForm.is_active,
      };

      if (editingBlogId) {
        await updateBlog(
          editingBlogId,
          payload
        );
      } else {
        await createBlog(payload);
      }

      resetBlogForm();
      await loadBlogs();
    } catch (error) {
      console.error(
        "Failed to save blog:",
        error
      );

      showToast("Failed to save blog.", "error");
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // EDIT PROJECT
  // =====================================================

  const handleEdit = (project) => {
    setShowcaseSection("projects");

    setEditingId(project.id);

    setForm({
      category:
        project.category || "",

      title:
        project.title || "",

      subtitle:
        project.subtitle || "",

      client:
        project.client || "",

      location:
        project.location || "",

      year:
        project.year || "",

      duration:
        project.duration || "",

      team:
        project.team || "",

      description:
        project.description || "",

      challenge:
        project.challenge || "",

      solution:
        project.solution || "",

      results:
        project.results
          ? typeof project.results ===
            "string"
            ? JSON.parse(
                project.results
              )
            : project.results
          : [],

      technologies:
        project.technologies
          ? typeof project.technologies ===
            "string"
            ? JSON.parse(
                project.technologies
              )
            : project.technologies
          : [],

      image:
        project.image || "",

      is_active:
        project.is_active ?? true,
    });

    document.querySelector(".admin-main")?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // =====================================================
  // EDIT GALLERY
  // =====================================================

  const handleGalleryEdit = (item) => {
    setShowcaseSection("gallery");

    setEditingGalleryId(item.id);

    setGalleryForm({
      title:
        item.title || "",

      category:
        item.category || "",

      image:
        item.image || "",

      is_active:
        item.is_active ?? true,
    });

    document.querySelector(".admin-main")?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // EDIT BLOG
  // =====================================================

  const handleBlogEdit = (blog) => {
    setShowcaseSection("blog");

    setEditingBlogId(blog.id);

    setBlogForm({
      category: blog.category || "",
      date: blog.date || "",
      author: blog.author || "",
      read_time:
        blog.read_time ||
        blog.readTime ||
        "",
      title: blog.title || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      image: blog.image || "",
      is_active:
        blog.is_active ?? true,
    });

    document.querySelector(".admin-main")?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // =====================================================
  // DELETE PROJECT
  // =====================================================

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this project?"
      )
    ) {
      return;
    }

    try {
      await deleteProject(id);
      await loadProjects();

    } catch (error) {
      console.error(
        "Failed to delete project:",
        error
      );

      showToast("Failed to delete project.", "error");
    }
  };


  // =====================================================
  // DELETE GALLERY
  // =====================================================

  const handleGalleryDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this gallery item?"
      )
    ) {
      return;
    }

    try {
      await deleteGallery(id);
      await loadGallery();

    } catch (error) {
      console.error(
        "Failed to delete gallery item:",
        error
      );

      showToast("Failed to delete gallery item.", "error");
    }
  };

  // =====================================================
  // DELETE BLOG
  // =====================================================

  const handleBlogDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this blog post?"
      )
    ) {
      return;
    }

    try {
      await deleteBlog(id);
      await loadBlogs();
    } catch (error) {
      console.error(
        "Failed to delete blog:",
        error
      );

      showToast("Failed to delete blog.", "error");
    }
  };


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
  // RENDER
  // =====================================================

  return (
    <div
      style={{
        color: "#0f172a",
        paddingBottom: "60px",
      }}
    >

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "8px",
        }}
      >
        Showcase
      </h1>

      <p
        style={{
          color: "#64748b",
          marginBottom: "25px",
        }}
      >
        Create and manage the content
        displayed in the Showcase section.
      </p>


      {/* =================================================
          SHOWCASE TABS
      ================================================= */}

      <div
        style={{
          display: "flex",
          gap: "6px",
          background: "#ffffff",
          padding: "6px",
          borderRadius: "14px",
          border: "1px solid #e2e8f0",
          marginBottom: "30px",
          width: "fit-content",
        }}
      >

        {/* PROJECTS */}

        <button
          type="button"
          onClick={() =>
            setShowcaseSection("projects")
          }
          style={{
            ...tabButtonStyle,
            background:
              showcaseSection === "projects"
                ? "#0ea5e9"
                : "transparent",
            color:
              showcaseSection === "projects"
                ? "#ffffff"
                : "#64748b",
          }}
        >
          Projects
        </button>


        {/* GALLERY */}

        <button
          type="button"
          onClick={() =>
            setShowcaseSection("gallery")
          }
          style={{
            ...tabButtonStyle,
            background:
              showcaseSection === "gallery"
                ? "#0ea5e9"
                : "transparent",
            color:
              showcaseSection === "gallery"
                ? "#ffffff"
                : "#64748b",
          }}
        >
          Gallery
        </button>


        {/* BLOG */}

        <button
          type="button"
          onClick={() =>
            setShowcaseSection("blog")
          }
          style={{
            ...tabButtonStyle,
            background:
              showcaseSection === "blog"
                ? "#0ea5e9"
                : "transparent",
            color:
              showcaseSection === "blog"
                ? "#ffffff"
                : "#64748b",
          }}
        >
          Blog
        </button>

      </div>


      {/* =================================================
          PROJECTS SECTION
      ================================================= */}

      {showcaseSection === "projects" && (
        <>

          {/* PROJECT FORM */}

          <div
            style={sectionStyle}
          >

            <h2
              style={{
                fontSize: "20px",
                marginBottom: "25px",
              }}
            >
              {editingId
                ? "Edit Project"
                : "Add Project"}
            </h2>


            <form
              onSubmit={handleSubmit}
            >

              <h3
                style={{
                  marginBottom: "20px",
                }}
              >
                Basic Information
              </h3>


              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Project Title"
                required
                style={inputStyle}
              />


              <input
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
                placeholder="Subtitle"
                style={inputStyle}
              />


              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="">
                  Select Project Category
                </option>

                <option value="GIS">
                  GIS
                </option>

                <option value="IT">
                  IT
                </option>

                <option value="AI/ML">
                  AI/ML
                </option>

                <option value="IoT">
                  IoT
                </option>

                <option value="Cloud">
                  Cloud
                </option>

                <option value="Cybersecurity">
                  Cybersecurity
                </option>
              </select>


              {/* PROJECT IMAGE */}

              <div
                style={{
                  marginBottom: "25px",
                }}
              >

                <label
                  style={labelStyle}
                >
                  Project Image
                </label>


                {form.image && (
                  <img
                    src={getImageUrl(
                      form.image
                    )}
                    alt="Project preview"
                    style={previewStyle}
                  />
                )}


                <div
                  style={buttonRowStyle}
                >

                  <label
                    style={{
                      ...secondaryButtonStyle,
                      display:
                        "inline-flex",
                      alignItems:
                        "center",
                      cursor:
                        uploadingImage
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {uploadingImage
                      ? "Uploading..."
                      : "Upload Image"}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        handleImageUpload
                      }
                      disabled={
                        uploadingImage
                      }
                      style={{
                        display: "none",
                      }}
                    />
                  </label>


                  <button
                    type="button"
                    onClick={() =>
                      setMediaPickerOpen(
                        true
                      )
                    }
                    style={
                      secondaryButtonStyle
                    }
                  >
                    Choose from Media Library
                  </button>

                </div>

              </div>


              {/* PROJECT INFORMATION */}

              <h3
                style={{
                  margin:
                    "30px 0 20px",
                }}
              >
                Project Information
              </h3>


              <input
                name="client"
                value={form.client}
                onChange={handleChange}
                placeholder="Client"
                style={inputStyle}
              />


              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Location"
                style={inputStyle}
              />


              <input
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="2025"
                style={inputStyle}
              />


              <input
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="8 Months"
                style={inputStyle}
              />


              <input
                name="team"
                value={form.team}
                onChange={handleChange}
                placeholder="12 Engineers"
                style={inputStyle}
              />


              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Project description..."
                rows={5}
                style={textareaStyle}
              />


              {/* PROJECT DETAILS */}

              <h3
                style={{
                  margin:
                    "30px 0 20px",
                }}
              >
                Project Details
              </h3>


              <textarea
                name="challenge"
                value={form.challenge}
                onChange={handleChange}
                placeholder="Challenge..."
                rows={5}
                style={textareaStyle}
              />


              <textarea
                name="solution"
                value={form.solution}
                onChange={handleChange}
                placeholder="Solution..."
                rows={5}
                style={textareaStyle}
              />


              <textarea
                value={form.results.join(
                  "\n"
                )}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    results:
                      e.target.value
                        .split("\n")
                        .map(
                          (item) =>
                            item.trim()
                        )
                        .filter(Boolean),
                  }))
                }
                placeholder="Results, one per line"
                rows={5}
                style={textareaStyle}
              />


              <textarea
                value={form.technologies.join(
                  "\n"
                )}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    technologies:
                      e.target.value
                        .split("\n")
                        .map(
                          (item) =>
                            item.trim()
                        )
                        .filter(Boolean),
                  }))
                }
                placeholder="Technologies, one per line"
                rows={5}
                style={textareaStyle}
              />


              {/* ACTIVE */}

              <label
                style={checkboxLabelStyle}
              >
                <input
                  type="checkbox"
                  name="is_active"
                  checked={
                    form.is_active
                  }
                  onChange={
                    handleChange
                  }
                />

                Active
              </label>


              {/* BUTTONS */}

              <div
                style={buttonRowStyle}
              >

                <button
                  type="submit"
                  disabled={loading}
                  style={
                    primaryButtonStyle
                  }
                >
                  {loading
                    ? "Saving..."
                    : editingId
                    ? "Update Project"
                    : "Create Project"}
                </button>


                {editingId && (
                  <button
                    type="button"
                    onClick={
                      resetForm
                    }
                    style={
                      secondaryButtonStyle
                    }
                  >
                    Cancel
                  </button>
                )}

              </div>

            </form>

          </div>


          {/* EXISTING PROJECTS */}

          <div
            style={sectionStyle}
          >

            <h2
              style={{
                marginBottom: "25px",
              }}
            >
              Existing Projects
            </h2>


            {projects.length === 0 && (
              <p
                style={{
                  color: "#94a3b8",
                }}
              >
                No projects available.
              </p>
            )}


            {projects.map(
              (project) => (
                <div
                  key={project.id}
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    gap: "20px",
                    padding: "20px",
                    marginBottom:
                      "15px",
                    background:
                      "#f8fafc",
                    borderRadius:
                      "14px",
                  }}
                >

                  <div>

                    <h3
                      style={{
                        margin: 0,
                      }}
                    >
                      {project.title}
                    </h3>


                    <p
                      style={{
                        color:
                          "#64748b",
                        fontSize:
                          "14px",
                      }}
                    >
                      {project.category}
                    </p>


                    <span
                      style={{
                        color:
                          project.is_active
                            ? "#16a34a"
                            : "#dc2626",
                        fontSize:
                          "12px",
                        fontWeight:
                          "600",
                      }}
                    >
                      {project.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>


                  <div
                    style={{
                      display:
                        "flex",
                      gap: "10px",
                    }}
                  >

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(
                          project
                        )
                      }
                      style={
                        secondaryButtonStyle
                      }
                    >
                      Edit
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          project.id
                        )
                      }
                      style={
                        deleteButtonStyle
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>
              )
            )}

          </div>

        </>
      )}


      {/* =================================================
          GALLERY SECTION
      ================================================= */}

      {showcaseSection === "gallery" && (
        <>

          {/* GALLERY FORM */}

          <div
            style={sectionStyle}
          >

            <h2
              style={{
                fontSize: "20px",
                marginBottom: "25px",
              }}
            >
              {editingGalleryId
                ? "Edit Gallery Item"
                : "Add Gallery Item"}
            </h2>


            <form
              onSubmit={
                handleGallerySubmit
              }
            >

              <input
                name="title"
                value={
                  galleryForm.title
                }
                onChange={
                  handleGalleryChange
                }
                placeholder="Gallery Title"
                required
                style={inputStyle}
              />


              <select
                name="category"
                value={
                  galleryForm.category
                }
                onChange={
                  handleGalleryChange
                }
                required
                style={inputStyle}
              >
                <option value="">
                  Select Gallery Category
                </option>

                <option value="Office">
                  Office
                </option>

                <option value="Fieldwork">
                  Fieldwork
                </option>

                <option value="Events">
                  Events
                </option>

                <option value="Projects">
                  Projects
                </option>
              </select>


              {/* GALLERY IMAGE */}

              <div
                style={{
                  marginBottom: "25px",
                }}
              >

                <label
                  style={labelStyle}
                >
                  Gallery Image
                </label>


                {galleryForm.image && (
                  <img
                    src={getImageUrl(
                      galleryForm.image
                    )}
                    alt="Gallery preview"
                    style={previewStyle}
                  />
                )}


                <div
                  style={buttonRowStyle}
                >

                  <label
                    style={{
                      ...secondaryButtonStyle,
                      display:
                        "inline-flex",
                      alignItems:
                        "center",
                      cursor:
                        galleryUploadingImage
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {galleryUploadingImage
                      ? "Uploading..."
                      : "Upload Image"}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        handleGalleryImageUpload
                      }
                      disabled={
                        galleryUploadingImage
                      }
                      style={{
                        display: "none",
                      }}
                    />
                  </label>


                  <button
                    type="button"
                    onClick={() =>
                      setGalleryMediaPickerOpen(
                        true
                      )
                    }
                    style={
                      secondaryButtonStyle
                    }
                  >
                    Choose from Media Library
                  </button>

                </div>

              </div>


              {/* ACTIVE */}

              <label
                style={checkboxLabelStyle}
              >
                <input
                  type="checkbox"
                  name="is_active"
                  checked={
                    galleryForm.is_active
                  }
                  onChange={
                    handleGalleryChange
                  }
                />

                Active
              </label>


              <div
                style={buttonRowStyle}
              >

                <button
                  type="submit"
                  disabled={loading}
                  style={
                    primaryButtonStyle
                  }
                >
                  {loading
                    ? "Saving..."
                    : editingGalleryId
                    ? "Update Gallery"
                    : "Create Gallery"}
                </button>


                {editingGalleryId && (
                  <button
                    type="button"
                    onClick={
                      resetGalleryForm
                    }
                    style={
                      secondaryButtonStyle
                    }
                  >
                    Cancel
                  </button>
                )}

              </div>

            </form>

          </div>


          {/* EXISTING GALLERY */}

          <div
            style={sectionStyle}
          >

            <h2
              style={{
                marginBottom: "25px",
              }}
            >
              Existing Gallery Items
            </h2>


            {gallery.length === 0 && (
              <p
                style={{
                  color: "#94a3b8",
                }}
              >
                No gallery items available.
              </p>
            )}


            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "20px",
              }}
            >

              {gallery.map(
                (item) => (
                  <div
                    key={item.id}
                    style={{
                      border:
                        "1px solid #e2e8f0",
                      borderRadius:
                        "16px",
                      overflow:
                        "hidden",
                      background:
                        "#f8fafc",
                    }}
                  >

                    {item.image && (
                      <img
                        src={getImageUrl(
                          item.image
                        )}
                        alt={item.title}
                        style={{
                          width:
                            "100%",
                          height:
                            "180px",
                          objectFit:
                            "cover",
                          display:
                            "block",
                        }}
                      />
                    )}


                    <div
                      style={{
                        padding:
                          "18px",
                      }}
                    >

                      <h3
                        style={{
                          margin: 0,
                          marginBottom:
                            "8px",
                        }}
                      >
                        {item.title}
                      </h3>


                      <p
                        style={{
                          color:
                            "#64748b",
                          fontSize:
                            "14px",
                          margin:
                            "0 0 8px",
                        }}
                      >
                        {item.category}
                      </p>


                      <span
                        style={{
                          color:
                            item.is_active
                              ? "#16a34a"
                              : "#dc2626",
                          fontSize:
                            "12px",
                          fontWeight:
                            "600",
                        }}
                      >
                        {item.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>


                      <div
                        style={{
                          display:
                            "flex",
                          gap:
                            "10px",
                          marginTop:
                            "18px",
                        }}
                      >

                        <button
                          type="button"
                          onClick={() =>
                            handleGalleryEdit(
                              item
                            )
                          }
                          style={{
                            ...secondaryButtonStyle,
                            flex: 1,
                          }}
                        >
                          Edit
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            handleGalleryDelete(
                              item.id
                            )
                          }
                          style={{
                            ...deleteButtonStyle,
                            flex: 1,
                          }}
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>

          </div>

        </>
      )}


      {/* =================================================
          BLOG SECTION
      ================================================= */}

      {showcaseSection === "blog" && (
        <>
          <div style={sectionStyle}>
            <h2
              style={{
                fontSize: "20px",
                marginBottom: "25px",
              }}
            >
              {editingBlogId
                ? "Edit Blog"
                : "Add Blog"}
            </h2>

            <form onSubmit={handleBlogSubmit}>

              <select
                name="category"
                value={blogForm.category}
                onChange={handleBlogChange}
                required
                style={inputStyle}
              >
                <option value="">
                  Select Blog Category
                </option>
                <option value="GeoAI">GeoAI</option>
                <option value="GIS">GIS</option>
                <option value="IoT">IoT</option>
                <option value="IT">IT</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Cloud">Cloud</option>
                <option value="Cybersecurity">
                  Cybersecurity
                </option>
              </select>

              <input
                name="title"
                value={blogForm.title}
                onChange={handleBlogChange}
                placeholder="Blog Title"
                required
                style={inputStyle}
              />

              <input
                name="date"
                value={blogForm.date}
                onChange={handleBlogChange}
                placeholder="Mar 15, 2026"
                required
                style={inputStyle}
              />

              <input
                name="author"
                value={blogForm.author}
                onChange={handleBlogChange}
                placeholder="Author"
                required
                style={inputStyle}
              />

              <input
                name="read_time"
                value={blogForm.read_time}
                onChange={handleBlogChange}
                placeholder="5 min read"
                required
                style={inputStyle}
              />

              <textarea
                name="excerpt"
                value={blogForm.excerpt}
                onChange={handleBlogChange}
                placeholder="Short excerpt..."
                rows={4}
                style={textareaStyle}
              />

              <textarea
                name="content"
                value={blogForm.content}
                onChange={handleBlogChange}
                placeholder="Full blog content..."
                rows={10}
                style={textareaStyle}
              />

              <div
                style={{
                  marginBottom: "25px",
                }}
              >
                <label style={labelStyle}>
                  Blog Image
                </label>

                {blogForm.image && (
                  <img
                    src={getImageUrl(
                      blogForm.image
                    )}
                    alt="Blog preview"
                    style={previewStyle}
                  />
                )}

                <div style={buttonRowStyle}>
                  <label
                    style={{
                      ...secondaryButtonStyle,
                      display: "inline-flex",
                      alignItems: "center",
                      cursor:
                        blogUploadingImage
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {blogUploadingImage
                      ? "Uploading..."
                      : "Upload Image"}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        handleBlogImageUpload
                      }
                      disabled={
                        blogUploadingImage
                      }
                      style={{
                        display: "none",
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setBlogMediaPickerOpen(true)
                    }
                    style={secondaryButtonStyle}
                  >
                    Choose from Media Library
                  </button>
                </div>
              </div>

              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={blogForm.is_active}
                  onChange={handleBlogChange}
                />
                Active
              </label>

              <div style={buttonRowStyle}>
                <button
                  type="submit"
                  disabled={loading}
                  style={primaryButtonStyle}
                >
                  {loading
                    ? "Saving..."
                    : editingBlogId
                    ? "Update Blog"
                    : "Create Blog"}
                </button>

                {editingBlogId && (
                  <button
                    type="button"
                    onClick={resetBlogForm}
                    style={secondaryButtonStyle}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div style={sectionStyle}>
            <h2
              style={{
                marginBottom: "25px",
              }}
            >
              Existing Blogs
            </h2>

            {blogs.length === 0 && (
              <p
                style={{
                  color: "#94a3b8",
                }}
              >
                No blog posts available.
              </p>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  style={{
                    border:
                      "1px solid #e2e8f0",
                    borderRadius: "16px",
                    overflow: "hidden",
                    background: "#f8fafc",
                  }}
                >
                  {blog.image && (
                    <img
                      src={getImageUrl(
                        blog.image
                      )}
                      alt={blog.title}
                      style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  )}

                  <div
                    style={{
                      padding: "18px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        marginBottom: "10px",
                        color: "#0284c7",
                        background: "#eff6ff",
                        borderRadius: "999px",
                        padding: "5px 10px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {blog.category}
                    </span>

                    <h3
                      style={{
                        margin: 0,
                        marginBottom: "8px",
                      }}
                    >
                      {blog.title}
                    </h3>

                    <p
                      style={{
                        color: "#64748b",
                        fontSize: "14px",
                        margin: "0 0 8px",
                      }}
                    >
                      {blog.date}
                    </p>

                    <p
                      style={{
                        color: "#64748b",
                        fontSize: "14px",
                        lineHeight: "1.5",
                        margin: "0 0 8px",
                      }}
                    >
                      {blog.excerpt}
                    </p>

                    <p
                      style={{
                        color: "#94a3b8",
                        fontSize: "13px",
                        margin: 0,
                      }}
                    >
                      {blog.author}
                      {" • "}
                      {blog.read_time ||
                        blog.readTime}
                    </p>

                    <span
                      style={{
                        display: "inline-block",
                        marginTop: "10px",
                        color:
                          blog.is_active
                            ? "#16a34a"
                            : "#dc2626",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {blog.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "18px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          handleBlogEdit(blog)
                        }
                        style={{
                          ...secondaryButtonStyle,
                          flex: 1,
                        }}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleBlogDelete(
                            blog.id
                          )
                        }
                        style={{
                          ...deleteButtonStyle,
                          flex: 1,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}


      {/* =================================================
          PROJECT MEDIA PICKER
      ================================================= */}

      <MediaPicker
        open={mediaPickerOpen}
        folder="showcase"
        type="image"
        onClose={() =>
          setMediaPickerOpen(false)
        }
        onSelect={(file) => {
          setForm((prev) => ({
            ...prev,
            image: file.path,
          }));

          setMediaPickerOpen(false);
        }}
      />


      {/* =================================================
          GALLERY MEDIA PICKER
      ================================================= */}

      <MediaPicker
        open={
          galleryMediaPickerOpen
        }
        folder="showcase"
        type="image"
        onClose={() =>
          setGalleryMediaPickerOpen(
            false
          )
        }
        onSelect={(file) => {
          setGalleryForm(
            (prev) => ({
              ...prev,
              image: file.path,
            })
          );

          setGalleryMediaPickerOpen(
            false
          );
        }}
      />


      {/* =================================================
          BLOG MEDIA PICKER
      ================================================= */}

      <MediaPicker
        open={blogMediaPickerOpen}
        folder="showcase"
        type="image"
        onClose={() =>
          setBlogMediaPickerOpen(false)
        }
        onSelect={(file) => {
          setBlogForm((prev) => ({
            ...prev,
            image: file.path,
          }));

          setBlogMediaPickerOpen(false);
        }}
      />

    </div>
  );
}


// =========================================================
// STYLES
// =========================================================

const sectionStyle = {
  background: "#ffffff",
  borderRadius: "20px",
  padding: "30px",
  marginBottom: "35px",
  border: "1px solid #e2e8f0",
};


const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  background: "#f8fafc",
  color: "#0f172a",
  boxSizing: "border-box",
};


const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
};


const labelStyle = {
  display: "block",
  marginBottom: "10px",
  fontWeight: "600",
};


const previewStyle = {
  width: "260px",
  height: "160px",
  objectFit: "cover",
  borderRadius: "14px",
  marginBottom: "15px",
  display: "block",
};


const buttonRowStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};


const checkboxLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  margin: "20px 0",
};


const tabButtonStyle = {
  padding: "13px 28px",
  borderRadius: "10px",
  border: "none",
  fontWeight: "600",
  cursor: "pointer",
};


const primaryButtonStyle = {
  padding: "13px 22px",
  borderRadius: "10px",
  border: "none",
  background: "#0ea5e9",
  color: "#0f172a",
  fontWeight: "600",
  cursor: "pointer",
};


const secondaryButtonStyle = {
  padding: "13px 22px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  background: "#f8fafc",
  color: "#0f172a",
  fontWeight: "600",
  cursor: "pointer",
};


const deleteButtonStyle = {
  ...secondaryButtonStyle,
  color: "#dc2626",
};