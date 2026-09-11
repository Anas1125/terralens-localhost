import { motion } from "framer-motion";

export default function WhoWeAre() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-24 md:py-32">

      {/* =========================
          BACKGROUND GLOW
      ========================= */}
      <div
        className="
          pointer-events-none
          absolute
          left-[65%]
          top-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
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
          z-10
          mx-auto
          grid
          w-full
          max-w-7xl
          grid-cols-1
          items-center
          gap-16
          px-6
          lg:grid-cols-12
          lg:gap-20
          lg:px-8
        "
      >

        {/* =========================
            LEFT — TEXT
        ========================= */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="
            flex
            flex-col
            justify-center
            lg:col-span-6
            xl:col-span-5
          "
        >

          {/* LABEL */}
          <p
            className="
              text-sm
              font-bold
              uppercase
              tracking-[6px]
              text-sky-500
            "
          >
            WHO WE ARE
          </p>

          {/* HEADING */}
          <h2
            className="
              mt-7
              text-4xl
              font-extrabold
              leading-[1.08]
              tracking-tight
              text-slate-900
              md:text-5xl
              lg:text-6xl
            "
          >
            Building Tomorrow's
            <span className="mt-2 block text-sky-500">
              Geospatial Solutions
            </span>
          </h2>

          {/* ACCENT LINE */}
          <div
            className="
              mt-7
              h-1
              w-16
              rounded-full
              bg-sky-500
            "
          />

          {/* FIRST PARAGRAPH */}
          <p
            className="
              mt-8
              max-w-xl
              text-lg
              leading-8
              text-slate-500
              md:text-[1.1rem]
            "
          >
            Terralens Innovations Private Limited Is A 
            Multidisciplinary Technology Company Specializing 
            In Geospatial Intelligence, Artificial Intelligence, 
            And Enterprise Software Solutions. We Help Governments, 
            Research Institutions, And Private Organizations 
            Transform Complex Spatial Data Into Meaningful 
            Business Insights.
          </p>

          {/* SECOND PARAGRAPH */}
          <p
            className="
              mt-6
              max-w-xl
              text-lg
              leading-8
              text-slate-500
              md:text-[1.1rem]
            "
          >
            Combining Expertise In Gis, Remote Sensing, Cloud 
            Computing, And Software Engineering, We Deliver 
            Complete End To End Digital Solutions—from Satellite 
            Data Processing To Scalable Enterprise 
            Applications That Empower Smarter Decisions.
          </p>

        </motion.div>

        {/* =========================
            RIGHT — IMAGE
        ========================= */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="
            relative
            lg:col-span-6
            xl:col-span-6
            xl:col-start-7
          "
        >

          {/* SOFT GLOW */}
          <div
            className="
              pointer-events-none
              absolute
              -inset-6
              rounded-[3rem]
              bg-sky-100/60
              blur-3xl
            "
          />

          {/* IMAGE FRAME */}
          <div
            className="
              relative
              overflow-hidden
              rounded-[2.5rem]
              border
              border-slate-200
              bg-slate-100
              shadow-[0_25px_80px_-25px_rgba(15,23,42,0.20)]
            "
          >

            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200"
              alt="Terralens team"
              className="
                relative
                h-[400px]
                w-full
                object-cover
                transition-transform
                duration-700
                hover:scale-[1.03]
                md:h-[500px]
                lg:h-[540px]
              "
            />

            {/* SOFT IMAGE OVERLAY */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-slate-900/10
                via-transparent
                to-white/5
              "
            />

          </div>

          {/* =========================
              FLOATING LABEL
          ========================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="
              absolute
              -bottom-6
              left-6
              rounded-2xl
              border
              border-slate-200
              bg-white/95
              px-6
              py-4
              shadow-[0_15px_40px_rgba(15,23,42,0.12)]
              backdrop-blur-md
              md:left-8
            "
          >
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[3px]
                text-sky-500
              "
            >
              TERRALENS INNOVATIONS
            </p>

            <p
              className="
                mt-1
                text-sm
                font-semibold
                text-slate-800
              "
            >
              Geospatial Intelligence & Technology
            </p>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}