import { createContext, useContext, useState, useMemo, useEffect } from "react";


// Topbar config comes from pages (title, search placeholder, buttons)
const ToolbarContext = createContext(null);
export const useToolbarStore = () => useContext(ToolbarContext);


export function ToolbarProvider({ children }) {
const [cfg, setCfg] = useState({ title: "Dashboard", searchPlaceholder: "Search…", actions: [] });
const value = useMemo(() => ({ cfg, setCfg }), [cfg]);
return <ToolbarContext.Provider value={value}>{children}</ToolbarContext.Provider>;
}


// ✅ SAFE version: set toolbar from pages via an effect (no state updates during render)
export function useToolbar(config) {
const { setCfg } = useToolbarStore();


// Memoize the incoming config so the effect only runs when meaningful bits change
const stable = useMemo(() => ({
title: config?.title,
subtitle: config?.subtitle,
searchPlaceholder: config?.searchPlaceholder,
onSearch: config?.onSearch,
actions: Array.isArray(config?.actions) ? config.actions : [],
}), [
config?.title,
config?.subtitle,
config?.searchPlaceholder,
config?.onSearch,
JSON.stringify(config?.actions || []),
]);


useEffect(() => {
setCfg(stable);
}, [stable, setCfg]);
}