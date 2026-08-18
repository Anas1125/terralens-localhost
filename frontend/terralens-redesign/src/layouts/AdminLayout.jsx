import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSettings } from "../api/settings";
import {
  LayoutDashboard,
  Settings,
  Image,
  Package,
  Briefcase,
  Images,
  BriefcaseBusiness,
  FileText,
  Mail,
  Handshake,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    items: [
      {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "Website",
    items: [
      {
        name: "Settings",
        path: "/admin/settings",
        icon: Settings,
      },
      {
        name: "Media Library",
        path: "/admin/media",
        icon: Image,
      },
    ],
  },

  {
    title: "Content",
    items: [
      {
        name: "Products",
        path: "/admin/products",
        icon: Package,
      },
      {
        name: "Services",
        path: "/admin/services",
        icon: Briefcase,
      },
      {
        name: "Showcase",
        path: "/admin/showcase",
        icon: Images,
      },
      {
        name: "Clients & Partners",
        path: "/admin/partners",
        icon: Handshake,
      },
    ],
  },

  {
    title: "Careers",
    items: [
      {
        name: "Jobs",
        path: "/admin/jobs",
        icon: BriefcaseBusiness,
      },
      {
        name: "Applications",
        path: "/admin/applications",
        icon: FileText,
      },
    ],
  },

  {
    title: "Communication",
    items: [
      {
        name: "Contacts",
        path: "/admin/contacts",
        icon: Mail,
      },
    ],
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");

    navigate("/admin/login", {
      replace: true,
    });
  };

  useEffect(() => {
    const loadFavicon = async () => {
      try {
        const settings = await getSettings();

        if (!settings?.favicon) return;

        const faviconUrl = settings.favicon.startsWith("http")
          ? settings.favicon
          : `${import.meta.env.VITE_API_URL}${settings.favicon}`;

        let favicon = document.querySelector("link[rel='icon']");

        if (!favicon) {
          favicon = document.createElement("link");
          favicon.rel = "icon";
          document.head.appendChild(favicon);
        }

        favicon.href = `${faviconUrl}?v=${Date.now()}`;
      } catch (error) {
        console.error("Failed to load favicon:", error);
      }
    };

    loadFavicon();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#f8fafc",
        color: "#0f172a",
      }}
    >
      {/* =====================================================
          MOBILE HEADER
      ====================================================== */}

      <header className="mobile-admin-header">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open admin menu"
        >
          <Menu size={22} />
        </button>

        <span>TerraLens CMS</span>
      </header>

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {mobileMenuOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`admin-sidebar ${
          mobileMenuOpen ? "mobile-open" : ""
        }`}
        style={{
          width: "270px",
          height: "100vh",
          flexShrink: 0,
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          overflowY: "auto",
          overflowX: "hidden",
          boxSizing: "border-box",
          background: "#ffffff",
          borderRight: "1px solid #e2e8f0",
          padding: "32px 24px",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Mobile close button */}

        <button
          type="button"
          className="mobile-close-button"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close admin menu"
        >
          <X size={22} />
        </button>

        {/* ===================================================
            LOGO / TITLE
        ==================================================== */}

        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: "700",
            marginBottom: "50px",
            color: "#0f172a",
          }}
        >
          TerraLens CMS
        </h1>

        {/* ===================================================
            NAVIGATION
        ==================================================== */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "28px",
              overflowY: "auto",
              paddingRight: "4px",
            }}
          >
            {menu.map((section) => (
              <div key={section.title}>
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    marginBottom: "12px",
                    fontWeight: "600",
                  }}
                >
                  {section.title}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {section.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        style={({ isActive }) => ({
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "14px 18px",
                          borderRadius: "12px",
                          textDecoration: "none",

                          color: isActive
                            ? "#0284c7"
                            : "#475569",

                          background: isActive
                            ? "#e0f2fe"
                            : "transparent",

                          transition: ".3s",
                          fontWeight: 500,

                          border: isActive
                            ? "1px solid #bae6fd"
                            : "1px solid transparent",
                        })}
                      >
                        <Icon size={18} />

                        {item.name}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* =================================================
              LOGOUT
          ================================================== */}

          <button
            type="button"
            onClick={handleLogout}
            style={{
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              width: "100%",
              padding: "14px 18px",
              borderRadius: "12px",
              border: "1px solid #fecaca",
              background: "#fef2f2",
              color: "#dc2626",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              transition: ".3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fee2e2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fef2f2";
            }}
          >
            <LogOut size={18} />

            Logout
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main
        className="admin-main"
        style={{
          marginLeft: "270px",
          width: "calc(100% - 270px)",
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          padding: "40px",
          boxSizing: "border-box",
          background: "#f8fafc",
        }}
      >
        <Outlet />
      </main>

      {/* =====================================================
          RESPONSIVE CSS
      ====================================================== */}

      <style>{`
        /* ================================================
           DESKTOP
        ================================================= */

        .mobile-admin-header {
          display: none;
        }

        .mobile-close-button {
          display: none;
        }

        .mobile-sidebar-overlay {
          display: none;
        }


        /* ================================================
           TABLET / MOBILE
        ================================================= */

        @media (max-width: 768px) {

          /* ----------------------------------------------
             MOBILE HEADER
          ---------------------------------------------- */

          .mobile-admin-header {
            position: fixed;
            display: flex;
            align-items: center;
            gap: 14px;

            top: 0;
            left: 0;
            right: 0;

            height: 64px;

            padding: 0 16px;

            box-sizing: border-box;

            background: #ffffff;

            border-bottom: 1px solid #e2e8f0;

            z-index: 90;

            font-size: 18px;

            font-weight: 700;

            color: #0f172a;
          }


          /* ----------------------------------------------
             HAMBURGER BUTTON
          ---------------------------------------------- */

          .mobile-menu-button {
            width: 42px;
            height: 42px;

            border: 1px solid #e2e8f0;

            border-radius: 10px;

            background: #ffffff;

            color: #0f172a;

            cursor: pointer;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 0;

            transition: 0.2s;
          }

          .mobile-menu-button:hover {
            background: #f8fafc;
          }


          /* ----------------------------------------------
             SIDEBAR
          ---------------------------------------------- */

          .admin-sidebar {
            width: 270px !important;

            max-width: 85vw;

            transform: translateX(-100%);

            transition:
              transform 0.3s ease,
              box-shadow 0.3s ease;

            box-shadow: none;

            z-index: 100 !important;
          }


          /* Sidebar opened */

          .admin-sidebar.mobile-open {
            transform: translateX(0);

            box-shadow:
              8px 0 30px rgba(15, 23, 42, 0.15);
          }


          /* ----------------------------------------------
             CLOSE BUTTON
          ---------------------------------------------- */

          .mobile-close-button {
            position: absolute;

            display: flex;

            align-items: center;
            justify-content: center;

            top: 18px;
            right: 18px;

            width: 38px;
            height: 38px;

            padding: 0;

            border: 1px solid #e2e8f0;

            border-radius: 10px;

            background: #ffffff;

            color: #475569;

            cursor: pointer;

            z-index: 5;
          }


          /* ----------------------------------------------
             MAIN CONTENT
          ---------------------------------------------- */

          .admin-main {
            margin-left: 0 !important;

            width: 100% !important;

            height: 100vh;

            padding:
              80px
              16px
              24px
              16px !important;

            box-sizing: border-box;
          }


          /* ----------------------------------------------
             OVERLAY
          ---------------------------------------------- */

          .mobile-sidebar-overlay {
            display: block;

            position: fixed;

            inset: 0;

            background:
              rgba(15, 23, 42, 0.45);

            z-index: 95;
          }
        }


        /* ================================================
           SMALL PHONES
        ================================================= */

        @media (max-width: 480px) {

          .mobile-admin-header {
            height: 60px;

            padding: 0 12px;

            font-size: 17px;
          }


          .mobile-menu-button {
            width: 40px;
            height: 40px;
          }


          .mobile-close-button {
            top: 16px;
            right: 16px;

            width: 36px;
            height: 36px;
          }


          .admin-main {
            padding:
              76px
              12px
              20px
              12px !important;
          }
        }
      `}</style>
    </div>
  );
}