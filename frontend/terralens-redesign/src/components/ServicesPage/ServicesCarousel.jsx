import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function ServicesCarousel({
  activeTab = "survey",
  services = [],
}) {
  const navigate = useNavigate();

  const carouselRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const cards = services.filter(
    (service) =>
      service.category === activeTab &&
      service.is_active !== false
  );

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel || cards.length <= 1) return;

    let animationFrame;
    let lastTime = performance.now();

    const speed = 0.04;

    const scroll = (time) => {
      const delta = time - lastTime;
      lastTime = time;

      if (!isHovered) {
        carousel.scrollLeft += delta * speed;
        const halfWidth = carousel.scrollWidth / 2;
        if (carousel.scrollLeft >= halfWidth) {
          carousel.scrollLeft -= halfWidth;
        }
      }

      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isHovered, cards.length]);

  const loopedCards = [...cards, ...cards];

  return (
    <section className="w-full bg-white py-16 md:py-20 overflow-hidden">

      {/* =========================
          HEADER
      ========================= */}
      <div className="w-full text-center px-6 mb-12">

        <p className="uppercase tracking-[6px] text-sky-500 text-sm font-semibold">
          OUR SERVICES
        </p>

        <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900">
          Explore Our Services
        </h2>

        <p className="mt-5 mx-auto max-w-2xl text-base md:text-lg text-slate-500 leading-relaxed">
          Discover our specialized geospatial, surveying, GIS and
          technology solutions designed for complex real-world projects.
        </p>

      </div>

      {/* =========================
          CAROUSEL
      ========================= */}
      <motion.div
        ref={carouselRef}
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="
          flex
          gap-7
          overflow-x-auto
          px-6
          md:px-8
          pt-4
          pb-4
          [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style:none]
          [scrollbar-width:none]
        "
      >

        {loopedCards.map((card, index) => (

          <motion.div
            key={`${card.id}-${index}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (index % cards.length) * 0.08 }}

            whileHover={{
              y: -8,
            }}

            className="
              group
              relative
              flex-shrink-0
              w-[310px]
              md:w-[330px]
              h-[470px]
              rounded-[2.25rem]
              overflow-hidden
              border
              border-slate-200
              bg-white
              snap-start
              cursor-pointer
              transition-all
              duration-300
              hover:border-sky-300
              hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]
            "
          >

            {/* =========================
                IMAGE
            ========================= */}

            <img
              src={
                card.image
                  ? card.image.startsWith("http")
                    ? card.image
                    : `${import.meta.env.VITE_API_URL}${card.image}`
                  : ""
              }
              alt={card.name}
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
                transition-transform
                duration-700
                group-hover:scale-105
              "
            />

            {/* =========================
                IMAGE OVERLAY
            ========================= */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-slate-950/95
                via-slate-950/45
                to-transparent
              "
            />

            {/* =========================
                CONTENT
            ========================= */}

            <div className="absolute bottom-0 left-0 right-0 p-7">

              <p className="
                uppercase
                tracking-[5px]
                text-sky-400
                text-xs
                font-bold
              ">
                SERVICE
              </p>

              <h3 className="
                mt-3
                text-2xl
                md:text-3xl
                font-bold
                text-white
                leading-tight
              ">
                {card.name}
              </h3>

              <p className="
                mt-4
                text-sm
                md:text-base
                text-white/75
                leading-7
                line-clamp-4
              ">
                {card.description}
              </p>

              <button
                onClick={() =>
                  navigate(`/services/${card.slug}`)
                }
                className="
                  group/button
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  text-white
                  font-semibold
                  transition-all
                  duration-300
                  hover:text-sky-400
                  cursor-pointer
                "
              >
                Learn More

                <ArrowRight
                  size={18}
                  className="
                    transition-transform
                    duration-300
                    group-hover/button:translate-x-1.5
                  "
                />
              </button>

            </div>

          </motion.div>

        ))}

      </motion.div>

    </section>
  );
}