import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectModal({
  project,
  isOpen,
  onClose,
}) {
  // =========================
  // IMAGE URL
  // =========================
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

  // =========================
  // PARSE JSON-STRING FIELDS
  // =========================
  // The backend may store these as JSON strings
  // (same as handled in admin/Showcase.jsx), so we
  // normalize them here before rendering.

  const parsedResults = project?.results
    ? typeof project.results === "string"
      ? JSON.parse(project.results)
      : project.results
    : [];

  const parsedTechnologies = project?.technologies
    ? typeof project.technologies === "string"
      ? JSON.parse(project.technologies)
      : project.technologies
    : [];

  return (
    <AnimatePresence>
      {isOpen && project && (
        <>
          {/* Background */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
          />

          {/* Modal */}

          <motion.div
            initial={{ opacity: 0, scale: .95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: .95, y: 40 }}
            transition={{ duration: .3 }}
            className="
                fixed
                left-1/2
                top-1/2
                z-50
                w-[92%]
                max-w-5xl
                max-h-[90vh]
                -translate-x-1/2
                -translate-y-1/2
                overflow-y-auto
                rounded-[32px]
                border
                border-white/10
                bg-white
                shadow-[0_30px_100px_rgba(0,0,0,.6)]
                scrollbar-thin
                scrollbar-thumb-sky-500/40
                "
          >
            {/* Image */}

            <img
              src={getImageUrl(project.image)}
              alt={project.title}
              className="h-[360px] w-full object-cover"
            />

            {/* Close */}

            <button
                onClick={onClose}
                className="
                    absolute
                    top-6
                    right-6
                    w-12
                    h-12
                    rounded-full
                    border-white/20
                    text-white
                    backdrop-blur-md
                    flex
                    items-center
                    justify-center
                    border
                    border-white/10
                    text-slate-900
                    transition-all
                    duration-300
                    hover:bg-sky-500
                    hover:rotate-90
                "
                >
                <X size={22} />
                </button>

            {/* Content */}

            <div className="p-10">

              <span
                className="
                  rounded-full
                  bg-sky-500/10
                  border
                  border-sky-500/30
                  px-4
                  py-2
                  text-sm
                  text-sky-400
                "
              >
                {project.category}
              </span>

              <h2 className="mt-6 text-4xl font-bold text-slate-900">
                {project.title}
                </h2>

                <p className="mt-3 text-sky-400 text-xl font-semibold">
                {project.subtitle}
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-8">

                <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-gray-500 text-sm">Client</p>
                    <h4 className="mt-2 text-slate-900 font-semibold">
                    {project.client || "Coming Soon"}
                    </h4>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-gray-500 text-sm">Location</p>
                    <h4 className="mt-2 text-slate-900 font-semibold">
                    {project.location || "Coming Soon"}
                    </h4>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                    <p className="text-gray-500 text-sm">Duration</p>
                    <h4 className="mt-2 text-slate-900 font-semibold">
                    {project.duration || "Coming Soon"}
                    </h4>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                    <p className="text-gray-500 text-sm">Year</p>
                    <h4 className="mt-2 text-slate-900 font-semibold">
                    {project.year || "Coming Soon"}
                    </h4>
                </div>

                </div>

                <p className="mt-10 text-lg leading-8 text-slate-500">
                {project.description || "Description Coming Soon"}
                </p>

              {/* Challenge */}

                <div className="mt-12">
                <h3 className="text-2xl font-bold text-slate-900">
                    Challenge
                </h3>

                <p className="mt-4 text-slate-500 leading-8">
                    {project.challenge || "Details Coming Soon"}
                </p>
                </div>

                {/* Solution */}

                <div className="mt-12">
                <h3 className="text-2xl font-bold text-slate-900">
                    Solution
                </h3>

                <p className="mt-4 text-slate-500 leading-8">
                    {project.solution || "Solutions Coming Soon"}
                </p>
                </div>

                {/* Results */}

                <div className="mt-12">
                <h3 className="text-2xl font-bold text-slate-900">
                    Results
                </h3>

                <div className="grid md:grid-cols-2 gap-4 mt-6">

                    {parsedResults?.map((result) => (
                    <div
                        key={result}
                        className="
                        rounded-2xl
                        border
                        border-sky-500/20
                        bg-sky-500/5
                        p-5
                        "
                    >
                        <p className="text-slate-900 font-medium">
                        ✓ {result}
                        </p>
                    </div>
                    ))}

                </div>
                </div>

                {/* Technologies */}

                <div className="mt-12">
                <h3 className="text-2xl font-bold text-slate-900">
                    Technologies Used
                </h3>

                <div className="mt-5 flex flex-wrap gap-3">
                    {parsedTechnologies?.map((tech) => (
                    <span
                        key={tech}
                        className="
                          rounded-full
                          bg-slate-50
                          border
                          border-slate-200
                          px-4
                          py-2
                          text-sm
                          text-slate-600
                        "
                    >
                        {tech}
                    </span>
                    ))}
                </div>
                </div>

            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}