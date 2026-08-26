import { Link, useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8fafc] flex items-center justify-center px-6">

      {/* Subtle map grid */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0f172a 1px, transparent 1px),
            linear-gradient(to bottom, #0f172a 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Soft radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-500/[0.035] blur-3xl" />

      {/* Decorative map lines */}
      <div className="absolute top-[18%] left-[8%] w-32 h-32 border border-slate-900/[0.06] rounded-full" />
      <div className="absolute top-[21%] left-[11%] w-20 h-20 border border-slate-900/[0.05] rounded-full" />

      <div className="absolute bottom-[12%] right-[8%] w-40 h-40 border border-slate-900/[0.06] rounded-full" />
      <div className="absolute bottom-[16%] right-[12%] w-24 h-24 border border-slate-900/[0.05] rounded-full" />

      {/* Main content */}
      <main className="relative z-10 w-full max-w-3xl text-center">

        {/* Coordinate label */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />

          <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-slate-500">
            Location not found
          </span>
        </div>

        {/* 404 */}
        <div className="relative mb-2">
          <h1 className="text-[8rem] sm:text-[10rem] md:text-[12rem] leading-none font-bold tracking-[-0.07em] text-slate-900">
            404
          </h1>

          {/* Small coordinate marker */}
          <div className="absolute top-[22%] right-[15%] sm:right-[22%] md:right-[25%]">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-blue-600 shadow-[0_0_0_6px_rgba(37,99,235,0.10)]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-blue-600/20 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
          Looks like you've gone off the map.
        </h2>

        {/* Description */}
        <p className="mt-5 mx-auto max-w-xl text-base sm:text-lg leading-8 text-slate-500">
          The page you're looking for doesn't exist, has moved, or the
          location you entered isn't available.
        </p>

        {/* Coordinates */}
        <div className="mt-6 flex items-center justify-center gap-3 text-[11px] font-mono tracking-wider text-slate-400 uppercase">
          <span>LAT — 00.0000°</span>
          <span className="text-slate-300">•</span>
          <span>LNG — 00.0000°</span>
        </div>

        {/* Actions */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">

          <Link
            to="/"
            className="inline-flex items-center justify-center min-w-[150px] px-6 py-3.5 rounded-lg bg-blue-700 text-white text-sm font-semibold shadow-sm hover:bg-blue-800 hover:shadow-md transition-all duration-200"
          >
            Back to Home
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center min-w-[150px] px-6 py-3.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-semibold shadow-sm hover:bg-slate-50 transition-all duration-200 cursor-pointer"
          >
            Go Back
          </button>

        </div>

        {/* Bottom brand text */}
        <div className="mt-14 text-xs tracking-[0.18em] uppercase text-slate-400">
          TerraLens · Geospatial Intelligence
        </div>

      </main>
    </div>
  );
}

export default NotFound;