import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Disable automatic browser scroll restoration on mount
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;

    // Helper to scroll to top instantly by bypassing smooth scroll style
    const scrollToTopInstant = () => {
      const originalScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      html.style.scrollBehavior = originalScrollBehavior;
    };

    // Scroll immediately
    scrollToTopInstant();

    // Schedule scroll at multiple intervals to handle AnimatePresence layout shifts and exit animations
    const intervals = [50, 100, 150, 200, 300, 400, 500];
    const timers = intervals.map((delay) =>
      setTimeout(scrollToTopInstant, delay)
    );

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [pathname, search, hash]);

  useEffect(() => {
    // Intercept clicks on links that point to the current page to scroll to the top
    const handleLinkClick = (e) => {
      const target = e.target.closest("a");
      if (target) {
        const href = target.getAttribute("href");
        if (href && href !== "#") {
          try {
            const currentUrl = new URL(window.location.href);
            const targetUrl = new URL(href, window.location.href);

            // If navigating to the current page (same pathname & search params) and it's not a hash anchor link
            if (
              currentUrl.pathname === targetUrl.pathname &&
              currentUrl.search === targetUrl.search &&
              !targetUrl.hash
            ) {
              const html = document.documentElement;
              const originalScrollBehavior = html.style.scrollBehavior;
              html.style.scrollBehavior = "auto";
              window.scrollTo(0, 0);
              html.style.scrollBehavior = originalScrollBehavior;
            }
          } catch (err) {
            // Ignore malformed URLs
          }
        }
      }
    };

    document.addEventListener("click", handleLinkClick);
    return () => document.removeEventListener("click", handleLinkClick);
  }, []);

  return null;
}

