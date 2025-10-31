import { createContext, useContext, useEffect, useState } from "react";

const RestaurantConfigCtx = createContext(null);

export function RestaurantConfigProvider({ children, path = "/config/restaurant.config.json" }) {
  const [config, setConfig] = useState(null);
  useEffect(() => { fetch(path).then(r=>r.json()).then(setConfig); }, [path]);
  if (!config) return null;
  return <RestaurantConfigCtx.Provider value={config}>{children}</RestaurantConfigCtx.Provider>;
}

export function useRestaurantConfig(){ return useContext(RestaurantConfigCtx); }
