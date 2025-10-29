// src/components/activities/useDebouncedCallback.js
import { useRef, useMemo, useEffect } from "react";

export function useDebouncedCallback(callback, delay) {
  const cbRef = useRef(callback);
  useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  const timerRef = useRef(null);

  return useMemo(
    () => (value) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => cbRef.current(value), delay);
      console.log("useDebouncedCallback", value);
    },
    [delay]
  );
}
