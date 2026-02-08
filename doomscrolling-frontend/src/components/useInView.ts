"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  const opts = useMemo(
    () => ({
      root: null,
      rootMargin: "0px",
      threshold: 0.65,
      ...options,
    }),
    [options]
  );

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    const obs = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, opts);

    obs.observe(el);
    return () => obs.unobserve(el);
  }, [opts]);

  return { ref, inView };
}
