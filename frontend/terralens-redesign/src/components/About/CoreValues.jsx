import { motion } from "framer-motion";
import {
  Lightbulb,
  ShieldCheck,
  Users,
  Award,
} from "lucide-react";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We embrace emerging technologies to create smarter geospatial and software solutions.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity",
    description:
      "Transparency, trust, and ethical practices guide every project we deliver.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "Working closely with clients and partners to achieve meaningful results together.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "Delivering quality, precision, and continuous improvement in everything we build.",
  },
];

export default function CoreValues() {
  return (
    <section className="w-full bg-white pb-32">

      <div className="relative w-full pt-10 max-w-[85rem] mx-auto px-6 lg:px-8 flex flex-col items-center">

        {/* =========================
            HEADER
        ========================= */}
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center">

          <p className="w-full text-center uppercase tracking-[6px] text-sky-500 text-sm font-semibold">
            OUR VALUES
          </p>

          <h2 className="mt-8 w-full text-center text-5xl font-bold text-slate-900">
            Core Values
          </h2>

          <p className="mt-8 w-full text-center text-lg text-slate-500 leading-9">
            These principles define how TerraLens approaches innovation,
            technology, partnerships and every client engagement.
          </p>

        </div>

        {/* =========================
            CARDS GRID
        ========================= */}
        <div className="mt-12 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {values.map((value, index) => {
            const Icon = value.icon;

            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
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
                  p-6
                  shadow-[0_10px_35px_rgba(15,23,42,0.05)]
                  transition-all
                  duration-300
                  hover:border-sky-300
                  hover:shadow-[0_20px_45px_rgba(14,165,233,0.10)]
                "
              >

                {/* ICON */}
                <div
                  className="
                    w-12
                    h-12
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
                  <Icon
                    className="text-sky-500"
                    size={28}
                  />
                </div>

                {/* TITLE */}
                <h3 className="mt-8 text-2xl font-bold text-slate-900">
                  {value.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="mt-5 text-slate-500 leading-8">
                  {value.description}
                </p>

              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}