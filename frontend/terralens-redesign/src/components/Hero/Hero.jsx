import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import LiquidGlassButton from "../ui/LiquidGlassButton";

import { getSettings } from "../../api/settings";
import { getMedia } from "../../api/media";

function Hero() {
  const navigate = useNavigate();

  const [currentVideo, setCurrentVideo] = useState(0);
  const [videos, setVideos] = useState([]);
  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  /*
  =====================================================
  LOAD HERO VIDEOS
  =====================================================
  */

  useEffect(() => {
    const loadHeroVideos = async () => {
      try {
        const data = await getMedia();

        const heroVideos = data.filter((file) => {
          const filename = file.filename?.toLowerCase() || "";

          const isVideo =
            file.mime_type?.toLowerCase().startsWith("video/") ||
            /\.(mp4|webm|mov|avi|mkv)$/i.test(filename);

          return file.folder === "hero" && isVideo;
        });

        const sortedVideos = heroVideos.sort((a, b) =>
          a.filename.localeCompare(
            b.filename,
            undefined,
            {
              numeric: true,
            }
          )
        );

        setVideos(sortedVideos);
      } catch (error) {
        console.error("Failed to load hero videos:", error);
      }
    };

    loadHeroVideos();
  }, []);

  /*
  =====================================================
  LOAD SETTINGS
  =====================================================
  */

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error(
          "Failed to load homepage settings:",
          error
        );
      } finally {
        setSettingsLoading(false);
      }
    };

    loadSettings();
  }, []);

  /*
  =====================================================
  VIDEO URL
  =====================================================
  */

  const getVideoUrl = (path) => {
    if (!path) {
      return null;
    }

    if (path.startsWith("http")) {
      return path;
    }

    return `${import.meta.env.VITE_API_URL}${path}`;
  };

  /*
  =====================================================
  LETTER-BY-LETTER 3D REVEAL
  =====================================================
  */

  const letterReveal = {
    hidden: {
      opacity: 0,
      x: 35,
      y: -15,
      z: -180,
      rotateY: 70,
      rotateX: 10,
      scale: 0.9,
    },

    visible: (delay = 0) => ({
      opacity: 1,
      x: 0,
      y: 0,
      z: 0,
      rotateY: 0,
      rotateX: 0,
      scale: 1,

      transition: {
        duration: 0.9,
        delay,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  /*
  =====================================================
  AUTOMATIC VIDEO CHANGE
  =====================================================
  */

  useEffect(() => {
    if (videos.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentVideo(
        (prev) => (prev + 1) % videos.length
      );
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  }, [videos.length]);

  /*
  =====================================================
  RESET INDEX
  =====================================================
  */

  useEffect(() => {
    if (
      videos.length > 0 &&
      currentVideo >= videos.length
    ) {
      setCurrentVideo(0);
    }
  }, [videos.length, currentVideo]);

  /*
  =====================================================
  NEXT VIDEO
  =====================================================
  */

  const nextVideo = () => {
    if (videos.length === 0) {
      return;
    }

    setCurrentVideo(
      (prev) => (prev + 1) % videos.length
    );
  };

  /*
  =====================================================
  PREVIOUS VIDEO
  =====================================================
  */

  const prevVideo = () => {
    if (videos.length === 0) {
      return;
    }

    setCurrentVideo((prev) =>
      prev === 0
        ? videos.length - 1
        : prev - 1
    );
  };

  /*
  =====================================================
  CURRENT VIDEO
  =====================================================
  */

  const currentVideoPath =
    videos.length > 0
      ? videos[currentVideo]?.path
      : settings?.hero_video;

  const currentVideoUrl = getVideoUrl(currentVideoPath);

  const hasVideo = Boolean(currentVideoUrl);

  /*
  =====================================================
  THEME
  =====================================================
  */

  const theme = {
    labelClass: hasVideo
      ? "text-white/80"
      : "text-slate-500",

    headingClass: hasVideo
      ? "text-white"
      : "text-slate-900",

    headingShadow: hasVideo
      ? "0 4px 24px rgba(0,0,0,0.45), 0 1px 4px rgba(0,0,0,0.5)"
      : "none",

    subtitleClass: hasVideo
      ? "text-gray-100"
      : "text-slate-600",
  };

  /*
  =====================================================
  HERO
  =====================================================
  */

  return (
    <section
      className="
        relative
        h-screen
        min-h-[700px]
        overflow-hidden
        bg-white
      "
    >
      {/* =================================================
          BACKGROUND VIDEOS
      ================================================= */}

      {currentVideoUrl ? (
        <AnimatePresence
          initial={false}
          mode="sync"
        >
          <motion.video
            key={currentVideoUrl}
            autoPlay
            muted
            playsInline
            preload="auto"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
            }}
            className="
              absolute
              inset-0
              z-0
              h-full
              w-full
              object-cover
            "
            onError={(error) => {
              console.error(
                "Hero video failed:",
                error
              );
            }}
          >
            <source
              src={currentVideoUrl}
              type="video/mp4"
            />
          </motion.video>
        </AnimatePresence>
      ) : (
        <div
          className="
            absolute
            inset-0
            bg-white
          "
        />
      )}

      {/* =================================================
          DARK READABILITY OVERLAY
      ================================================= */}

      {hasVideo && (
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[1]
          "
          style={{
            background:
              "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(2,6,23,0.28) 0%, rgba(2,6,23,0.12) 45%, rgba(2,6,23,0) 75%)",
          }}
        />
      )}

      {/* =================================================
          SUBTLE DEPTH OVERLAY
      ================================================= */}

      {hasVideo && (
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[2]
          "
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, transparent 30%, transparent 75%, rgba(0,0,0,0.12) 100%)",
          }}
        />
      )}

      {/* =================================================
          SOFT BOTTOM FADE
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-[3]
        "
        style={{
          height: "100px",
          background: hasVideo
            ? "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.08) 55%, rgba(255,255,255,0.25) 100%)"
            : "linear-gradient(to bottom, transparent, #ffffff)",
        }}
      />

      {/* =================================================
          LEFT ARROW
      ================================================= */}

      {videos.length > 1 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "2rem",
            transform: "translateY(-50%)",
            zIndex: 20,
          }}
        >
          <LiquidGlassButton
            tone="dark"
            variant="secondary"
            shape="circle"
            ariaLabel="Previous video"
            onClick={prevVideo}
          >
            <ChevronLeft size={26} />
          </LiquidGlassButton>
        </div>
      )}

      {/* =================================================
          RIGHT ARROW
      ================================================= */}

      {videos.length > 1 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "2rem",
            transform: "translateY(-50%)",
            zIndex: 20,
          }}
        >
          <LiquidGlassButton
            tone="dark"
            variant="secondary"
            shape="circle"
            ariaLabel="Next video"
            onClick={nextVideo}
          >
            <ChevronRight size={26} />
          </LiquidGlassButton>
        </div>
      )}

      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="
          relative
          z-10
          flex
          h-full
          items-center
          justify-center
          px-6
        "
      >
        <div
          className="
            -mt-20
            text-center
          "
          style={{
            perspective: "1000px",
            perspectiveOrigin: "50% 50%",
            opacity: settingsLoading ? 0 : 1,
            transition: "opacity 0.2s ease",
          }}
        >
          {/* =================================================
              COMPANY NAME
          ================================================= */}

          <div className="mb-6">
            <motion.p
              key={`company-${
                settings?.company_name ||
                "TerraLens Innovations"
              }`}
              className={`
                text-sm
                font-medium
                uppercase
                tracking-[8px]
                ${theme.labelClass}
              `}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {(
                settings?.company_name ||
                "TerraLens Innovations"
              )
                .split("")
                .map((letter, index) => (
                  <motion.span
                    key={`${letter}-${index}`}
                    custom={
                      0.05 + index * 0.035
                    }
                    variants={letterReveal}
                    initial="hidden"
                    animate="visible"
                    className="
                      inline-block
                      will-change-transform
                    "
                    style={{
                      transformStyle:
                        "preserve-3d",
                      whiteSpace:
                        letter === " "
                          ? "pre"
                          : "normal",
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
            </motion.p>
          </div>

          {/* =================================================
              TITLE
          ================================================= */}

          <div>
            <motion.h1
              key={`title-${
                settings?.hero_title ||
                "TerraLens Homepage"
              }`}
              className={`
                text-4xl
                sm:text-5xl
                md:text-7xl
                lg:text-8xl
                font-bold
                leading-[0.95]
                tracking-tight
                ${theme.headingClass}
              `}
              style={{
                textShadow:
                  theme.headingShadow,
                transformStyle:
                  "preserve-3d",
              }}
            >
              {(
                settings?.hero_title ||
                "TerraLens Homepage"
              )
                .split("")
                .map((letter, index) => (
                  <motion.span
                    key={`${letter}-${index}`}
                    custom={
                      0.35 + index * 0.045
                    }
                    variants={letterReveal}
                    initial="hidden"
                    animate="visible"
                    className="
                      inline-block
                      will-change-transform
                    "
                    style={{
                      transformStyle:
                        "preserve-3d",
                      whiteSpace:
                        letter === " "
                          ? "pre"
                          : "normal",
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
            </motion.h1>
          </div>

          {/* =================================================
              SUBTITLE
          ================================================= */}

          <div className="mt-8">
            <motion.p
              key={`subtitle-${
                settings?.hero_subtitle ||
                "Hello From Terralens"
              }`}
              className={`
                mx-auto
                max-w-3xl
                text-xl
                leading-8
                ${theme.subtitleClass}
              `}
              style={{
                transformStyle:
                  "preserve-3d",
              }}
            >
              {(
                settings?.hero_subtitle ||
                "Hello From Terralens"
              )
                .split("")
                .map((letter, index) => (
                  <motion.span
                    key={`${letter}-${index}`}
                    custom={
                      1.15 + index * 0.025
                    }
                    variants={letterReveal}
                    initial="hidden"
                    animate="visible"
                    className="
                      inline-block
                      will-change-transform
                    "
                    style={{
                      transformStyle:
                        "preserve-3d",
                      whiteSpace:
                        letter === " "
                          ? "pre"
                          : "normal",
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
            </motion.p>
          </div>

          {/* =================================================
              BUTTONS
              
              Desktop:
              Normal position and size.

              Mobile:
              Smaller and pushed down.
          ================================================= */}

          <div
            className="
              mt-14
              flex
              justify-center
              gap-6

              max-md:mt-14
              max-md:translate-y-[150px]
              max-md:scale-[0.78]
              max-md:gap-3
            "
          >
            <LiquidGlassButton
              tone={
                hasVideo
                  ? "dark"
                  : "light"
              }
              variant="primary"
              onClick={() =>
                navigate(
                  settings?.hero_button_link ||
                    "/services"
                )
              }
            >
              {settings?.hero_button_text ||
                "Explore Solutions"}
            </LiquidGlassButton>

            <LiquidGlassButton
              tone={
                hasVideo
                  ? "dark"
                  : "light"
              }
              variant="secondary"
              onClick={() =>
                navigate("/showcase")
              }
            >
              View Projects
            </LiquidGlassButton>
          </div>
        </div>
      </div>

      {/* =================================================
          NAVIGATION DOTS
      ================================================= */}

      {videos.length > 1 && (
        <div
          className="
            absolute
            bottom-28
            left-1/2
            z-20
            flex
            -translate-x-1/2
            gap-3
          "
        >
          {videos.map((video, index) => (
            <button
              key={video.path}
              type="button"
              onClick={() =>
                setCurrentVideo(index)
              }
              aria-label={`Go to video ${
                index + 1
              }`}
              className={`
                cursor-pointer
                rounded-full
                transition-all
                duration-500

                ${
                  currentVideo === index
                    ? "h-2.5 w-8 bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]"
                    : "h-2.5 w-2.5 bg-white/40 hover:bg-white/70"
                }
              `}
            />
          ))}
        </div>
      )}

      {/* =================================================
          SCROLL INDICATOR
      ================================================= */}

      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
        }}
        className="
          absolute
          bottom-10
          left-1/2
          z-20
          -translate-x-1/2
        "
      >
        <div
          className="
            flex
            h-12
            w-7
            justify-center
            rounded-full
            border
            border-white/40
            bg-white/[0.03]
            backdrop-blur-sm
          "
        >
          <div
            className="
              mt-2
              h-3
              w-1
              rounded-full
              bg-white
            "
          />
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;