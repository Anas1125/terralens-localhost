import {
  ArrowRight,
  MapPinned,
  BrainCircuit,
  Cloud,
  Plane,
  Code2,
  Database,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "GIS & Remote Sensing",
    icon: MapPinned,
    technologies: [
      "ArcGIS",
      "QGIS",
      "Google Earth Engine",
      "Remote Sensing",
      "WebGIS",
    ],
  },
  {
    name: "Programming & Scripting",
    icon: Code2,
    technologies: [
      "Python",
      "JavaScript",
      "TypeScript",
      "React",
      "Django",
    ],
  },
  {
    name: "Web Mapping",
    icon: MapPinned,
    technologies: [
      "Leaflet",
      "Mapbox",
      "OpenLayers",
      "GeoServer",
      "WebGIS",
    ],
  },
  {
    name: "Databases",
    icon: Database,
    technologies: [
      "PostgreSQL",
      "PostGIS",
      "MySQL",
      "SQLite",
      "MongoDB",
    ],
  },
  {
    name: "Machine Learning",
    icon: BrainCircuit,
    technologies: [
      "Python",
      "Scikit-learn",
      "TensorFlow",
      "PyTorch",
      "Computer Vision",
    ],
  },
  {
    name: "Cloud & DevOps",
    icon: Cloud,
    technologies: [
      "AWS",
      "Microsoft Azure",
      "Docker",
      "Git",
      "CI/CD",
    ],
  },
  {
    name: "Drone & Surveying",
    icon: Plane,
    technologies: [
      "Drone Mapping",
      "LiDAR",
      "Photogrammetry",
      "GNSS",
      "Total Station",
    ],
  },
  {
    name: "Web & Mobile",
    icon: Code2,
    technologies: [
      "React",
      "React Native",
      "Node.js",
      "Django",
      "REST APIs",
    ],
  },
];

export default function Technology() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full bg-white pb-40 mb-2">

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center">

  {/* =========================
      HEADING
  ========================= */}
  <div className="w-full flex flex-col items-center justify-center text-center">

    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="uppercase tracking-[5px] text-sky-500 text-sm font-semibold"
    >
      OUR TECHNOLOGY STACK
    </motion.p>

    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight"
    >
      Technologies{" "}
      <span className="text-sky-500">We Use</span>
    </motion.h2>

    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="mt-8 max-w-3xl text-lg md:text-xl text-slate-500 leading-relaxed"
    >
      TerraLens Combines Enterprise GIS, Cloud Infrastructure, 
      Artificial Intelligence, Surveying Technologies And 
      Modern Software Engineering Into One Integrated Ecosystem.
    </motion.p>

  </div>

  {/* =========================
      TECHNOLOGY CARDS
  ========================= */}
  <div className="mt-20 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

    {categories.map((item, i) => {
      const Icon = item.icon;

      return (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className="
            group
            relative
            w-full
            rounded-[1.5rem]
            bg-white
            border
            border-slate-200
            p-6
            transition-all
            duration-500
            hover:-translate-y-1.5
            hover:border-sky-300
            hover:shadow-[0_15px_40px_rgba(15,23,42,0.10)]
            flex
            flex-col
            text-left
          "
        >

          {/* ICON + CATEGORY */}
          <div className="flex items-center gap-4 mb-6">

            <div
              className="
                w-12
                h-12
                shrink-0
                rounded-xl
                bg-sky-50
                border
                border-sky-100
                flex
                items-center
                justify-center
              "
            >
              <Icon
                size={20}
                className="text-sky-500"
              />
            </div>

            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {item.name}
            </h3>

          </div>

          {/* TECHNOLOGY LIST */}
          <ul className="space-y-2.5 text-[15px] text-slate-500 font-medium">

            {item.technologies.map((tech) => (

              <li
                key={tech}
                className="flex items-center gap-3"
              >

                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />

                {tech}

              </li>

            ))}

          </ul>

        </motion.div>
      );
    })}

  </div>

  {/* SPACER */}
  <div className="h-12 w-full shrink-0" />

  {/* BUTTON */}
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    className="flex justify-center w-full"
  >

    <button
      onClick={() => navigate("/showcase")}
      className="
        group
        flex
        items-center
        gap-4
        rounded-full
        border
        border-sky-400
        bg-sky-50
        px-10
        py-4
        text-sky-600
        text-lg
        font-semibold
        transition-all
        duration-300
        hover:bg-sky-500
        hover:text-white
        hover:scale-105
        hover:shadow-[0_10px_30px_rgba(14,165,233,0.25)]
        cursor-pointer
      "
    >
      View Full Technology Stack

      <ArrowRight
        size={20}
        className="
          transition-transform
          duration-300
          group-hover:translate-x-1.5
        "
      />
    </button>

  </motion.div>

</div>

    </section>
  );
}