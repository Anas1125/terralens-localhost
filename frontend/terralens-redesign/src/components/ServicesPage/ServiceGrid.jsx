import { ArrowRight, MapPinned } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    title: "LiDAR Survey",
    description:
      "High-accuracy airborne and terrestrial LiDAR mapping for engineering and infrastructure projects.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Drone Survey",
    description:
      "Fast aerial mapping, orthomosaics, DSM, DTM and inspection using UAV technology.",
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Pipeline Survey",
    description:
      "Corridor mapping and alignment surveys for oil, gas and utility infrastructure.",
    image:
      "https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Web GIS",
    description:
      "Interactive GIS dashboards and cloud-based spatial information systems.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "AI Analytics",
    description:
      "Artificial intelligence for satellite imagery, object detection and predictive analysis.",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Enterprise Software",
    description:
      "Modern enterprise software, cloud infrastructure and scalable business platforms.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function ServiceGrid() {
  return (
    <section  className="bg-white py-20 w-full flex justify-center" id="services-list">
      <div className="w-full max-w-[85rem] mx-auto px-6 lg:px-8 flex flex-col items-center">
        <div className="w-full flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
          <p className="uppercase tracking-[6px] text-sky-400 text-sm font-semibold w-full text-center">
            OUR EXPERTISE
          </p>

          <h2 className="mt-8 text-5xl font-bold text-white w-full text-center">
            Explore Our Services
          </h2>

          <p className="mt-8 text-lg text-gray-400 leading-9 w-full text-center">
            Comprehensive GIS, Survey, AI and Enterprise software solutions
            designed for governments, research institutions and businesses.
          </p>
        </div>
        <div className="mt-28 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">

          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="
                group
                flex
                flex-col
                overflow-hidden
                rounded-[2.5rem]
                bg-[#111113]
                border
                border-white/10
                transition-all
                duration-500
                hover:border-sky-400/40
                hover:shadow-[0_0_40px_rgba(56,189,248,.15)]
              "
            >
              {/* Image Section */}
              <div className="relative h-64 md:h-72 w-full overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="
                    w-full
                    h-full
                    object-cover
                    group-hover:scale-110
                    transition-transform
                    duration-700
                  "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-[#111113]/20 to-transparent pointer-events-none" />
              </div>

              {/* Text Content Section */}
              <div className="p-10 flex flex-col flex-grow">
                <div className="w-14 h-14 rounded-[1.25rem] bg-sky-500/10 flex items-center justify-center shrink-0 mb-8 border border-sky-400/10">
                  <MapPinned className="text-sky-400" size={26} />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  {service.title}
                </h3>

                <p className="text-gray-400 leading-relaxed flex-grow">
                  {service.description}
                </p>

                <button
                  className="
                    mt-8
                    flex
                    items-center
                    gap-3
                    text-sky-400
                    font-semibold
                    transition-all
                    duration-300
                    group-hover:gap-5
                    cursor-pointer
                  "
                >
                  Learn More
                  <ArrowRight size={20} className="transition-transform duration-300" />
                </button>
              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}