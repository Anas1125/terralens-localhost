import { AnimatePresence, motion } from "framer-motion";
import { X, CalendarDays, User, Clock3 } from "lucide-react";

export default function BlogModal({
  blog,
  isOpen,
  onClose,
}) {
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
    <AnimatePresence>
      {isOpen && blog && (
        <>
          {/* Overlay */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
          />

          {/* Modal */}

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            transition={{ duration: 0.3 }}
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
              border-slate-200
              bg-white
              shadow-[0_30px_100px_rgba(15,23,42,.20)]
            "
          >

            {/* Hero Image */}

            <img
              src={getImageUrl(blog.image)}
              alt={blog.title}
              className="w-full h-[350px] object-cover"
            />

            {/* Close */}

            <button
              onClick={onClose}
              className="
                fixed
                top-6
                right-6
                z-[60]
                w-12
                h-12
                rounded-full
                border
                border-white/10
                bg-white/90
                text-slate-900
                backdrop-blur-md
                flex
                items-center
                justify-center
                cursor-pointer
                transition-all
                duration-300
                hover:bg-sky-500
                hover:text-white
                hover:rotate-90
              "
            >
              <X size={22} />
            </button>

            {/* Content */}

            <div className="p-10">

              {/* Category */}

              <span
                className="
                  inline-block
                  rounded-full
                  bg-sky-500/10
                  border
                  border-sky-500/30
                  px-4
                  py-2
                  text-sm
                  text-sky-500
                "
              >
                {blog.category}
              </span>

              {/* Title */}

              <h2 className="mt-6 text-4xl font-bold text-slate-900">
                {blog.title}
              </h2>

              {/* Meta */}

              <div className="flex flex-wrap gap-6 mt-6 text-slate-500">

                <div className="flex items-center gap-2">
                  <CalendarDays
                    size={18}
                    className="text-sky-500"
                  />
                  {blog.date}
                </div>

                <div className="flex items-center gap-2">
                  <User
                    size={18}
                    className="text-sky-500"
                  />
                  {blog.author}
                </div>

                <div className="flex items-center gap-2">
                  <Clock3
                    size={18}
                    className="text-sky-500"
                  />
                  {blog.readTime}
                </div>

              </div>

              {/* Content */}

              <p className="mt-10 text-lg leading-9 text-slate-600">
                {blog.content}
              </p>

            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}