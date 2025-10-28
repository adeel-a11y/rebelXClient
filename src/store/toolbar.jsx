// ---- src/store/toolbar.js ----
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";

const ToolbarContext = createContext(null);
export const useToolbarStore = () => useContext(ToolbarContext);

export function ToolbarProvider({ children }) {
  const [cfg, setCfg] = useState({
    title: "Dashboard",
    subtitle: "",
    showSearch: true,
    searchPlaceholder: "Search…",
    onSearch: null,
    actions: [],
    backButton: false, // 👈 NEW
  });

  const value = useMemo(() => ({ cfg, setCfg }), [cfg]);

  return (
    <ToolbarContext.Provider value={value}>
      {children}
    </ToolbarContext.Provider>
  );
}

const shallowEqual = (a, b) => {
  if (a === b) return true;
  const ka = Object.keys(a),
    kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) if (a[k] !== b[k]) return false;
  return true;
};

export function useToolbar(config) {
  const { setCfg } = useToolbarStore();

  // hide search if explicitly set to null
  const searchDisabled = config?.search === null;

  // keep latest onSearch ref IF search is enabled
  const onSearchRef = useRef(
    searchDisabled ? null : config?.onSearch ?? null
  );
  useEffect(() => {
    onSearchRef.current = searchDisabled ? null : config?.onSearch ?? null;
  }, [config?.onSearch, searchDisabled]);

  // stable actions
  const actionsKey = JSON.stringify(config?.actions || []);
  const actions = useMemo(
    () => (Array.isArray(config?.actions) ? config.actions : []),
    [actionsKey]
  );

  const stable = useMemo(
    () => ({
      title: config?.title ?? "",
      subtitle: config?.subtitle ?? "",

      // back icon config 👇
      backButton: !!config?.backButton, // default false

      showSearch: !searchDisabled,
      searchPlaceholder: searchDisabled
        ? null
        : config?.searchPlaceholder ?? "Search…",
      onSearch: searchDisabled
        ? null
        : (...args) => onSearchRef.current?.(...args),

      actions,
    }),
    [
      config?.title,
      config?.subtitle,
      config?.backButton,
      config?.searchPlaceholder,
      actions,
      searchDisabled,
    ]
  );

  useEffect(() => {
    setCfg((prev) => (shallowEqual(prev, stable) ? prev : stable));
  }, [stable, setCfg]);
}
