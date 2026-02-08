"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import VideoCard from "./VideoCard";
import type { FeedVideo } from "./types";

function mockPage(page: number): FeedVideo[] {
  return Array.from({ length: 6 }).map((_, i) => {
    const idx = page * 6 + i + 1;
    return {
      id: `V${String(idx).padStart(3, "0")}`,
      videoUrl: "/output/final.mp4", 
      title: `Reddit Story #${idx}`,
      subreddit: "AITA",
      author: "some_throwaway",
      caption: "Tap to pause. Scroll to rip and tear into the next one.",
      createdAt: new Date().toISOString(),
    };
  });
}

export default function VideoFeed() {
  const [items, setItems] = useState<FeedVideo[]>(() => mockPage(0));
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const obs = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || loading) return;

        setLoading(true);
        const next = page + 1;

       
        await new Promise((r) => setTimeout(r, 250));
        const data = mockPage(next);

        setItems((prev) => [...prev, ...data]);
        setPage(next);
        setLoading(false);
      },
      { root: null, threshold: 0.2 }
    );

    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [page, loading]);

  const hint = useMemo(
    () => (
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <div className="rounded-full bg-doom-panel/80 px-4 py-2 text-[11px] tracking-widest text-doom-steel shadow-hud backdrop-blur">
          SCROLL TO CONTINUE ▼
        </div>
      </div>
    ),
    []
  );

  return (
    <>
      {hint}
      <div
        ref={containerRef}
        className="h-[100svh] w-screen snap-y snap-mandatory overflow-y-scroll overscroll-contain"
      >
        {items.map((item) => (
          <VideoCard key={item.id} item={item} />
        ))}

        <div ref={sentinelRef} className="h-24 w-full bg-doom-bg">
          <div className="mx-auto flex h-full max-w-4xl items-center justify-center px-4">
            <div className="rounded-xl bg-doom-panel/70 px-4 py-3 text-xs text-doom-steel shadow-hud backdrop-blur">
              {loading ? "LOADING MORE..." : "ENDLESS DOOMSCROLLING"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
