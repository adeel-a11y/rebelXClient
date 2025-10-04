import { createContext, useContext, useState, useMemo } from "react";


const UIContext = createContext(null);
export const useUI = () => useContext(UIContext);


export function UIProvider({ children }) {
const [collapsed, setCollapsed] = useState(false);
const value = useMemo(() => ({ collapsed, toggleSidebar: () => setCollapsed(c => !c) }), [collapsed]);
return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}