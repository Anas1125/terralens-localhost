import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

function Statement() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [settings, setSettings] = useState(null);
  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data } = await api.get("/services/");

        const activeServices = data.filter(
          (service) => service.is_active !== false
        );

        setServices(activeServices.slice(0, 4));
      } catch (error) {
        console.error("Failed to load services:", error);
      }
    };

    loadServices();
  }, []);
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await api.get("/settings/");
        setSettings(data);
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    loadSettings();
  }, []);
  const getImageUrl = (path) => {
    if (!path) return null;

    if (path.startsWith("http")) {
      return path;
    }

    return `${import.meta.env.VITE_API_URL}${path}`;
  };

  return (
    <section className="relative w-full overflow-hidden bg-white">

      {/* =========================
          HERO TEXT
      ========================= */}
      <div
        className="
          relative
          z-10
          flex
          w-full
          flex-col
          items-center
          px-6
          pb-20
          pt-20
          text-center
        "
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="
            text-sm
            font-semibold
            uppercase
            tracking-[12px]
            text-slate-500
          "
        >
          TERRALENS INNOVATIONS
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="
            mt-6
            text-5xl
            font-bold
            leading-[0.92]
            tracking-tight
            text-slate-900
            md:text-6xl
            lg:text-7xl
          "
        >
          Engineering
          <br />
          Tomorrow's World
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="
            mx-auto
            mt-10
            w-full
            max-w-4xl
            px-8
            text-center
            text-lg
            leading-relaxed
            text-slate-500
            md:text-xl
          "
        >
          We combine geospatial intelligence with software engineering to
          deliver scalable solutions for governments, infrastructure, and
          enterprise projects.
        </motion.p>
      </div>

      {/* =========================
          STATEMENT IMAGE
      ========================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="
          relative
          mb-12
          w-full
          overflow-hidden
        "
      >
        {/* IMAGE */}
        <img
          src={
            getImageUrl(settings?.statement_image) ||
            "frontend/terralens-redesign/src/assets/images/survey.jpg"
          }
          alt="Engineering Team"
          className="
            h-[55vh]
            w-full
            object-cover
            opacity-45
          "
        />

        {/* =========================
            TOP FADE
        ========================= */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            h-10
            bg-gradient-to-b
            from-white
            via-white/70
            to-transparent
          "
        />

        {/* =========================
            BOTTOM FADE
        ========================= */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-10
            bg-gradient-to-t
            from-white
            via-white/70
            to-transparent
          "
        />

        {/* =========================
            SOFT OVERALL FADE
        ========================= */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-white/10
          "
        />
      </motion.div>

      {/* =========================
          BOTTOM CONTENT
      ========================= */}
      <div
        className="
          relative
          mx-auto
          w-full
          max-w-7xl
          px-8
          pb-32
          pt-20
        "
      >

        {/* =========================
            MAIN CONTENT GRID
        ========================= */}
        <div
          className="
            relative
            z-10
            grid
            items-center
            justify-center
            gap-24
            lg:grid-cols-[560px_520px]
          "
        >
          {/* =========================
              LEFT SIDE
          ========================= */}
          <div className="mx-auto w-full max-w-xl">

            {/* HEADER */}
            <div
              className="
                mb-10
                flex
                items-center
                justify-center
                gap-3
              "
            >
              <span
                className="
                  text-sm
                  font-bold
                  uppercase
                  tracking-[4px]
                  text-slate-500
                  md:text-base
                "
              >
                Our Core Services
              </span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0EA5E9"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                <path d="M2 12h20" />
              </svg>
            </div>

            {/* =========================
                SERVICES GRID
            ========================= */}
            <div
              className="
                mx-auto
                grid
                max-w-xl
                grid-cols-1
                gap-8
                sm:grid-cols-2
              "
            >
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{
                    y: -10,
                    scale: 1.03,
                  }}
                  className="
                    group
                    relative
                    flex
                    w-full
                    flex-col
                    items-center
                    justify-center
                    rounded-[1.5rem]
                    border
                    border-slate-200
                    bg-white
                    p-6
                    text-center
                    shadow-[0_8px_30px_rgba(15,23,42,0.05)]
                    transition-all
                    duration-500
                    hover:-translate-y-2
                    hover:border-sky-300
                    hover:bg-slate-50
                    hover:shadow-[0_15px_40px_rgba(15,23,42,0.10)]
                    lg:p-7
                  "
                >
                  {/* ICON */}
                  <div
                    className="
                      mx-auto
                      mb-4
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      text-3xl
                      text-sky-500
                      transition-colors
                      duration-500
                      group-hover:text-sky-600
                    "
                  >
                    {index === 0 && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-10 w-10"
                      >
                        <path d="M5 31c6-1 9-7 14-15l7 15 7-10 10 10" />
                        <path d="M5 36c8-1 13-5 19-5 7 0 11 4 19 2" />
                        <path d="M17 12c4-5 10-6 15-7" />
                        <path d="M29 9c5-2 9-1 13 1" />
                      </svg>
                    )}

                    {index === 1 && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-10 w-10"
                      >
                        <path d="M24 40V23" />
                        <path d="M24 27C15 27 9 21 9 12c9 0 15 5 15 15Z" />
                        <path d="M24 22c0-9 6-15 15-15 0 9-6 15-15 15Z" />
                        <path d="M16 40h16" />
                      </svg>
                    )}

                    {index === 2 && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-10 w-10"
                      >
                        <path d="M10 5h20l8 8v30H10z" />
                        <path d="M30 5v9h8" />
                        <path d="M16 23h13" />
                        <path d="M16 29h7" />
                        <circle cx="32" cy="34" r="7" />
                        <path d="m28.5 34 2.5 2.5 4.5-5" />
                      </svg>
                    )}

                    {index === 3 && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-10 w-10"
                      >
                        <path d="M19 5h10" />
                        <path d="M21 5v13L11 36a5 5 0 0 0 4 7h18a5 5 0 0 0 4-7L27 18V5" />
                        <path d="M15 32h18" />
                        <circle cx="24" cy="27" r="2" />
                        <circle cx="29" cy="23" r="1.5" />
                      </svg>
                    )}
                  </div>

                  {/* SERVICE NAME */}
                  <h4
                    className="
                      mb-2
                      w-full
                      text-center
                      text-2xl
                      font-bold
                      text-slate-900
                    "
                  >
                    {service.name}
                  </h4>

                  {/* SERVICE DESCRIPTION */}
                  <p
                    className="
                      w-full
                      text-center
                      text-base
                      leading-relaxed
                      text-slate-500
                    "
                  >
                    {service.description ||
                      "Professional geospatial solutions."}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* =========================
              RIGHT SIDE
          ========================= */}
          <div
            className="
              mx-auto
              w-full
              max-w-2xl
              pt-8
              lg:mx-0
              lg:pt-0
            "
          >
            <p
              className="
                text-xl
                leading-relaxed
                text-slate-600
                md:text-2xl
              "
            >
              TerraLens delivers intelligent geospatial solutions for
              construction, infrastructure, government, and enterprise
              projects through precision engineering, LiDAR, drone mapping,
              GIS analysis, and modern software development.
            </p>

            <button
              onClick={() => navigate("/services")}
              className="
                group
                mt-16
                inline-flex
                cursor-pointer
                items-center
                gap-3
                rounded-full
                border
                border-sky-300
                bg-sky-50
                px-10
                py-5
                text-lg
                font-medium
                text-sky-600
                shadow-[0_8px_25px_rgba(14,165,233,0.08)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-sky-400
                hover:bg-sky-500
                hover:text-white
                hover:shadow-[0_10px_30px_rgba(14,165,233,0.20)]
              "
            >
              Learn More

              <span
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              >
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Statement;