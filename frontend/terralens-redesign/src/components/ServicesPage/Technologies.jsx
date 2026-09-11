import { motion } from "framer-motion";
import { technologies } from "../../data/technologies";

export default function Technologies({ activeTab = "Survey" }) {
  const tech = technologies[activeTab] || {};

  return (
    <section className="w-full bg-white py-16 md:py-20 overflow-hidden">
      
      {/* =========================
          HEADER
      ========================= */}
      <div className="w-full flex justify-center px-6">
        <div className="max-w-3xl flex flex-col items-center justify-center text-center">

          <p className="uppercase tracking-[6px] text-sky-500 text-sm font-semibold">
            TECHNOLOGY STACK
          </p>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900">
            Equipment & Technology
          </h2>

          <p className="mt-5 text-base md:text-lg text-slate-500 leading-7 md:leading-8">
            We Utilize Advanced Systems, Industry Leading Software, 
            And International Standards To Deliver Highly Accurate, 
            Scalable Solutions.
          </p>

        </div>
      </div>

      {/* =========================
          TECHNOLOGY CATEGORIES
      ========================= */}
      <div className="
        mt-16
        md:mt-18
        w-full
        max-w-7xl
        mx-auto
        px-6
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        gap-6
        lg:gap-8
      ">

        {Object.entries(tech).map(([category, items], index) => (
          <motion.div
            key={`${activeTab}-${category}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.08,
              duration: 0.5,
            }}
            whileHover={{ y: -6 }}
            className="
              group
              relative
              flex
              flex-col
              w-full
              rounded-[2rem]
              border
              border-slate-200
              bg-slate-50
              p-7
              md:p-8
              transition-all
              duration-300
              hover:border-sky-300
              hover:bg-white
              hover:shadow-[0_15px_40px_rgba(15,23,42,0.08)]
            "
          >

            {/* CATEGORY */}
            <h3 className="
              text-2xl
              font-bold
              text-slate-900
              capitalize
              mb-6
              transition-colors
              duration-300
              group-hover:text-sky-500
            ">
              {category}
            </h3>

            {/* ITEMS */}
            <ul className="space-y-3">

              {items.map((item) => (
                <li
                  key={item}
                  className="
                    flex
                    items-start
                    gap-3
                    text-slate-500
                    text-base
                    w-full
                    transition-colors
                    duration-300
                    hover:text-slate-900
                  "
                >

                  {/* DOT */}
                  <span className="
                    mt-[9px]
                    w-2
                    h-2
                    rounded-full
                    bg-sky-400
                    shrink-0
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  " />

                  {/* TEXT */}
                  <span className="
                    flex-1
                    break-words
                    leading-6
                  ">
                    {item}
                  </span>

                </li>
              ))}

            </ul>

          </motion.div>
        ))}

      </div>

    </section>
  );
}