import { motion } from "framer-motion";
import {
  ArrowRight,
  Globe,
  MapPinned,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { getSettings } from "../../api/settings";

/* =========================================================
   SMOOTH BACKGROUND VIDEO
   ========================================================= */

function SmoothBackgroundVideo({ sources }) {
  const videoA = useRef(null);
  const videoB = useRef(null);

  const [activeVideo, setActiveVideo] = useState("a");

  const [indexA, setIndexA] = useState(0);

  const [indexB, setIndexB] = useState(
    sources.length > 1 ? 1 : 0
  );

  const transitioning = useRef(false);
  const currentIndex = useRef(0);

  const singleSource = sources.length <= 1;

  /* -------------------------------------------------------
     RESET WHEN VIDEO SOURCES CHANGE
     ------------------------------------------------------- */

  useEffect(() => {
    const first = videoA.current;
    const second = videoB.current;

    if (!first || !second || sources.length === 0) {
      return;
    }

    transitioning.current = false;
    currentIndex.current = 0;

    setIndexA(0);
    setIndexB(
      sources.length > 1 ? 1 % sources.length : 0
    );

    setActiveVideo("a");

    first.pause();
    second.pause();

    first.currentTime = 0;
    second.currentTime = 0;

    first.play().catch((error) => {
      if (error.name !== "AbortError") {
        console.error(
          "Background video playback failed:",
          error
        );
      }
    });

    return () => {
      first.pause();
      second.pause();
    };
  }, [sources]);

  /* -------------------------------------------------------
     CROSSFADE TO NEXT VIDEO
     ------------------------------------------------------- */

  const crossfade = () => {
    if (transitioning.current) return;

    if (sources.length < 2) {
      const current =
        activeVideo === "a"
          ? videoA.current
          : videoB.current;

      if (current) {
        current.currentTime = 0;
        current.play().catch(() => {});
      }

      return;
    }

    const nextIndex =
      (currentIndex.current + 1) % sources.length;

    const current =
      activeVideo === "a"
        ? videoA.current
        : videoB.current;

    const next =
      activeVideo === "a"
        ? videoB.current
        : videoA.current;

    if (!current || !next) return;

    transitioning.current = true;

    if (activeVideo === "a") {
      setIndexB(nextIndex);
    } else {
      setIndexA(nextIndex);
    }

    requestAnimationFrame(() => {
      next.currentTime = 0;

      next.play().catch((error) => {
        if (error.name !== "AbortError") {
          console.error(
            "Next background video playback failed:",
            error
          );
        }
      });
    });

    setActiveVideo(
      activeVideo === "a" ? "b" : "a"
    );

    currentIndex.current = nextIndex;

    setTimeout(() => {
      current.pause();
      current.currentTime = 0;

      transitioning.current = false;
    }, 1400);
  };

  /* -------------------------------------------------------
     WATCH VIDEO END
     ------------------------------------------------------- */

  const handleTimeUpdate = (event) => {
    if (transitioning.current) return;

    const video = event.currentTarget;

    if (!video.duration) return;

    const remaining =
      video.duration - video.currentTime;

    if (remaining <= 1.4) {
      crossfade();
    }
  };

  const handleEnded = (event) => {
    const video = event.currentTarget;

    video.currentTime = 0;
    video.play().catch(() => {});
  };

  if (!sources.length) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      {/* VIDEO A */}

      <video
        ref={videoA}
        src={sources[indexA]}
        muted
        playsInline
        autoPlay
        loop={singleSource}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: activeVideo === "a" ? 1 : 0,
          transition: "opacity 1.4s ease-in-out",
          zIndex: 1,
          filter: "contrast(1.25) saturate(1.15) brightness(1)",
        }}
      />

      {/* VIDEO B */}

      <video
        ref={videoB}
        src={sources[indexB]}
        muted
        playsInline
        loop={singleSource}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: activeVideo === "b" ? 1 : 0,
          transition: "opacity 1.4s ease-in-out",
          zIndex: 2,
        }}
      />

      {/* DARK READABILITY SCRIM */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(2,6,23,0.5) 0%, rgba(2,6,23,0.26) 30%, rgba(2,6,23,0.06) 55%, rgba(2,6,23,0) 70%)",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* =========================================================
   ABOUT HERO
   ========================================================= */

export default function AboutHero() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState(null);

  /* =======================================================
     LOAD CMS SETTINGS
     ======================================================= */

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();

        setSettings(data);
      } catch (error) {
        console.error(
          "Failed to load About settings:",
          error
        );
      }
    };

    loadSettings();
  }, []);

  /* =======================================================
     VIDEO URL
     ======================================================= */

  const getVideoUrl = (path) => {
    if (!path) return null;

    if (path.startsWith("http")) {
      return path;
    }

    return `${import.meta.env.VITE_API_URL}${path}`;
  };

  /* =======================================================
     GET ABOUT VIDEOS
     ======================================================= */

  const rawVideoList =
    settings?.about_videos &&
    Array.isArray(settings.about_videos)
      ? settings.about_videos
      : settings?.about_video
      ? [settings.about_video]
      : [];

  const backgroundVideos = useMemo(
    () =>
      rawVideoList
        .map(getVideoUrl)
        .filter(Boolean),
    [settings]
  );

  const hasVideo = backgroundVideos.length > 0;

  /* =======================================================
     DYNAMIC ABOUT CONTENT
     ======================================================= */

  const aboutLabel =
    settings?.about_label ||
    "ABOUT TERRALENS";

  const aboutTitle =
    settings?.about_title ||
    "Bridging Geospatial Intelligence & Digital Innovation";

  const aboutDescription =
    settings?.about_description ||
    "Terralens Innovations Private Limited empowers governments, enterprises and research institutions with precision-driven GIS, AI and software engineering solutions that transform complex spatial data into intelligent business decisions.";

  const expertiseLabel =
    settings?.about_expertise_label ||
    "EXPERTISE";

  const expertiseTitle =
    settings?.about_expertise_title ||
    "GIS + IT";

  const expertiseDescription =
    settings?.about_expertise_description ||
    "Remote Sensing, Artificial Intelligence, Enterprise Software, Cloud Infrastructure, Spatial Analytics & Web Platforms.";

  const projectsCount =
    settings?.about_projects_count ||
    "500+";

  const projectsLabel =
    settings?.about_projects_label ||
    "PROJECTS";

  const clientsCount =
    settings?.about_clients_count ||
    "100+";

  const clientsLabel =
    settings?.about_clients_label ||
    "CLIENTS";

  /* =======================================================
     THEME
     ======================================================= */

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

    contactBg: hasVideo
      ? "rgba(255,255,255,0.05)"
      : "rgba(15,23,42,0.03)",

    contactBorder: hasVideo
      ? "rgba(255,255,255,0.2)"
      : "rgba(15,23,42,0.3)",

    contactText: hasVideo
      ? "#ffffff"
      : "#0f172a",

    contactHoverClass: hasVideo
      ? "hover:border-sky-400/50 hover:bg-sky-500/10 hover:text-sky-400 hover:-translate-y-0.5 group"
      : "hover:border-sky-500/50 hover:bg-sky-500/5 hover:text-sky-600 hover:-translate-y-0.5 group",

    // RIGHT CARD — UNCHANGED
    cardBg: hasVideo
      ? "rgba(17,17,19,0.12)"
      : "rgba(255,255,255,0.5)",

    cardBorder: hasVideo
      ? "1px solid rgba(255,255,255,0.15)"
      : "1px solid rgba(15,23,42,0.10)",

    cardShadow: hasVideo
      ? "0 20px 80px -20px rgba(14,165,233,0.15)"
      : "0 20px 60px rgba(15,23,42,0.08)",

    cardHeading: hasVideo
      ? "#ffffff"
      : "#0f172a",

    cardBody: hasVideo
      ? "#d1d5db"
      : "#475569",

    bottomFade: hasVideo
      ? "linear-gradient(to bottom, transparent, rgba(5,5,5,0.9))"
      : "linear-gradient(to bottom, transparent, #ffffff)",

    headingShadow: hasVideo
      ? "0 4px 24px rgba(0,0,0,0.45)"
      : "none",

    cardTopHighlight: hasVideo
      ? "rgba(255,255,255,0.25)"
      : "rgba(14,165,233,0.2)",

    cardDivider: hasVideo
      ? "rgba(255,255,255,0.15)"
      : "rgba(15,23,42,0.1)",

    statLabel: hasVideo
      ? "#d1d5db"
      : "#475569",
  };

  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <section
      className="w-full"
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: theme.sectionBg,
        width: "100%",
        minHeight: "100vh",
        padding: "128px 0 96px 0",
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      {/* =================================================
          VIDEO
      ================================================= */}

      {hasVideo && (
        <SmoothBackgroundVideo
          sources={backgroundVideos}
        />
      )}

      {/* =================================================
          WHITE ATMOSPHERIC GLOW
          Only for non-video version
      ================================================= */}

      {!hasVideo && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-180px",
              left: "50%",
              width: "420px",
              height: "420px",
              transform: "translateX(-50%)",
              borderRadius: "9999px",
              background: "rgba(255,255,255,0.20)",
              filter: "blur(120px)",
            }}
          />

          <div
            style={{
              position: "absolute",
              right: "-120px",
              top: "35%",
              width: "380px",
              height: "380px",
              borderRadius: "9999px",
              background: "rgba(255,255,255,0.14)",
              filter: "blur(130px)",
            }}
          />
        </div>
      )}

      {/* =================================================
          VERY LIGHT GRID
      ================================================= */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          pointerEvents: "none",
          backgroundImage: `linear-gradient(${theme.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${theme.gridLine} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          zIndex: 5,
        }}
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16"
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: "85rem",
            margin: "0 auto",
            padding: "0 24px",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div
          style={{
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* LABEL */}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              margin: 0,
              marginBottom: "20px",
              textTransform: "uppercase",
              letterSpacing: "5px",
              fontSize: "0.75rem",
              fontWeight: "700",
              color: theme.label,
            }}
          >
            {aboutLabel}
          </motion.p>

          {/* HEADING */}

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.1,
              duration: 0.6,
            }}
            style={{
              margin: 0,
              fontSize: "clamp(2.7rem, 4.2vw, 4.2rem)",
              lineHeight: "1.08",
              fontWeight: "800",
              letterSpacing: "-0.04em",
              color: theme.heading,
              textShadow: theme.headingShadow,
            }}
          >
            {aboutTitle}
          </motion.h1>

          {/* DESCRIPTION */}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.25,
              duration: 0.6,
            }}
            style={{
              margin: 0,
              marginTop: "32px",
              maxWidth: "650px",
              fontSize: "1rem",
              lineHeight: "1.75",
              fontWeight: "500",
              color: theme.body,
            }}
          >
            {aboutDescription}
          </motion.p>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.4,
              duration: 0.6,
            }}
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
              marginTop: "44px",
            }}
          >
            {/* EXPLORE */}

            <button
              type="button"
              onClick={() => navigate("/services")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "16px 34px",
                borderRadius: "9999px",
                background: "#0ea5e9",
                border: "1px solid #0ea5e9",
                color: "#ffffff",
                fontSize: "1rem",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow:
                  "0 10px 30px rgba(14,165,233,0.35)",
              }}
              className="
                hover:bg-sky-400
                hover:border-sky-400
                hover:-translate-y-0.5
                hover:shadow-[0_15px_35px_rgba(14,165,233,0.45)]
                group
              "
            >
              Explore Our Services

              <ArrowRight
                size={18}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </button>

            {/* CONTACT */}

            <button
              type="button"
              onClick={() => navigate("/contact")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "16px 34px",
                borderRadius: "9999px",
                background: theme.contactBg,
                border: `1px solid ${theme.contactBorder}`,
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                color: theme.contactText,
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              className={theme.contactHoverClass}
            >
              Contact Us

              <ArrowRight
                size={18}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </button>
          </motion.div>
        </div>

        {/* =================================================
            RIGHT GLASS CARD
            KEPT UNCHANGED
        ================================================= */}

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.25,
            duration: 0.7,
          }}
          style={{
            position: "relative",
            width: "100%",
            minHeight: "500px",
            padding: "42px",
            borderRadius: "40px",
            background: theme.cardBg,
            border: theme.cardBorder,
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            boxShadow: theme.cardShadow,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {/* CARD TOP HIGHLIGHT */}

          <div
            style={{
              position: "absolute",
              top: 0,
              left: "8%",
              right: "8%",
              height: "1px",
              background:
                theme.cardTopHighlight,
              pointerEvents: "none",
            }}
          />

          {/* ICON */}

          <div
            style={{
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "18px",
              background:
                "rgba(14,165,233,0.15)",
              border:
                "1px solid rgba(56,189,248,0.35)",
              marginBottom: "28px",
            }}
          >
            <Globe
              size={26}
              className="text-sky-400"
            />
          </div>

          {/* EXPERTISE */}

          <p
            style={{
              margin: 0,
              marginBottom: "14px",
              textTransform: "uppercase",
              letterSpacing: "5px",
              color: theme.label,
              fontSize: "0.75rem",
              fontWeight: "700",
            }}
          >
            {expertiseLabel}
          </p>

          {/* GIS + IT */}

          <h2
            style={{
              margin: 0,
              fontSize:
                "clamp(2.2rem, 3vw, 3rem)",
              fontWeight: "800",
              letterSpacing: "-0.04em",
              color: theme.cardHeading,
            }}
          >
            {expertiseTitle}
          </h2>

          {/* DESCRIPTION */}

          <p
            style={{
              margin: 0,
              marginTop: "26px",
              maxWidth: "620px",
              color: theme.cardBody,
              fontSize: "1rem",
              lineHeight: "1.75",
              fontWeight: "500",
            }}
          >
            {expertiseDescription}
          </p>

          {/* DIVIDER */}

          <div
            style={{
              width: "100%",
              height: "1px",
              margin: "42px 0",
              background: theme.cardDivider,
            }}
          />

          {/* STATS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: "30px",
            }}
          >
            {/* PROJECTS */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}
            >
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "17px",
                  background:
                    "rgba(14,165,233,0.15)",
                  border:
                    "1px solid rgba(56,189,248,0.35)",
                }}
              >
                <MapPinned
                  size={23}
                  className="text-sky-400"
                />
              </div>

              <div>
                <h3
                  style={{
                    margin: 0,
                    color: theme.cardHeading,
                    fontSize: "1.75rem",
                    lineHeight: "1",
                    fontWeight: "800",
                  }}
                >
                  {projectsCount}
                </h3>

                <p
                  style={{
                    margin: 0,
                    marginTop: "8px",
                    color: theme.statLabel,
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {projectsLabel}
                </p>
              </div>
            </div>

            {/* CLIENTS */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}
            >
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "17px",
                  background:
                    "rgba(14,165,233,0.15)",
                  border:
                    "1px solid rgba(56,189,248,0.35)",
                }}
              >
                <Globe
                  size={23}
                  className="text-sky-400"
                />
              </div>

              <div>
                <h3
                  style={{
                    margin: 0,
                    color: theme.cardHeading,
                    fontSize: "1.75rem",
                    lineHeight: "1",
                    fontWeight: "800",
                  }}
                >
                  {clientsCount}
                </h3>

                <p
                  style={{
                    margin: 0,
                    marginTop: "8px",
                    color: theme.statLabel,
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {clientsLabel}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* =================================================
          SOFT BOTTOM FADE
      ================================================= */}

      <div
        className="
          absolute
          bottom-0
          left-0
          w-full
          pointer-events-none
        "
        style={{
          height: "100px",
          zIndex: 20,
          background: hasVideo
            ? "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.08) 55%, rgba(255,255,255,0.25) 100%)"
            : "linear-gradient(to bottom, transparent, #ffffff)",
        }}
      />
    </section>
  );
}