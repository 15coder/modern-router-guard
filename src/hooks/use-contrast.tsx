import { useEffect, useState } from "react";

const KEY = "siyaj.contrast";

export function useContrast() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const v = typeof window !== "undefined" && localStorage.getItem(KEY) === "1";
    setOn(v);
    document.documentElement.classList.toggle("contrast", v);
  }, []);

  const toggle = () => {
    setOn((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("contrast", next);
      try { localStorage.setItem(KEY, next ? "1" : "0"); } catch {}
      return next;
    });
  };

  return { on, toggle };
}
