import { NavLink, Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { getSettings } from "../../api/settings";

function Navbar() {
  const location = useLocation();
  const [showNavbar, setShowNavbar] = useState(true);
  const [settings, setSettings] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const lastScrollY = useRef(0);
  const isNavigating = useRef(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Products", path: "/products" },
    { name: "Showcase", path: "/showcase" },
    { name: "Careers", path: "/careers" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    isNavigating.current = true;
    setShowNavbar(true);
    setIsOpen(false);
    lastScrollY.current = 0;
    const timer = setTimeout(() => {
      isNavigating.current = false;
      lastScrollY.current = window.scrollY;
    }, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (isNavigating.current) {
        setShowNavbar(true);
        return;
      }
      const currentScroll = window.scrollY;
      const previousScroll = lastScrollY.current;

      if (currentScroll <= 20) {
        setShowNavbar(true);
      } else if (currentScroll > previousScroll) {
        setShowNavbar(false);
      } else if (currentScroll < previousScroll) {
        setShowNavbar(true);
      }
      lastScrollY.current = currentScroll;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoUrl = settings?.logo
    ? settings.logo.startsWith("http")
      ? settings.logo
      : `${import.meta.env.VITE_API_URL}${settings.logo}`
    : "";

  const companyName = settings?.company_name || "TerraLens Innovations";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-500 ease-in-out ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{
        background: "rgba(10, 10, 12, 0.12)",
        backdropFilter: "blur(22px) saturate(180%)",
        WebkitBackdropFilter: "blur(22px) saturate(180%)",
        boxShadow: "0 8px 40px rgba(255,255,255,0.08)",
      }}
    >
      {/* Outer container MUST be relative for absolute centering to work */}
      <div className="relative flex items-center justify-between w-full max-w-[1500px] mx-auto px-6 lg:px-11 h-[76px]">
        
        {/* =================================================
            LEFT — LOGO 
            ================================================= */}
        <div className="relative z-20 flex items-center shrink-0">
          <Link to="/" className="flex items-center gap-3 no-underline">
            {logoUrl && (
              <img
                src={logoUrl}
                alt={companyName}
                className="w-11 h-11 object-contain rounded-lg block"
              />
            )}
            <h1
              className="m-0 text-xl font-extrabold tracking-tight text-white whitespace-nowrap"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
            >
              {companyName}
            </h1>
          </Link>
        </div>

        <nav 
          className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 items-center gap-7 xl:gap-11 w-max ml-22" 
        >
          {links.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `relative py-2 text-[15px] font-extrabold whitespace-nowrap transition-all duration-300 no-underline ${
                  isActive
                    ? "text-white opacity-100 tracking-wide"
                    : "text-white opacity-90 hover:opacity-100 hover:tracking-wide"
                }`
              }
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
            >
              {({ isActive }) => (
                <>
                  {item.name}
                  <span
                    className={`absolute -bottom-1 left-0 right-0 h-[2px] bg-white rounded-full transition-all duration-300 transform origin-center ${
                      isActive
                        ? "opacity-100 scale-x-100 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                        : "opacity-0 scale-x-0"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="relative z-20 flex lg:hidden items-center justify-end shrink-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-white bg-transparent border-none cursor-pointer flex items-center justify-center"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* =================================================
          MOBILE DROPDOWN
          ================================================= */}
      {isOpen && (
        <div
          className="lg:hidden absolute top-[76px] left-0 w-full flex flex-col gap-5 p-6 border-t border-white/10"
          style={{
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(22px) saturate(180%)",
          }}
        >
          {links.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `relative py-2 text-base font-extrabold text-gray-900 no-underline transition-all duration-300 ${
                  isActive ? "opacity-100 tracking-wide" : "opacity-90"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}

export default Navbar;