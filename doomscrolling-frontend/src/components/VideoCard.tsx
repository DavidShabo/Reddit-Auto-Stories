"use client";

import { useEffect, useRef, useState } from "react";
import type { FeedVideo } from "./types";
import { useInView } from "./useInView";
import DoomActionHud from "./DoomActionHud";

const TOP_SAFE_PX = 64; // space for your fixed header text

export default function VideoCard({ item }: { item: FeedVideo }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.7 });

  const [muted, setMuted] = useState(true);
  const [pausedByUser, setPausedByUser] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);

    setPlaying(!v.paused);

    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (inView && !pausedByUser) v.play().catch(() => {});
    else v.pause();
  }, [inView, pausedByUser]);

  useEffect(() => {
    const v = videoRef.current;
    if (v) v.muted = muted;
  }, [muted]);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      setPausedByUser(false);
      v.play().catch(() => {});
    } else {
      setPausedByUser(true);
      v.pause();
    }
  }

  // Narrower, more like Shorts/TikTok desktop
  const VIDEO_MAX_W = 400; // try 380–420 to taste

  return (
    <section ref={ref} className="relative h-[100svh] w-screen snap-start snap-always">
      {/* background */}
      <div className="absolute inset-0 bg-black/65" />

{/* content area below header (true vertical centering) */}
<div
  className="relative z-10 w-full"
  style={{
    height: `calc(100svh - ${TOP_SAFE_PX}px)`,
    marginTop: `${TOP_SAFE_PX}px`,
    paddingTop: "12px",
  }}
>
  <div
    className="
      mx-auto grid h-full
      grid-cols-[1fr_auto_1fr]
      items-center
      gap-3
      px-4
    "
  >

          {/* LEFT: caption/info (closer to video) */}
          <div className="hidden lg:flex justify-end">
            <div className="w-[260px]">
              <div className="rounded-2xl bg-doom-panel/55 p-4 shadow-hud ring-1 ring-doom-steel/20 backdrop-blur">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-doom-acid shadow-[0_0_18px_rgba(107,255,107,0.6)]" />
                  <span className="text-[10px] tracking-[0.35em] text-doom-steel/80">
                    REDDIT STORY
                  </span>
                </div>

                <div className="mt-2 text-xs text-doom-steel/80">
                  {item.subreddit ? `r/${item.subreddit}` : "REDDIT"}
                </div>

                <div className="mt-3 text-sm font-semibold leading-snug">
                  {item.title}
                </div>

                {item.author && (
                  <div className="mt-2 text-xs text-doom-steel/70">u/{item.author}</div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-doom-panel2 px-3 py-1 text-[11px] text-doom-acid">
                    PARKOUR CAM
                  </span>
                </div>

                <div className="mt-3 text-[11px] leading-relaxed text-doom-steel/70">
                  {item.caption ?? "Subtitles generated from Reddit story."}
                </div>
              </div>
            </div>
          </div>

          {/* CENTER: video (truly centered) */}
          <div className="flex justify-center">
            <div
              className="relative aspect-[9/16] overflow-hidden rounded-2xl ring-1 ring-doom-steel/25 shadow-2xl"
              style={{
                width: "min(92vw, 400px)",
                height: `calc(100svh - ${TOP_SAFE_PX}px - 20px)`,
                maxWidth: `${VIDEO_MAX_W}px`,
              }}
            >
              <button
                onClick={togglePlay}
                className="absolute inset-0 z-10 cursor-pointer"
                aria-label="Toggle play"
              >
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover rounded-2xl"
                  src={item.videoUrl}
                  playsInline
                  loop
                  muted
                  preload="metadata"
                />
              </button>

              {/* vignette */}
              <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-b from-black/55 via-transparent to-black/70" />
              <div className="pointer-events-none absolute inset-0 z-20 [box-shadow:inset_0_0_120px_rgba(0,0,0,0.85)]" />

              {/* mini HUD tag */}
              <div className="pointer-events-none absolute left-4 top-4 z-30 inline-flex items-center gap-2 rounded-xl bg-doom-panel/70 px-3 py-2 shadow-hud backdrop-blur">
                <span className="text-[10px] tracking-[0.25em] text-doom-steel">
                  DOOMSCROLLING
                </span>
                <span className="h-1 w-1 rounded-full bg-doom-red shadow-[0_0_14px_rgba(225,6,0,0.55)]" />
              </div>

              {/* corner brackets */}
              <div className="pointer-events-none absolute left-3 top-3 z-40 h-6 w-6 border-l-2 border-t-2 border-doom-red/80" />
              <div className="pointer-events-none absolute right-3 top-3 z-40 h-6 w-6 border-r-2 border-t-2 border-doom-red/80" />
              <div className="pointer-events-none absolute left-3 bottom-3 z-40 h-6 w-6 border-l-2 border-b-2 border-doom-red/80" />
              <div className="pointer-events-none absolute right-3 bottom-3 z-40 h-6 w-6 border-r-2 border-b-2 border-doom-red/80" />
            </div>
          </div>

          {/* RIGHT: actions (closer to video) */}
          <div className="flex justify-start">
            <div className="w-[180px]">
              <DoomActionHud
                muted={muted}
                onToggleMute={() => setMuted((m) => !m)}
                onCopyLink={() => navigator.clipboard?.writeText(item.videoUrl)}
                onTogglePlay={togglePlay}
                playing={playing}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
