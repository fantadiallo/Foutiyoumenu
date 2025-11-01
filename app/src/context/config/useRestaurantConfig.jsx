import { createContext, useContext, useEffect, useState } from "react";

const RestaurantConfigCtx = createContext(null);

export function RestaurantConfigProvider({ children }) {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetch("/config/restaurant.config.json", { cache: "no-store" })
      .then(r => {
        if (!r.ok) throw new Error(`Config  HTTP ${r.status}`);
        return r.json();
      })
      .then(cfg => {
        setConfig(cfg);
        const root = document.documentElement;
        root.style.setProperty("--indigo", cfg?.brand?.primaryColor || "#1E2A44");
        root.style.setProperty("--sand", cfg?.brand?.accentColor || "#D9C7A1");
      })
      .catch(err => {
        console.error("Failed to load restaurant config:", err);
      });
  }, []);

  if (!config) return null; // or a small loader
  return (
    <RestaurantConfigCtx.Provider value={config}>
      {children}
    </RestaurantConfigCtx.Provider>
  );
}

export function useRestaurantConfig() {
  return useContext(RestaurantConfigCtx);
}
