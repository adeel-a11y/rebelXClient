// ---- src/store/toolbar.js ----
import { createContext, useContext, useState, useMemo, useEffect, useRef } from "react";

// Topbar config comes from pages (title, search placeholder, buttons)
const ToolbarContext = createContext(null);
export const useToolbarStore = () => useContext(ToolbarContext);

export function ToolbarProvider({ children }) {
  const [cfg, setCfg] = useState({
    title: "Dashboard",
    searchPlaceholder: "Search…",
    actions: [],
  });
  const value = useMemo(() => ({ cfg, setCfg }), [cfg]);
  return <ToolbarContext.Provider value={value}>{children}</ToolbarContext.Provider>;
}

const shallowEqual = (a, b) => {
  if (a === b) return true;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) if (a[k] !== b[k]) return false;
  return true;
};

// ✅ SAFE version: effect se set, stable identity + function refs so no loops
export function useToolbar(config) {
  const { setCfg } = useToolbarStore();

  // keep latest onSearch but expose a stable wrapper
  const onSearchRef = useRef(config?.onSearch);
  useEffect(() => {
    onSearchRef.current = config?.onSearch;
  }, [config?.onSearch]);

  const actionsKey = JSON.stringify(config?.actions || []);
  const actions = useMemo(
    () => (Array.isArray(config?.actions) ? config.actions : []),
    [actionsKey]
  );

  const stable = useMemo(
    () => ({
      title: config?.title ?? "",
      subtitle: config?.subtitle ?? "",
      searchPlaceholder: config?.searchPlaceholder ?? "Search…",
      onSearch: (...args) => onSearchRef.current?.(...args),
      actions,
    }),
    [config?.title, config?.subtitle, config?.searchPlaceholder, actions]
  );

  useEffect(() => {
    setCfg((prev) => (shallowEqual(prev, stable) ? prev : stable));
  }, [stable, setCfg]);
}
