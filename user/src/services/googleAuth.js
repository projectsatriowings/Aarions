/**
 * Dynamically loads Google Identity Services (GSI) script on demand.
 * This removes render-blocking external scripts from the initial page load
 * and only loads GSI when Google authentication is actually triggered.
 */
let gsiPromise = null;

export function loadGoogleGsi() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window is not available"));
  }

  if (window.google?.accounts?.oauth2) {
    return Promise.resolve(window.google);
  }

  if (!gsiPromise) {
    gsiPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existing) {
        if (window.google?.accounts?.oauth2) {
          return resolve(window.google);
        }
        existing.addEventListener("load", () => resolve(window.google));
        existing.addEventListener("error", (err) => reject(err));
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google);
      script.onerror = (err) => {
        gsiPromise = null;
        reject(err);
      };
      document.head.appendChild(script);
    });
  }

  return gsiPromise;
}

