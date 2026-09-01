import { motion } from "framer-motion";
import { Eye, Target } from "lucide-react";

export default function VisionMission() {
  return (
    <section className="w-full bg-white pb-12 mb-8">

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center">

        {/* =========================
            HEADER
        ========================= */}
        <div className="w-full flex flex-col items-center justify-center text-center max-w-3xl">

          <p className="uppercase tracking-[6px] text-sky-500 text-sm font-semibold">
            OUR PURPOSE
          </p>

          <h2 className="mt-8 text-5xl font-bold text-slate-900">
            Vision & Mission
          </h2>

          <p className="mt-8 text-lg text-slate-500 leading-9">
            Our vision and mission guide every solution we build and every
            partnership we create.
          </p>

        </div>

        {/* =========================
            CARDS
        ========================= */}
        <div className="mt-28 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* =========================
              VISION CARD
          ========================= */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{
              y: -8,
              scale: 1.01,
            }}
            className="
              group
              flex
              flex-col
              items-start
              text-left
              w-full
              rounded-[2.5rem]
              border
              border-slate-200
              bg-white
              p-10
              lg:p-14
              transition-all
              duration-500
              hover:border-sky-300
              hover:shadow-[0_20px_60px_rgba(14,165,233,0.10)]
            "
          >

            {/* ICON */}
            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-sky-50
                border
                border-sky-100
                flex
                items-center
                justify-center
                shrink-0
                transition-all
                duration-300
                group-hover:bg-sky-100
                group-hover:border-sky-200
              "
            >
              <Eye
                className="text-sky-500"
                size={30}
              />
            </div>

            {/* TITLE */}
            <h3 className="mt-10 text-3xl font-bold text-slate-900">
              Our Vision
            </h3>

            {/* DESCRIPTION */}
            <p className="mt-6 text-slate-500 leading-relaxed text-lg">
              To become a leading global integrator of geospatial intelligence
              and digital technologies, enabling sustainable development and
              smarter decision-making across industries.
            </p>

          </motion.div>

          {/* =========================
              MISSION CARD
          ========================= */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            whileHover={{
              y: -8,
              scale: 1.01,
            }}
            className="
              group
              flex
              flex-col
              items-start
              text-left
              w-full
              rounded-[2.5rem]
              border
              border-slate-200
              bg-white
              p-10
              lg:p-14
              transition-all
              duration-500
              hover:border-sky-300
              hover:shadow-[0_20px_60px_rgba(14,165,233,0.10)]
            "
          >

            {/* ICON */}
            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-sky-50
                border
                border-sky-100
                flex
                items-center
                justify-center
                shrink-0
                transition-all
                duration-300
                group-hover:bg-sky-100
                group-hover:border-sky-200
              "
            >
              <Target
                className="text-sky-500"
                size={30}
              />
            </div>

            {/* TITLE */}
            <h3 className="mt-10 text-3xl font-bold text-slate-900">
              Our Mission
            </h3>

            {/* DESCRIPTION */}
            <p className="mt-6 text-slate-500 leading-relaxed text-lg">
              Deliver innovative GIS, AI, remote sensing, cloud, and enterprise
              software solutions through cutting-edge technologies, precision,
              and collaborative partnerships.
            </p>

          </motion.div>

        </div>

      </div>

    </section>
  );
}