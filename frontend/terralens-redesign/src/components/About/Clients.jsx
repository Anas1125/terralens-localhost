import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../../api/client";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const { data } = await api.get("/partners/");

      const clientItems = data.filter(
        (item) =>
          item.type?.toLowerCase() === "client" &&
          item.is_active !== false
      );

      setClients(clientItems);
    } catch (error) {
      console.error("Failed to load clients:", error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (logo) => {
    if (!logo) return "";

    if (logo.startsWith("http")) {
      return logo;
    }

    return `${import.meta.env.VITE_API_URL}${logo}`;
  };

  return (
    <section className="w-full bg-white pb-32">

      <div className="w-full max-w-[85rem] mx-auto px-6 lg:px-8 flex flex-col items-center">

        {/* =========================
            HEADER
        ========================= */}
        <div className="w-full flex flex-col items-center justify-center text-center max-w-3xl mx-auto">

          <p className="uppercase tracking-[6px] text-sky-500 text-sm font-semibold w-full text-center">
            OUR CLIENTS
          </p>

          <h2 className="mt-8 text-5xl font-bold text-slate-900 w-full text-center">
            Trusted by Leading Organizations
          </h2>

          <p className="mt-8 text-lg text-slate-500 leading-9 w-full text-center">
            Governments, Research Institutions and Enterprises Trust
            TerraLens to Deliver Innovative GIS, AI and Enterprise
            Software Solutions Across Multiple Industries.
          </p>

        </div>

        {/* =========================
            LOADING
        ========================= */}
        {loading && (
          <div className="mt-28 text-center text-slate-500">
            Loading clients...
          </div>
        )}

        {/* =========================
            EMPTY STATE
        ========================= */}
        {!loading && clients.length === 0 && (
          <div className="mt-28 text-center text-slate-400">
            No clients available at the moment.
          </div>
        )}

        {/* =========================
            CLIENT GRID
        ========================= */}
        {!loading && clients.length > 0 && (
          <div className="mt-28 w-full grid gap-8 lg:gap-10 grid-cols-2 lg:grid-cols-4">

            {clients.map((client, index) => (
              <motion.div
                key={client.id}
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
                  overflow-hidden
                  rounded-[2.5rem]
                  border
                  border-slate-200
                  bg-white
                  h-56
                  flex
                  flex-col
                  items-center
                  justify-center
                  shadow-[0_10px_35px_rgba(15,23,42,0.05)]
                  transition-all
                  duration-500
                  hover:border-sky-300
                  hover:shadow-[0_20px_45px_rgba(14,165,233,0.12)]
                "
              >

                {/* =========================
                    GLOW
                ========================= */}
                <div
                  className="
                    absolute
                    -top-20
                    right-0
                    w-40
                    h-40
                    rounded-full
                    bg-sky-100
                    blur-3xl
                    opacity-0
                    group-hover:opacity-100
                    transition
                    pointer-events-none
                  "
                />

                {/* =========================
                    LOGO
                ========================= */}
                {client.logo ? (
                  <img
                    src={getImageUrl(client.logo)}
                    alt={client.name}
                    className="
                      relative
                      h-16
                      md:h-20
                      w-auto
                      max-w-[180px]
                      object-contain
                      opacity-80
                      transition-all
                      duration-500
                      group-hover:opacity-100
                      group-hover:scale-110
                    "
                  />
                ) : (
                  <div
                    className="
                      relative
                      h-20
                      flex
                      items-center
                      justify-center
                      text-slate-400
                    "
                  >
                    No Logo
                  </div>
                )}

                {/* =========================
                    NAME
                ========================= */}
                <h3
                  className="
                    relative
                    mt-8
                    text-lg
                    md:text-xl
                    font-semibold
                    text-slate-900
                    transition-colors
                    duration-300
                    group-hover:text-sky-500
                  "
                >
                  {client.name}
                </h3>

              </motion.div>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}