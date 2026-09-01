import { motion } from "framer-motion";
import { Building2, MapPin, Plane } from "lucide-react";

const offices = [
  {
    icon: Building2,
    title: "Corporate Headquarters",
    city: "Nagercoil",
    description:
      "Our headquarters driving innovation in GIS, AI and enterprise software solutions from the heart of South India.",
  },
  {
    icon: MapPin,
    title: "Main Office",
    city: "Mumbai",
    description:
      "Strategic operations hub connecting us with government agencies, enterprises and research institutions.",
  },
  {
    icon: Plane,
    title: "International Unit",
    city: "Singapore",
    description:
      "Supporting international clients across Southeast Asia with cutting-edge geospatial and IT services.",
  },
];

export default function GlobalOffices() {
  return (
    <section className="relative w-full overflow-hidden bg-white">

      {/* =========================
          BACKGROUND GLOW
      ========================= */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-20
          h-[500px]
          w-[700px]
          -translate-x-1/2
          rounded-full
          bg-sky-100/40
          blur-3xl
        "
      />

      {/* =========================
          MAIN CONTAINER
      ========================= */}
      <div
        className="
          relative
          mx-auto
          flex
          w-full
          max-w-[85rem]
          flex-col
          items-center
          px-6
          lg:px-8
        "
      >

        {/* =========================
            HEADER
        ========================= */}
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-3xl
            flex-col
            items-center
            justify-center
            text-center
          "
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="
              w-full
              text-center
              text-sm
              font-semibold
              uppercase
              tracking-[6px]
              text-sky-500
            "
          >
            OUR PRESENCE
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="
              mt-5
              w-full
              text-center
              text-5xl
              font-bold
              text-slate-900
              md:text-6xl
            "
          >
            Global Offices
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="
              mt-5
              w-full
              text-center
              text-lg
              leading-8
              text-slate-500
            "
          >
            Expanding innovation beyond borders with offices that connect
            technology, geospatial intelligence and enterprise solutions
            across multiple regions.
          </motion.p>
        </div>

        {/* =========================
            OFFICE CARDS
        ========================= */}
        <div
          className="
            mt-12
            grid
            w-full
            grid-cols-1
            gap-8
            md:grid-cols-3
            lg:gap-10
          "
        >
          {offices.map((office, index) => {
            const Icon = office.icon;

            return (
              <motion.div
                key={office.city}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                }}
                className="
                  group
                  flex
                  w-full
                  flex-col
                  items-start
                  rounded-[1.5rem]
                  border
                  border-slate-200
                  bg-white
                  p-6
                  text-left
                  shadow-[0_10px_40px_rgba(15,23,42,0.05)]
                  transition-all
                  duration-500
                  hover:border-sky-300
                  hover:shadow-[0_20px_50px_rgba(14,165,233,0.12)]
                  md:p-10
                "
              >

                {/* =========================
                    ICON
                ========================= */}
                <div
                  className="
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-[1.5rem]
                    border
                    border-sky-200
                    bg-sky-50
                    transition-transform
                    duration-500
                    group-hover:scale-110
                  "
                >
                  <Icon
                    size={26}
                    className="
                      text-sky-500
                      transition-colors
                      duration-500
                      group-hover:text-sky-600
                    "
                  />
                </div>

                {/* =========================
                    OFFICE TYPE
                ========================= */}
                <p
                  className="
                    mt-10
                    text-sm
                    font-semibold
                    uppercase
                    tracking-[4px]
                    text-sky-500
                  "
                >
                  {office.title}
                </p>

                {/* =========================
                    CITY
                ========================= */}
                <h3
                  className="
                    mt-4
                    text-4xl
                    font-bold
                    text-slate-900
                  "
                >
                  {office.city}
                </h3>

                {/* =========================
                    DESCRIPTION
                ========================= */}
                <p
                  className="
                    mt-6
                    text-lg
                    leading-relaxed
                    text-slate-500
                  "
                >
                  {office.description}
                </p>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}