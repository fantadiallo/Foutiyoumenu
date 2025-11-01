import { createContext, useContext, useEffect, useState } from "react";
import { applyTheme } from "../../styles/setTheme";

const RestaurantConfigCtx = createContext(null);

export function RestaurantConfigProvider({ children }) {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetch("/config/restaurant.config.json")
      .then((r) => r.json())
      .then((cfg) => {
        setConfig(cfg);
        applyTheme(cfg.brand);
      })
      .catch((err) => console.error("Failed to load config", err));
  }, []);

  if (!config) return null; // optional loading state
  return (
    <RestaurantConfigCtx.Provider value={config}>
      {children}
    </RestaurantConfigCtx.Provider>
  );
}

export function useRestaurantConfig() {
  return useContext(RestaurantConfigCtx);
}
