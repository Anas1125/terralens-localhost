import { useEffect } from "react";
import { getSettings } from "../api/settings";

function FaviconManager() {
  useEffect(() => {
    const loadFavicon = async () => {
      try {
        const settings = await getSettings();

        if (!settings?.favicon) {
          return;
        }

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

  return null;
}

export default FaviconManager;