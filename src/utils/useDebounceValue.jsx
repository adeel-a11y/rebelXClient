// utils/useDebouncedValue.js (or place at top of ClientDetails.jsx)
import * as React from "react";

export function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
