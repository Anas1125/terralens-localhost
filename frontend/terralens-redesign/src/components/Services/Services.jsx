import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    title: "GIS Solutions",
    description:
      "Spatial Analysis, Remote Sensing, Web Gis Development, Drone Mapping And Enterprise Geospatial Intelligence.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1800&auto=format&fit=crop",
  },
  {
    title: "IT & Software",
    description:
      "Modern Web Applications, Enterprise Software, Ai Integration, Cloud Platforms And Cybersecurity.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1800&auto=format&fit=crop",
  },
  {
    title: "AI & Data Intelligence",
    description:
      "Machine Learning, Computer Vision And Intelligent Analytics For Next Generation Engineering Solutions.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1800&auto=format&fit=crop",
  },
];

export default function Services() {
  return (
    <section className="bg-white py-32">
      <div className="flex flex-col items-center gap-8 mt-24 px-6">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="w-full max-w-[1200px] grid lg:grid-cols-[46%_54%] rounded-[32px] bg-[#111113] border border-white/10 overflow-hidden"
          >
            {/* IMAGE */}
            <div className="relative h-64 lg:h-full">
              <img
                src={service.image}
                alt={service.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="flex flex-col justify-center p-10 lg:p-14">
              <h3 className="text-3xl font-bold text-white">
                {service.title}
              </h3>
              <p className="mt-5 text-slate-300 leading-relaxed">
                {service.description}
              </p>
              <button
                className="
                  group
                  mt-8
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/20
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  hover:border-sky-400/50
                  hover:bg-white/5
                "
              >
                Learn More
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}