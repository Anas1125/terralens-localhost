import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import { getSettings } from "../../api/settings";

export default function ProductsHero() {
  const [productsVideo, setProductsVideo] =
    useState("");

  /*
  =======================================================
  LOAD PRODUCTS VIDEO
  =======================================================
  */

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();

        if (data?.products_video) {
          const videoUrl =
            data.products_video.startsWith("http")
              ? data.products_video
              : `${import.meta.env.VITE_API_URL}${data.products_video}`;

          setProductsVideo(videoUrl);
        } else {
          setProductsVideo("");
        }
      } catch (error) {
        console.error(
          "Failed to load Products video:",
          error
        );

        setProductsVideo("");
      }
    };

    loadSettings();
  }, []);

  const hasVideo = Boolean(productsVideo);

  /*
  =======================================================
  THEME
  =======================================================
  */

  const theme = {
    sectionBg: "#ffffff",

    label: hasVideo
      ? "#38bdf8"
      : "#0ea5e9",

    heading: hasVideo
      ? "#ffffff"
      : "#0f172a",

    body: hasVideo
      ? "#d1d5db"
      : "#475569",

    gridLine: hasVideo
      ? "rgba(255,255,255,.2)"
      : "rgba(15,23,42,0.07)",
  };

  /*
  =======================================================
  SCROLL TO PRODUCTS
  =======================================================
  */

  const scrollToProducts = () => {
    document
      .getElementById("products-grid")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#ffffff",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >

      {/* =====================================================
          BACKGROUND VIDEO
      ===================================================== */}

      {productsVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: 1,
            zIndex: 0,
          }}
        >
          <source
            src={productsVideo}
            type="video/mp4"
          />
        </video>
      )}

      {/* =====================================================
          DARK READABILITY OVERLAY
      ===================================================== */}

      {hasVideo && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(2,6,23,0.45) 0%, rgba(2,6,23,0.20) 45%, rgba(2,6,23,0) 75%)",
            zIndex: 1,
          }}
        />
      )}

      {/* =====================================================
          BACKGROUND GLOW
          Only used when there is NO video
      ===================================================== */}

      {!hasVideo && (
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            zIndex: 2,
          }}
        >
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-white/[0.08] blur-[170px]" />

          <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-white/[0.05] blur-[140px]" />

          <div className="absolute top-20 right-[-10%] h-96 w-96 rounded-full bg-white/[0.07] blur-[170px]" />
        </div>
      )}

      {/* =====================================================
          GRID PATTERN
      ===================================================== */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.03]
          pointer-events-none
        "
        style={{
          zIndex: 3,
          backgroundImage:
            `linear-gradient(${theme.gridLine} 1px, transparent 1px),
             linear-gradient(90deg, ${theme.gridLine} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-4xl
          mx-auto
          px-6
          flex
          flex-col
          items-center
          justify-center
          text-center
        "
      >
        {/* LABEL */}

        <motion.p
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="
            uppercase
            tracking-[6px]
            text-sm
            font-bold
            mb-6
          "
          style={{
            color: theme.label,
          }}
        >
          OUR PRODUCTS
        </motion.p>

        {/* TITLE */}

        <motion.h1
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
            duration: 0.6,
          }}
          className="
            text-5xl
            md:text-6xl
            lg:text-7xl
            font-extrabold
            leading-tight
          "
          style={{
            color: theme.heading,
          }}
        >
          Software Products
        </motion.h1>

        {/* DESCRIPTION */}

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.3,
            duration: 0.6,
          }}
          className="
            mt-8
            max-w-3xl
            text-lg
            md:text-xl
            leading-relaxed
          "
          style={{
            color: theme.body,
          }}
        >
          Purpose-built software solutions by TerraLens
          Innovations — designed for GIS professionals,
          field surveyors, and municipal authorities.
        </motion.p>

        {/* BUTTON */}

        <motion.button
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.45,
            duration: 0.6,
          }}
          onClick={scrollToProducts}
          className="
            group
            mt-14
            inline-flex
            items-center
            justify-center
            rounded-full
            bg-sky-500
            px-5
            py-4
            text-lg
            font-bold
            text-white
            transition-all
            duration-300
            hover:bg-sky-400
            hover:shadow-[0_0_35px_rgba(56,189,248,.35)]
            hover:-translate-y-1
            cursor-pointer
          "
        >
          Explore Products

          <ArrowDown
            size={22}
            className="
              ml-2 animate-bounce
            "
          />
        </motion.button>
      </div>

      {/* =====================================================
          SOFT BOTTOM FADE
      ===================================================== */}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "100px",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 55%, rgba(255,255,255,0.25) 100%)",
          pointerEvents: "none",
          zIndex: 20,
        }}
      />
    </section>
  );
}