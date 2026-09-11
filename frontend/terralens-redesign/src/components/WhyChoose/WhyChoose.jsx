import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  "Multi-Domain Expertise",
  "End-to-End Solutions",
  "Research-Driven Approach",
  "Proven Results",
  "Cutting-Edge Technology",
  "Collaborative Partnership",
];

export default function WhyChooseDark() {
  return (
    <section className="bg-white">  
      <div className="flex justify-center">
        <div className="w-full max-w-6xl px-8">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-20 items-center">
        {/* Left column — copy */}
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="uppercase tracking-[3px] text-sky-400 text-sm font-semibold"
          >
            WHY CHOOSE US
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-5 text-4xl md:text-5xl font-bold tracking-tight leading-[1.15]"
          >
            <span className="text-slate-900">Built on Expertise, </span>
            <span className="text-sky-400">Driven by Innovation</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-slate-500 leading-7 max-w-lg"
          >
            With Deep Expertise Spanning Geospatial Science And Software 
            Engineering, Terralens Innovations Delivers Integrated Solutions 
            That Create Lasting Impact For Governments, Enterprises, 
            And Research Institutions.
          </motion.p>
        </div>

        {/* Right column — pill grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="
                group
                flex items-center gap-4
                rounded-2xl
                border border-slate-200
                bg-white
                px-7 py-6
                transition-all
                duration-300
                cursor-pointer
                hover:-translate-y-1
                hover:border-sky-400/40
                hover:shadow-[0_0_25px_rgba(56,189,248,.15)]
                "
            >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10 border border-sky-500/30 group-hover:bg-sky-500/20 transition-all">
              <CheckCircle2
                className="text-sky-400"
                size={20}
                strokeWidth={2.5}
              />
            </div>
              <span className="text-slate-900 text-[17px] font-semibold">{label}</span>
            </motion.div>
          ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}