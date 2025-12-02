"use client";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

/**
 * AppContextProvider (server-safe theme handling)
 *
 * - mode === null  => we are still on the initial client mount phase (server-safe)
 * - mode === "light" | "dark" => actual theme value
 *
 * Components that consume mode should handle mode === null by rendering a neutral UI
 * (no theme-specific classes) or a lightweight placeholder to avoid SSR/client mismatch.
 */
const AppContextProvider = ({ children }) => {
  // start with null so SSR and initial client render match
  const [mode, setMode] = useState(null);

  // determine actual mode on client
  useEffect(() => {
    // read saved preference (client-only)
    const saved = typeof window !== "undefined" ? localStorage.getItem("mode") : null;

    // fallback to system preference if not set
    const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved || (prefersDark ? "dark" : "light");

    setMode(initial);

    // ensure html class matches selected mode
    if (initial === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // keep localStorage & html class in sync when user toggles mode
  useEffect(() => {
    if (mode === null) return; // skip until we've resolved the real mode
    try {
      localStorage.setItem("mode", mode);
    } catch (e) {
      // ignore if localStorage isn't available
    }
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  // provide mode which can be null for a short moment on initial load
  return <AppContext.Provider value={{ mode, setMode }}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
