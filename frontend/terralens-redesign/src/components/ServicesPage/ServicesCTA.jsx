import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ctaContent = {
  survey: {
    eyebrow: "GEOSPATIAL SURVEY",
    title: "Geospatial Survey Solutions",
    description:
      "End To End Geospatial Survey Solutions Including Li Dar, Hydrographic, Geophysical, Pipeline, Highway, Railway, Airport, And Mining Surveys With Cutting Edge Technology And Experienced Professionals.",
    primary: "Get a Survey Quote",
  },

  gis: {
    eyebrow: "GIS SERVICES",
    title: "Geospatial Intelligence",
    description:
      "From Spatial Analysis To Web Gis Development And Property Tax Mapping, Terralens Delivers Comprehensive Geospatial Solutions Powered By Cutting Edge Technologies And Domain Expertise.",
    primary: "Discuss Your Project",
  },

  it: {
    eyebrow: "IT SERVICES",
    title: "Enterprise Software Solutions",
    description:
      "build Scalable Web Applications, Cloud Platforms, Ai Powered Software, Mobile Applications And Enterprise Systems Tailored To Your Business Needs.",
    primary: "Start Your Project",
  },

  consultancy: {
    eyebrow: "CONSULTANCY",
    title: "Strategic Technology Consulting",
    description:
      "We Help Governments And Enterprises Plan, Design And Implement Digital Transformation Initiatives Through Gis Consulting, Enterprise Architecture And Technology Advisory Services.",
    primary: "Book a Consultation",
  },
};

export default function ServicesCTA({ activeTab = "survey" }) {
  const navigate = useNavigate();

  const data =
    ctaContent[activeTab] || ctaContent.survey;

  return (
    <section className="w-full bg-white py-16 md:py-20 px-6 overflow-hidden">

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
        className="
          relative
          w-full
          max-w-6xl
          mx-auto
          overflow-hidden
          rounded-[2.5rem]
          border
          border-slate-200
          bg-slate-50
          px-6
          py-14
          md:px-12
          md:py-16
          lg:px-20
          transition-all
          duration-300
          hover:border-sky-200
          hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)]
        "
      >

        {/* Soft Background Glow */}
        <div
          className="
            pointer-events-none
            absolute
            top-[-180px]
            left-1/2
            -translate-x-1/2
            h-[400px]
            w-[400px]
            rounded-full
            bg-sky-400/10
            blur-[120px]
          "
        />

        {/* Decorative Glow */}
        <div
          className="
            pointer-events-none
            absolute
            bottom-[-150px]
            right-[-100px]
            h-[300px]
            w-[300px]
            rounded-full
            bg-sky-300/10
            blur-[100px]
          "
        />

        {/* Content */}
        <div className="
          relative
          z-10
          flex
          flex-col
          items-center
          justify-center
          text-center
          max-w-4xl
          mx-auto
        ">

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="
              uppercase
              tracking-[5px]
              text-sky-500
              text-xs
              md:text-sm
              font-bold
              mb-5
            "
          >
            {data.eyebrow}
          </motion.p>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="
              text-4xl
              md:text-5xl
              lg:text-6xl
              font-extrabold
              text-slate-900
              leading-[1.1]
              tracking-tight
              mb-6
            "
          >
            {data.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="
              max-w-3xl
              text-base
              md:text-lg
              text-slate-500
              leading-7
              md:leading-8
              mb-9
            "
          >
            {data.description}
          </motion.p>

          {/* Button */}
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            onClick={() => navigate("/contact")}
            className="
              group
              inline-flex
              items-center
              justify-center
              gap-3
              rounded-full
              bg-sky-500
              px-8
              py-4
              text-base
              font-bold
              text-white
              cursor-pointer
              transition-all
              duration-300
              hover:bg-sky-400
              hover:-translate-y-1
              hover:shadow-[0_12px_30px_rgba(14,165,233,0.25)]
            "
          >
            {data.primary}

            <ArrowRight
              size={18}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1.5
              "
            />
          </motion.button>

        </div>
      </motion.div>

    </section>
  );
}