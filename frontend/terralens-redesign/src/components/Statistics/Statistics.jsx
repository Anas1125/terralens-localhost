import { motion } from "framer-motion";
import {
  MapPinned,
  Code2,
  Lightbulb,
  Users,
} from "lucide-react";

const stats = [
  {
    number: "500+",
    label: "GIS Projects Delivered",
    icon: MapPinned,
  },
  {
    number: "200+",
    label: "Software Solutions Built",
    icon: Code2,
  },
  {
    number: "50+",
    label: "Innovation Partners",
    icon: Lightbulb,
  },
  {
    number: "100+",
    label: "Clients Worldwide",
    icon: Users,
  },
];

export default function Statistics() {
  return (
    <section className="bg-white py-20 w-full flex justify-center">
      <div className="w-full max-w-7xl px-6 lg:px-8 flex flex-col items-center">
        <div className="w-full flex flex-col items-center justify-center text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="uppercase tracking-[6px] text-sky-400 text-sm font-semibold"
          >
            OUR IMPACT
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 text-4xl md:text-6xl font-bold text-slate-900 leading-tight"
          >
            Trusted by organizations
            <br />
            across industries.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-12 max-w-3xl text-slate-500 text-lg md:text-xl leading-relaxed"
          >
            TerraLens continues delivering enterprise-grade GIS, AI, software
            engineering and surveying solutions for governments, infrastructure
            projects and global businesses.
          </motion.p>
        </div>
        <div className="mt-28 w-full flex flex-wrap justify-center items-center gap-6 lg:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                }}
                className="
                  group relative overflow-hidden
                  rounded-[30px] border border-slate-200
                  bg-white
                  px-6 py-10
                  w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)]
                  max-w-[280px]
                  transition-all duration-500
                  hover:border-sky-300 hover:shadow-[0_0_40px_rgba(56,189,248,0.18)]
                  flex flex-col items-center text-center
                "
              >
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="w-16 h-16 rounded-2xl border border-sky-400/30 bg-sky-500/10 flex items-center justify-center mb-6">
                  <Icon className="text-sky-400" size={28} />
                </div>
                <h3 className="text-4xl lg:text-5xl font-bold text-slate-900">
                  {stat.number}
                </h3>
                <div className="mt-5 mb-4 h-px w-12 bg-slate-200" />
                <p className="text-slate-500 text-sm lg:text-base font-medium">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}