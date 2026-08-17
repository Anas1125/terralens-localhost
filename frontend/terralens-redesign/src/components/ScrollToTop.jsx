import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Tell the browser not to try and restore scroll position on reload/navigation
    if ("scrollRestoration" in window) {
      window.history.scrollRestoration = "manual";
    }

    // 2. Force scroll to top instantly
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // "instant" bypasses smooth scrolling delays
    });
  }, [pathname]);

  return null;
}