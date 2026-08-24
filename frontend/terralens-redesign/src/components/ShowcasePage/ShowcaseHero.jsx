import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/client";

export default function ShowcaseHero() {
  const [settings, setSettings] = useState(null);

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

  const backgroundVideo = settings?.showcase_video
    ? settings.showcase_video.startsWith("http")
      ? settings.showcase_video
      : `${import.meta.env.VITE_API_URL}${settings.showcase_video}`
    : null;

  const hasVideo = Boolean(backgroundVideo);

  /* =======================================================
     THEME
     ======================================================= */

  const theme = {
    sectionBg: "#ffffff",
    label: "#0ea5e9",
    heading: hasVideo ? "#ffffff" : "#0f172a",
    body: hasVideo ? "#d1d5db" : "#475569",

    gridLine: hasVideo
      ? "rgba(255,255,255,.2)"
      : "rgba(15,23,42,0.07)",

    bottomFade: hasVideo
      ? "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 55%, rgba(255,255,255,0.25) 100%)"
      : "linear-gradient(to bottom, rgba(255,255,255,0), #ffffff)",
  };

  const scrollToPortfolio = () => {
    document
      .getElementById("portfolio-section")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <section
      className="relative w-full overflow-hidden pb-40 mb-20"
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: theme.sectionBg,
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

      {hasVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: 1,
            zIndex: 0,
          }}
        >
          <source
            src={backgroundVideo}
            type="video/mp4"
          />
        </video>
      )}

      {/* =====================================================
          DARK READABILITY OVERLAY
      ===================================================== */}

      {hasVideo && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(2,6,23,0.45) 0%, rgba(2,6,23,0.20) 45%, rgba(2,6,23,0) 75%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      )}

      {/* =====================================================
          WHITE GLOW
          Only for the plain white section
      ===================================================== */}

      {!hasVideo && (
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            zIndex: 2,
          }}
        >
          <div
            className="
              absolute
              left-1/2
              top-0
              h-[500px]
              w-[500px]
              -translate-x-1/2
              rounded-full
              bg-white/[0.08]
              blur-[140px]
            "
          />

          <div
            className="
              absolute
              bottom-0
              left-0
              h-72
              w-72
              rounded-full
              bg-white/[0.05]
              blur-[120px]
            "
          />

          <div
            className="
              absolute
              top-20
              right-[-10%]
              h-96
              w-96
              rounded-full
              bg-white/[0.07]
              blur-[140px]
            "
          />
        </div>
      )}

      {/* =====================================================
          GRID
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
          backgroundImage: `linear-gradient(${theme.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${theme.gridLine} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-5xl
          mx-auto
          px-6
          flex
          flex-col
          items-center
          justify-center
          text-center
        "
      >
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
            w-full
            pt-38
          "
          style={{ color: theme.label }}
        >
          {settings?.showcase_label || "OUR SHOWCASE"}
        </motion.p>

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
            mb-8
            w-full
            tracking-tight
          "
          style={{ color: theme.heading }}
        >
          {settings?.showcase_title || "Featured Projects"}
        </motion.h1>

        <motion.p
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
            duration: 0.6,
          }}
          className="
            text-lg
            md:text-xl
            max-w-3xl
            mx-auto
            leading-relaxed
            mb-12
            w-full
          "
          style={{ color: theme.body }}
        >
          {settings?.showcase_subtitle ||
            "Explore our latest work across GIS, IT, Artificial Intelligence, IoT, Cloud Computing and Cybersecurity solutions delivered for governments, enterprises and infrastructure projects."}
        </motion.p>

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
          onClick={scrollToPortfolio}
          className="
            group
            inline-flex
            items-center
            justify-center
            rounded-full
            bg-sky-500
            text-white
            font-bold
            cursor-pointer
            transition-all
            duration-300
            hover:bg-sky-400
            hover:shadow-[0_0_35px_rgba(56,189,248,.35)]
            hover:-translate-y-1
          "
          style={{
            padding: "18px 40px",
            fontSize: "1.125rem",
            boxSizing: "border-box",
            border: "none",
          }}
        >
          {settings?.showcase_button_text || "Explore Projects"}

          <ArrowDown
            size={22}
            className="
              ml-2 animate-bounce
            "
          />
        </motion.button>
      </div>

      {/* =====================================================
          SOFT BOTTOM VIDEO FADE
      ===================================================== */}

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "100px",
          background: theme.bottomFade,
          pointerEvents: "none",
          zIndex: 20,
        }}
      />
    </section>
  );
}