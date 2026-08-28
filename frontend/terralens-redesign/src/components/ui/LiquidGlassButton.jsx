import { useRef, useState } from "react";

function LiquidGlassButton({
  children,
  onClick,
  tone = "dark",
  variant = "primary",
  shape = "pill",
  ariaLabel,
  centerY = false,
  className = "",
  style = {},
}) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPos({ x, y });
    setTilt({
      x: ((y - 50) / 50) * -6,
      y: ((x - 50) / 50) * 6,
    });
  };

  const handleLeave = () => {
    setHovering(false);
    setTilt({ x: 0, y: 0 });
    setPos({ x: 50, y: 50 });
  };

  const isDark = tone === "dark";
  const isPrimary = variant === "primary";
  const isCircle = shape === "circle";
  const baseAlpha = isDark
    ? isPrimary
      ? 0.16
      : 0.09
    : isPrimary
      ? 0.55
      : 0.34;

  const textColor = isDark ? "#ffffff" : "#0f172a";

  const shapeClass = isCircle
    ? "h-14 w-14 rounded-full"
    : "px-10 py-4 rounded-full text-[17px] font-bold";

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleLeave}
      aria-label={ariaLabel}
      className={`relative isolate inline-flex cursor-pointer items-center justify-center outline-none transition-transform duration-300 ease-out ${shapeClass} ${className}`}
      style={{
        color: textColor,
        transform: `${centerY ? "translateY(-50%) " : ""}perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovering ? 1.045 : 1})`,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          background: `rgba(255,255,255,${baseAlpha})`,
          boxShadow: [
            "inset 0 1.5px 0 rgba(255,255,255,0.55)",
            "inset 0 -1.5px 0 rgba(255,255,255,0.12)",
            "inset 0 -2px 4px rgba(0,0,0,0.12)",
            "inset 2px 0 3px rgba(255,140,180,0.10)",
            "inset -2px 0 3px rgba(140,200,255,0.10)",
            hovering
              ? "0 16px 34px rgba(0,0,0,0.28)"
              : "0 10px 24px rgba(0,0,0,0.20)",
          ].join(", "),
          transition: "box-shadow 300ms ease, background 300ms ease",
        }}
      />
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, rgba(255,255,255,${hovering ? 0.55 : 0.28}), transparent 55%)`,
          mixBlendMode: "overlay",
          transition: "opacity 300ms ease",
        }}
      />
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)",
          opacity: 0.8,
        }}
      />

      <span className="relative flex items-center justify-center" style={{ transform: "translateZ(20px)" }}>
        {children}
      </span>
    </button>
  );
}

export default LiquidGlassButton;